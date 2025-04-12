// "use client"

// import type React from "react"

// import { useState, useRef, useEffect } from "react"
// import { useRouter, useSearchParams } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent } from "@/components/ui/card"
// import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
// import { toast } from "@/components/ui/use-toast"
// import { Mic, Upload, StopCircle, Loader2 } from "lucide-react"

// export default function AudioInputPage() {
//   const router = useRouter()
//   const searchParams = useSearchParams()
//   const templateId = searchParams.get("template")

//   const [isRecording, setIsRecording] = useState(false)
//   const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
//   const [isUploading, setIsUploading] = useState(false)
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [isLoading, setIsLoading] = useState(true)

//   const mediaRecorderRef = useRef<MediaRecorder | null>(null)
//   const audioChunksRef = useRef<Blob[]>([])

//   useEffect(() => {
//     // Check if user is authenticated and template is selected
//     const checkAuth = async () => {
//       try {
//         const response = await fetch("http://localhost:5000/api/check-auth", {
//           credentials: "include",
//         })

//         if (response.ok) {
//           setIsAuthenticated(true)

//           if (!templateId) {
//             toast({
//               title: "No template selected",
//               description: "Please select a template first.",
//               variant: "destructive",
//             })
//             router.push("/templates")
//           }
//         } else {
//           router.push("/login")
//         }
//       } catch (error) {
//         toast({
//           title: "Authentication Error",
//           description: "Please log in to continue.",
//           variant: "destructive",
//         })
//         router.push("/login")
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     checkAuth()
//   }, [router, templateId])

//   const startRecording = async () => {
//     try {
//       const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
//       mediaRecorderRef.current = new MediaRecorder(stream)
//       audioChunksRef.current = []

//       mediaRecorderRef.current.ondataavailable = (event) => {
//         if (event.data.size > 0) {
//           audioChunksRef.current.push(event.data)
//         }
//       }

//       mediaRecorderRef.current.onstop = () => {
//         const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
//         setAudioBlob(audioBlob)

//         // Stop all tracks on the stream to release the microphone
//         stream.getTracks().forEach((track) => track.stop())
//       }

//       mediaRecorderRef.current.start()
//       setIsRecording(true)
//     } catch (error) {
//       console.error("Error accessing microphone:", error)
//       toast({
//         title: "Microphone Error",
//         description: "Could not access your microphone. Please check permissions.",
//         variant: "destructive",
//       })
//     }
//   }

//   const stopRecording = () => {
//     if (mediaRecorderRef.current && isRecording) {
//       mediaRecorderRef.current.stop()
//       setIsRecording(false)
//     }
//   }

//   const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
//     const file = event.target.files?.[0]
//     if (file) {
//       // Check if file is an audio file
//       if (!file.type.startsWith("audio/")) {
//         toast({
//           title: "Invalid file type",
//           description: "Please upload an audio file.",
//           variant: "destructive",
//         })
//         return
//       }

//       setAudioBlob(file)
//     }
//   }

//   const handleSubmit = async () => {
//     if (!audioBlob) {
//       toast({
//         title: "No audio",
//         description: "Please record or upload an audio file.",
//         variant: "destructive",
//       })
//       return
//     }

//     setIsUploading(true)

//     try {
//       // Create form data to send audio and template ID
//       const formData = new FormData()
//       formData.append("audio", audioBlob)
//       formData.append("templateId", templateId || "")

//       // Send to Flask backend
//       const response = await fetch("http://localhost:5000/api/process-audio", {
//         method: "POST",
//         body: formData,
//         credentials: "include",
//       })

//       if (response.ok) {
//         const data = await response.json()

//         // Navigate to resume preview page with the resume ID
//         router.push(`/resume-preview?id=${data.resumeId}`)
//       } else {
//         const errorData = await response.json()
//         toast({
//           title: "Processing Error",
//           description: errorData.message || "Failed to process audio. Please try again.",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred while processing your audio. Please try again.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsUploading(false)
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p>Loading...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-12 px-6">
//       <h1 className="text-3xl font-bold mb-8">Record or Upload Audio</h1>
//       <p className="text-gray-600 mb-8">
//         Tell us about your experience, skills, education, and other relevant information for your resume. Speak clearly
//         and provide as much detail as possible for the best results.
//       </p>

//       <Tabs defaultValue="record" className="max-w-2xl mx-auto">
//         <TabsList className="grid w-full grid-cols-2 mb-8">
//           <TabsTrigger value="record">Record Audio</TabsTrigger>
//           <TabsTrigger value="upload">Upload Audio</TabsTrigger>
//         </TabsList>

