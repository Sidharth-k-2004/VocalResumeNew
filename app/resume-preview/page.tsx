"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Download, Save, Edit, Loader2 } from "lucide-react"

export default function ResumePreviewPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const resumeId = searchParams.get("id")

  const [resumeData, setResumeData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)

  useEffect(() => {
    // Fetch resume data from backend
    const fetchResumeData = async () => {
      if (!resumeId) {
        toast({
          title: "No resume ID",
          description: "Resume ID is missing. Please try again.",
          variant: "destructive",
        })
        router.push("/templates")
        return
      }

      try {
        const response = await fetch(`http://localhost:5000/api/resume/${resumeId}`, {
          credentials: "include",
        })

        if (response.ok) {
          const data = await response.json()
          setResumeData(data)
        } else {
          toast({
            title: "Error",
            description: "Failed to load resume data. Please try again.",
            variant: "destructive",
          })
          router.push("/templates")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while loading resume data.",
          variant: "destructive",
        })
        router.push("/templates")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResumeData()
  }, [resumeId, router])

  const handleSaveResume = async () => {
    setIsSaving(true)

    try {
      const response = await fetch(`http://localhost:5000/api/resume/${resumeId}/save`, {
        method: "POST",
        credentials: "include",
      })

      if (response.ok) {
        toast({
          title: "Resume saved",
          description: "Your resume has been saved successfully.",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Save failed",
          description: errorData.message || "Failed to save resume. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while saving your resume.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
  }

  const handleDownloadResume = async () => {
    try {
      const response = await fetch(`http://localhost:5000/api/resume/${resumeId}/download`, {
        credentials: "include",
      })

      if (response.ok) {
        // Create a blob from the PDF data
        const blob = await response.blob()

        // Create a link element and trigger download
        const url = window.URL.createObjectURL(blob)
        const a = document.createElement("a")
        a.href = url
        a.download = `resume-${Date.now()}.pdf`
        document.body.appendChild(a)
        a.click()

        // Clean up
        window.URL.revokeObjectURL(url)
        document.body.removeChild(a)
      } else {
        const errorData = await response.json()
        toast({
          title: "Download failed",
          description: errorData.message || "Failed to download resume. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while downloading your resume.",
        variant: "destructive",
      })
    }
  }

  const handleEditResume = () => {
    router.push(`/edit-resume?id=${resumeId}`)
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your resume...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <h1 className="text-3xl font-bold mb-8">Resume Preview</h1>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="lg:w-3/4">
          <Card className="p-8 shadow-lg bg-white min-h-[800px]">
            {resumeData ? (
              <div className="resume-preview">
                {/* This would be the actual resume preview based on the template and data */}
                <h2 className="text-2xl font-bold">{resumeData.personalInfo.name}</h2>
                <p className="text-gray-600 mb-4">{resumeData.personalInfo.title}</p>

                <div className="flex flex-wrap gap-4 mb-6">
                  {resumeData.personalInfo.email && <span className="text-sm">{resumeData.personalInfo.email}</span>}
                  {resumeData.personalInfo.phone && <span className="text-sm">{resumeData.personalInfo.phone}</span>}
                  {resumeData.personalInfo.location && (
                    <span className="text-sm">{resumeData.personalInfo.location}</span>
                  )}
                </div>

                {resumeData.summary && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-3">Professional Summary</h3>
                    <p>{resumeData.summary}</p>
                  </div>
                )}

                {resumeData.experience && resumeData.experience.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-3">Work Experience</h3>
                    {resumeData.experience.map((exp: any, index: number) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{exp.title}</h4>
                          <span className="text-sm text-gray-600">{exp.dates}</span>
                        </div>
                        <p className="text-gray-700">{exp.company}</p>
                        <p className="mt-2">{exp.description}</p>
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.education && resumeData.education.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-3">Education</h3>
                    {resumeData.education.map((edu: any, index: number) => (
                      <div key={index} className="mb-4">
                        <div className="flex justify-between">
                          <h4 className="font-medium">{edu.degree}</h4>
                          <span className="text-sm text-gray-600">{edu.dates}</span>
                        </div>
                        <p className="text-gray-700">{edu.institution}</p>
                      </div>
                    ))}
                  </div>
                )}

                {resumeData.skills && resumeData.skills.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold border-b pb-2 mb-3">Skills</h3>
                    <div className="flex flex-wrap gap-2">
                      {resumeData.skills.map((skill: string, index: number) => (
                        <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                          {skill}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="text-center py-12">
                <p>No resume data available. Please try again.</p>
              </div>
            )}
          </Card>
        </div>

        <div className="lg:w-1/4">
          <Card className="p-6">
            <h3 className="text-xl font-semibold mb-6">Actions</h3>

            <div className="space-y-4">
              <Button className="w-full justify-start" onClick={handleDownloadResume}>
                <Download className="mr-2 h-4 w-4" />
                Download PDF
              </Button>

              <Button className="w-full justify-start" variant="outline" onClick={handleSaveResume} disabled={isSaving}>
                {isSaving ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="mr-2 h-4 w-4" />
                    Save Resume
                  </>
                )}
              </Button>

              <Button className="w-full justify-start" variant="outline" onClick={handleEditResume}>
                <Edit className="mr-2 h-4 w-4" />
                Edit Resume
              </Button>
            </div>

            <div className="mt-8 pt-6 border-t">
              <h4 className="font-medium mb-2">Resume Details</h4>
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-500">Template:</span>
                  <span>{resumeData?.templateName || "Unknown"}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Created:</span>
                  <span>{new Date(resumeData?.createdAt).toLocaleDateString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-500">Last Updated:</span>
                  <span>{new Date(resumeData?.updatedAt).toLocaleDateString()}</span>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}
