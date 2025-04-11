"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { toast } from "@/components/ui/use-toast"
import { Mic, Upload, StopCircle, Loader2 } from "lucide-react"

export default function AudioInputPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template")

  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])

  useEffect(() => {
    // Check if user is authenticated and template is selected
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/check-auth", {
          credentials: "include",
        })

        if (response.ok) {
          setIsAuthenticated(true)

          if (!templateId) {
            toast({
              title: "No template selected",
              description: "Please select a template first.",
              variant: "destructive",
            })
            router.push("/templates")
          }
        } else {
          router.push("/login")
        }
      } catch (error) {
        toast({
          title: "Authentication Error",
          description: "Please log in to continue.",
          variant: "destructive",
        })
        router.push("/login")
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [router, templateId])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      mediaRecorderRef.current = new MediaRecorder(stream)
      audioChunksRef.current = []

      mediaRecorderRef.current.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorderRef.current.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setAudioBlob(audioBlob)

        // Stop all tracks on the stream to release the microphone
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorderRef.current.start()
      setIsRecording(true)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      toast({
        title: "Microphone Error",
        description: "Could not access your microphone. Please check permissions.",
        variant: "destructive",
      })
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)
    }
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // Check if file is an audio file
      if (!file.type.startsWith("audio/")) {
        toast({
          title: "Invalid file type",
          description: "Please upload an audio file.",
          variant: "destructive",
        })
        return
      }

      setAudioBlob(file)
    }
  }

  const handleSubmit = async () => {
    if (!audioBlob) {
      toast({
        title: "No audio",
        description: "Please record or upload an audio file.",
        variant: "destructive",
      })
      return
    }

    setIsUploading(true)

    try {
      // Create form data to send audio and template ID
      const formData = new FormData()
      formData.append("audio", audioBlob)
      formData.append("templateId", templateId || "")

      // Send to Flask backend
      const response = await fetch("http://localhost:5000/api/process-audio", {
        method: "POST",
        body: formData,
        credentials: "include",
      })

      if (response.ok) {
        const data = await response.json()

        // Navigate to resume preview page with the resume ID
        router.push(`/resume-preview?id=${data.resumeId}`)
      } else {
        const errorData = await response.json()
        toast({
          title: "Processing Error",
          description: errorData.message || "Failed to process audio. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while processing your audio. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsUploading(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Record or Upload Audio</h1>
      <p className="text-gray-600 mb-8">
        Tell us about your experience, skills, education, and other relevant information for your resume. Speak clearly
        and provide as much detail as possible for the best results.
      </p>

      <Tabs defaultValue="record" className="max-w-2xl mx-auto">
        <TabsList className="grid w-full grid-cols-2 mb-8">
          <TabsTrigger value="record">Record Audio</TabsTrigger>
          <TabsTrigger value="upload">Upload Audio</TabsTrigger>
        </TabsList>

        <TabsContent value="record">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-8 space-y-6">
                <div
                  className={`w-32 h-32 rounded-full flex items-center justify-center ${isRecording ? "bg-red-100 animate-pulse" : "bg-gray-100"}`}
                >
                  {isRecording ? (
                    <StopCircle size={48} className="text-red-500" />
                  ) : (
                    <Mic size={48} className="text-gray-500" />
                  )}
                </div>

                {audioBlob && !isRecording && (
                  <div className="w-full">
                    <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
                  </div>
                )}

                <div className="flex space-x-4">
                  {!isRecording ? (
                    <Button onClick={startRecording} disabled={isUploading}>
                      Start Recording
                    </Button>
                  ) : (
                    <Button onClick={stopRecording} variant="destructive">
                      Stop Recording
                    </Button>
                  )}

                  {audioBlob && !isRecording && (
                    <Button onClick={() => setAudioBlob(null)} variant="outline">
                      Discard
                    </Button>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="upload">
          <Card>
            <CardContent className="pt-6">
              <div className="flex flex-col items-center justify-center p-8 space-y-6">
                <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
                  <Upload size={48} className="text-gray-500" />
                </div>

                <div className="w-full">
                  <input
                    type="file"
                    accept="audio/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="audio-upload"
                  />
                  <label htmlFor="audio-upload">
                    <Button variant="outline" className="w-full" as="span">
                      Choose Audio File
                    </Button>
                  </label>
                </div>

                {audioBlob && (
                  <div className="w-full">
                    <p className="text-sm text-gray-500 mb-2">Selected file:</p>
                    <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
                    <Button onClick={() => setAudioBlob(null)} variant="outline" size="sm" className="mt-2">
                      Remove
                    </Button>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <div className="flex justify-center mt-8">
        <Button size="lg" onClick={handleSubmit} disabled={!audioBlob || isUploading}>
          {isUploading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Processing...
            </>
          ) : (
            "Continue"
          )}
        </Button>
      </div>

      <div className="mt-8 max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg">
        <h3 className="font-semibold text-lg mb-4">Tips for best results:</h3>
        <ul className="list-disc pl-5 space-y-2 text-gray-600">
          <li>Speak clearly and at a moderate pace</li>
          <li>Include your name, contact information, and professional summary</li>
          <li>Describe your work experience with dates, company names, and responsibilities</li>
          <li>List your education, certifications, and relevant skills</li>
          <li>Mention any achievements or awards</li>
          <li>Record in a quiet environment to minimize background noise</li>
        </ul>
      </div>
    </div>
  )
}