//         <TabsContent value="record">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex flex-col items-center justify-center p-8 space-y-6">
//                 <div
//                   className={`w-32 h-32 rounded-full flex items-center justify-center ${isRecording ? "bg-red-100 animate-pulse" : "bg-gray-100"}`}
//                 >
//                   {isRecording ? (
//                     <StopCircle size={48} className="text-red-500" />
//                   ) : (
//                     <Mic size={48} className="text-gray-500" />
//                   )}
//                 </div>

//                 {audioBlob && !isRecording && (
//                   <div className="w-full">
//                     <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
//                   </div>
//                 )}

//                 <div className="flex space-x-4">
//                   {!isRecording ? (
//                     <Button onClick={startRecording} disabled={isUploading}>
//                       Start Recording
//                     </Button>
//                   ) : (
//                     <Button onClick={stopRecording} variant="destructive">
//                       Stop Recording
//                     </Button>
//                   )}

//                   {audioBlob && !isRecording && (
//                     <Button onClick={() => setAudioBlob(null)} variant="outline">
//                       Discard
//                     </Button>
//                   )}
//                 </div>
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>

//         <TabsContent value="upload">
//           <Card>
//             <CardContent className="pt-6">
//               <div className="flex flex-col items-center justify-center p-8 space-y-6">
//                 <div className="w-32 h-32 rounded-full bg-gray-100 flex items-center justify-center">
//                   <Upload size={48} className="text-gray-500" />
//                 </div>

//                 <div className="w-full">
//                   <input
//                     type="file"
//                     accept="audio/*"
//                     onChange={handleFileUpload}
//                     className="hidden"
//                     id="audio-upload"
//                   />
//                   <label htmlFor="audio-upload">
//                     <Button variant="outline" className="w-full" as="span">
//                       Choose Audio File
//                     </Button>
//                   </label>
//                 </div>

//                 {audioBlob && (
//                   <div className="w-full">
//                     <p className="text-sm text-gray-500 mb-2">Selected file:</p>
//                     <audio src={URL.createObjectURL(audioBlob)} controls className="w-full" />
//                     <Button onClick={() => setAudioBlob(null)} variant="outline" size="sm" className="mt-2">
//                       Remove
//                     </Button>
//                   </div>
//                 )}
//               </div>
//             </CardContent>
//           </Card>
//         </TabsContent>
//       </Tabs>

//       <div className="flex justify-center mt-8">
//         <Button size="lg" onClick={handleSubmit} disabled={!audioBlob || isUploading}>
//           {isUploading ? (
//             <>
//               <Loader2 className="mr-2 h-4 w-4 animate-spin" />
//               Processing...
//             </>
//           ) : (
//             "Continue"
//           )}
//         </Button>
//       </div>

//       <div className="mt-8 max-w-2xl mx-auto bg-gray-50 p-6 rounded-lg">
//         <h3 className="font-semibold text-lg mb-4">Tips for best results:</h3>
//         <ul className="list-disc pl-5 space-y-2 text-gray-600">
//           <li>Speak clearly and at a moderate pace</li>
//           <li>Include your name, contact information, and professional summary</li>
//           <li>Describe your work experience with dates, company names, and responsibilities</li>
//           <li>List your education, certifications, and relevant skills</li>
//           <li>Mention any achievements or awards</li>
//           <li>Record in a quiet environment to minimize background noise</li>
//         </ul>
//       </div>
//     </div>
//   )
// }







