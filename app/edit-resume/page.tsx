"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Loader2, Plus, X, Save } from "lucide-react"

export default function EditResumePage() {
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
        router.push("/dashboard")
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
          router.push("/dashboard")
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while loading resume data.",
          variant: "destructive",
        })
        router.push("/dashboard")
      } finally {
        setIsLoading(false)
      }
    }

    fetchResumeData()
  }, [resumeId, router])

  const handleInputChange = (section: string, field: string, value: string) => {
    setResumeData({
      ...resumeData,
      [section]: {
        ...resumeData[section],
        [field]: value,
      },
    })
  }

  const handleArrayItemChange = (section: string, index: number, field: string, value: string) => {
    const newArray = [...resumeData[section]]
    newArray[index] = {
      ...newArray[index],
      [field]: value,
    }

    setResumeData({
      ...resumeData,
      [section]: newArray,
    })
  }

  const addArrayItem = (section: string, template: any) => {
    setResumeData({
      ...resumeData,
      [section]: [...resumeData[section], template],
    })
  }

  const removeArrayItem = (section: string, index: number) => {
    const newArray = [...resumeData[section]]
    newArray.splice(index, 1)

    setResumeData({
      ...resumeData,
      [section]: newArray,
    })
  }

  const handleSkillChange = (index: number, value: string) => {
    const newSkills = [...resumeData.skills]
    newSkills[index] = value

    setResumeData({
      ...resumeData,
      skills: newSkills,
    })
  }

  const addSkill = () => {
    setResumeData({
      ...resumeData,
      skills: [...resumeData.skills, ""],
    })
  }

  const removeSkill = (index: number) => {
    const newSkills = [...resumeData.skills]
    newSkills.splice(index, 1)

    setResumeData({
      ...resumeData,
      skills: newSkills,
    })
  }

  const handleSaveResume = async () => {
    setIsSaving(true)

    try {
      const response = await fetch(`http://localhost:5000/api/resume/${resumeId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(resumeData),
        credentials: "include",
      })

      if (response.ok) {
        toast({
          title: "Resume updated",
          description: "Your resume has been updated successfully.",
        })
        router.push(`/resume-preview?id=${resumeId}`)
      } else {
        const errorData = await response.json()
        toast({
          title: "Update failed",
          description: errorData.message || "Failed to update resume. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while updating your resume.",
        variant: "destructive",
      })
    } finally {
      setIsSaving(false)
    }
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

  if (!resumeData) {
    return (
      <div className="container mx-auto py-12 px-6 text-center">
        <h1 className="text-3xl font-bold mb-4">Resume Not Found</h1>
        <p className="mb-8">The resume you are looking for could not be found.</p>
        <Button onClick={() => router.push("/dashboard")}>Back to Dashboard</Button>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">Edit Resume</h1>
        <Button onClick={handleSaveResume} disabled={isSaving} className="gap-2">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>

      <div className="space-y-8">
        {/* Personal Information */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-medium">Full Name</label>
                <Input
                  value={resumeData.personalInfo.name || ""}
                  onChange={(e) => handleInputChange("personalInfo", "name", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Professional Title</label>
                <Input
                  value={resumeData.personalInfo.title || ""}
                  onChange={(e) => handleInputChange("personalInfo", "title", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Email</label>
                <Input
                  value={resumeData.personalInfo.email || ""}
                  onChange={(e) => handleInputChange("personalInfo", "email", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Phone</label>
                <Input
                  value={resumeData.personalInfo.phone || ""}
                  onChange={(e) => handleInputChange("personalInfo", "phone", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">Location</label>
                <Input
                  value={resumeData.personalInfo.location || ""}
                  onChange={(e) => handleInputChange("personalInfo", "location", e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <label className="text-sm font-medium">LinkedIn</label>
                <Input
                  value={resumeData.personalInfo.linkedin || ""}
                  onChange={(e) => handleInputChange("personalInfo", "linkedin", e.target.value)}
                />
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Professional Summary */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Professional Summary</h2>
            <div className="space-y-2">
              <Textarea
                rows={4}
                value={resumeData.summary || ""}
                onChange={(e) => setResumeData({ ...resumeData, summary: e.target.value })}
                placeholder="Write a brief summary of your professional background and key qualifications..."
              />
            </div>
          </CardContent>
        </Card>

        {/* Work Experience */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Work Experience</h2>

            {resumeData.experience &&
              resumeData.experience.map((exp: any, index: number) => (
                <div key={index} className="mb-6 pb-6 border-b last:border-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Experience {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeArrayItem("experience", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Job Title</label>
                      <Input
                        value={exp.title || ""}
                        onChange={(e) => handleArrayItemChange("experience", index, "title", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Company</label>
                      <Input
                        value={exp.company || ""}
                        onChange={(e) => handleArrayItemChange("experience", index, "company", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Dates</label>
                      <Input
                        value={exp.dates || ""}
                        onChange={(e) => handleArrayItemChange("experience", index, "dates", e.target.value)}
                        placeholder="e.g., Jan 2020 - Present"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        value={exp.location || ""}
                        onChange={(e) => handleArrayItemChange("experience", index, "location", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2 md:col-span-2">
                      <label className="text-sm font-medium">Description</label>
                      <Textarea
                        rows={3}
                        value={exp.description || ""}
                        onChange={(e) => handleArrayItemChange("experience", index, "description", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() =>
                addArrayItem("experience", {
                  title: "",
                  company: "",
                  dates: "",
                  location: "",
                  description: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Work Experience
            </Button>
          </CardContent>
        </Card>

        {/* Education */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Education</h2>

            {resumeData.education &&
              resumeData.education.map((edu: any, index: number) => (
                <div key={index} className="mb-6 pb-6 border-b last:border-0">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-medium">Education {index + 1}</h3>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeArrayItem("education", index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Degree</label>
                      <Input
                        value={edu.degree || ""}
                        onChange={(e) => handleArrayItemChange("education", index, "degree", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Institution</label>
                      <Input
                        value={edu.institution || ""}
                        onChange={(e) => handleArrayItemChange("education", index, "institution", e.target.value)}
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Dates</label>
                      <Input
                        value={edu.dates || ""}
                        onChange={(e) => handleArrayItemChange("education", index, "dates", e.target.value)}
                        placeholder="e.g., 2016 - 2020"
                      />
                    </div>
                    <div className="space-y-2">
                      <label className="text-sm font-medium">Location</label>
                      <Input
                        value={edu.location || ""}
                        onChange={(e) => handleArrayItemChange("education", index, "location", e.target.value)}
                      />
                    </div>
                  </div>
                </div>
              ))}

            <Button
              variant="outline"
              className="w-full mt-4"
              onClick={() =>
                addArrayItem("education", {
                  degree: "",
                  institution: "",
                  dates: "",
                  location: "",
                })
              }
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Education
            </Button>
          </CardContent>
        </Card>

        {/* Skills */}
        <Card>
          <CardContent className="pt-6">
            <h2 className="text-xl font-semibold mb-4">Skills</h2>

            <div className="space-y-4">
              {resumeData.skills &&
                resumeData.skills.map((skill: string, index: number) => (
                  <div key={index} className="flex items-center gap-2">
                    <Input
                      value={skill}
                      onChange={(e) => handleSkillChange(index, e.target.value)}
                      placeholder="e.g., JavaScript, Project Management, etc."
                    />
                    <Button
                      variant="ghost"
                      size="sm"
                      className="text-red-500 hover:text-red-700 hover:bg-red-50"
                      onClick={() => removeSkill(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}

              <Button variant="outline" className="w-full" onClick={addSkill}>
                <Plus className="h-4 w-4 mr-2" />
                Add Skill
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="mt-8 flex justify-end">
        <Button onClick={handleSaveResume} disabled={isSaving} size="lg" className="gap-2">
          {isSaving ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            <>
              <Save className="h-4 w-4" />
              Save Changes
            </>
          )}
        </Button>
      </div>
    </div>
  )
}