"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Mic, StopCircle, Play, ArrowLeft } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function AudioInput() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const templateId = searchParams.get("template") || ""
  const categoryId = searchParams.get("category") || ""

  const [isRecording, setIsRecording] = useState(false)
  const [audioBlob, setAudioBlob] = useState<Blob | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const [recordingTime, setRecordingTime] = useState(0)
  const mediaRecorderRef = useRef<MediaRecorder | null>(null)
  const audioChunksRef = useRef<Blob[]>([])
  const timerRef = useRef<NodeJS.Timeout | null>(null)

  // Template categories mapping for display purposes
  const categoryNames: Record<string, string> = {
    "1": "Professional",
    "2": "Creative",
    "3": "Minimal",
    "4": "Executive",
  }

  // Template names mapping
  const templateNames: Record<string, string> = {
    // Professional templates
    p1: "Corporate",
    p2: "Business",
    p3: "Executive Pro",
    p4: "Modern Professional",
    p5: "Classic",
    // Creative templates
    c1: "Designer",
    c2: "Artistic",
    c3: "Digital Creative",
    c4: "Portfolio Plus",
    c5: "Innovation",
    // Minimal templates
    m1: "Clean",
    m2: "Simplicity",
    m3: "Essentials",
    m4: "Minimalist Pro",
    m5: "Whitespace",
    // Executive templates
    e1: "Leadership",
    e2: "C-Suite",
    e3: "Director",
    e4: "Board Member",
    e5: "Executive Elite",
  }

  useEffect(() => {
    return () => {
      if (timerRef.current) {
        clearInterval(timerRef.current)
      }
    }
  }, [])

  const startRecording = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
      const mediaRecorder = new MediaRecorder(stream)
      mediaRecorderRef.current = mediaRecorder
      audioChunksRef.current = []

      mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          audioChunksRef.current.push(event.data)
        }
      }

      mediaRecorder.onstop = () => {
        const audioBlob = new Blob(audioChunksRef.current, { type: "audio/wav" })
        setAudioBlob(audioBlob)

        // Stop all tracks in the stream
        stream.getTracks().forEach((track) => track.stop())
      }

      mediaRecorder.start()
      setIsRecording(true)
      setRecordingTime(0)

      // Start timer
      timerRef.current = setInterval(() => {
        setRecordingTime((prev) => prev + 1)
      }, 1000)
    } catch (error) {
      console.error("Error accessing microphone:", error)
      alert("Could not access your microphone. Please check permissions.")
    }
  }

  const stopRecording = () => {
    if (mediaRecorderRef.current && isRecording) {
      mediaRecorderRef.current.stop()
      setIsRecording(false)

      // Stop timer
      if (timerRef.current) {
        clearInterval(timerRef.current)
        timerRef.current = null
      }
    }
  }

  const playRecording = () => {
    if (audioBlob) {
      const audioUrl = URL.createObjectURL(audioBlob)
      const audio = new Audio(audioUrl)
      audio.play()
    }
  }

  const processAudio = () => {
    if (!audioBlob) return

    setIsProcessing(true)

    // In a real application, you would upload the audio to your backend for processing
    // For this example, we'll simulate processing with a timeout
    setTimeout(() => {
      setIsProcessing(false)
      // Navigate to a page that would display the generated resume
      router.push(`/resume-preview?template=${templateId}&category=${categoryId}`)
    }, 3000)
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`
  }

  const handleGoBack = () => {
    router.push(`/preview-template/${categoryId}/${templateId}`)
  }

  return (
    <div className="container mx-auto py-8 px-6">
      <Button variant="ghost" size="sm" className="mb-6" onClick={handleGoBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to template
      </Button>

      <Card className="max-w-md mx-auto">
        <CardHeader>
          <CardTitle>Record Your Resume Details</CardTitle>
          <CardDescription>
            You selected the {categoryNames[categoryId]} - {templateNames[templateId]} template. Now, tell us about your
            experience, skills, and education.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center py-8">
            {isRecording ? (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-red-100 flex items-center justify-center mb-4 animate-pulse">
                  <Mic className="h-12 w-12 text-red-500" />
                </div>
                <div className="text-xl font-bold mb-2">{formatTime(recordingTime)}</div>
                <p className="text-sm text-gray-500 mb-4">Recording in progress...</p>
                <Button variant="destructive" onClick={stopRecording}>
                  <StopCircle className="mr-2 h-4 w-4" />
                  Stop Recording
                </Button>
              </div>
            ) : audioBlob ? (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-green-100 flex items-center justify-center mb-4">
                  <Play className="h-12 w-12 text-green-500" />
                </div>
                <p className="text-sm text-gray-500 mb-4">Recording complete! ({formatTime(recordingTime)})</p>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={playRecording}>
                    <Play className="mr-2 h-4 w-4" />
                    Play Recording
                  </Button>
                  <Button variant="outline" onClick={startRecording}>
                    <Mic className="mr-2 h-4 w-4" />
                    Record Again
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center">
                <div className="w-24 h-24 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                  <Mic className="h-12 w-12 text-gray-500" />
                </div>
                <p className="text-sm text-gray-500 mb-4">
                  Tap the button below and start talking about your resume details
                </p>
                <Button onClick={startRecording}>
                  <Mic className="mr-2 h-4 w-4" />
                  Start Recording
                </Button>
              </div>
            )}
          </div>
        </CardContent>
        <CardFooter className="flex justify-between">
          <p className="text-xs text-gray-500">
            Speak clearly and include your experience, education, skills, and contact information.
          </p>
          {audioBlob && (
            <Button onClick={processAudio} disabled={isProcessing}>
              {isProcessing ? "Processing..." : "Generate Resume"}
            </Button>
          )}
        </CardFooter>
      </Card>
    </div>
  )
}
