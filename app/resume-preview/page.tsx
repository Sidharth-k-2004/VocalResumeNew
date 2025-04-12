"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Download, Share2 } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"

export default function ResumePreview() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [isLoading, setIsLoading] = useState(true)

  const templateId = searchParams.get("template") || ""
  const categoryId = searchParams.get("category") || ""

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

  // Mock resume data - in a real app, this would come from processing the audio
  const resumeData = {
    personalInfo: {
      name: "John Doe",
      title: "Software Engineer",
      email: "john.doe@example.com",
      phone: "(555) 123-4567",
      location: "San Francisco, CA",
      summary: "Experienced software engineer with a passion for building scalable web applications.",
    },
    skills: ["JavaScript", "React", "Node.js", "TypeScript", "GraphQL"],
    education: [
      {
        degree: "Computer Science, BS",
        institution: "Stanford University",
        years: "2015 - 2019",
      },
    ],
    experience: [
      {
        position: "Senior Software Engineer",
        company: "Tech Innovations Inc.",
        years: "2021 - Present",
        achievements: [
          "Led development of company's flagship product",
          "Managed team of 5 engineers",
          "Implemented CI/CD pipeline reducing deployment time by 40%",
        ],
      },
      {
        position: "Software Engineer",
        company: "Digital Solutions LLC",
        years: "2019 - 2021",
        achievements: [
          "Developed responsive web applications using React",
          "Collaborated with design team to implement UI/UX improvements",
          "Optimized database queries resulting in 30% performance improvement",
        ],
      },
    ],
    projects: [
      {
        name: "Personal Portfolio Website",
        description: "Designed and developed a personal portfolio website using Next.js and Tailwind CSS",
      },
      {
        name: "Task Management App",
        description: "Created a full-stack task management application with React, Node.js, and MongoDB",
      },
    ],
  }

  useEffect(() => {
    // Simulate loading the resume
    setTimeout(() => {
      setIsLoading(false)
    }, 1500)
  }, [])

  const handleDownload = () => {
    alert("In a real application, this would download the resume as a PDF")
  }

  const handleShare = () => {
    alert("In a real application, this would open sharing options")
  }

  const handleEdit = () => {
    router.push(`/edit-resume?template=${templateId}&category=${categoryId}`)
  }

  const handleGoBack = () => {
    router.push("/templates")
  }

  // Render the appropriate template based on the template ID
  const renderTemplate = () => {
    // First character of template ID indicates the category
    const templateType = templateId.charAt(0)
    const templateNumber = templateId.substring(1)

    switch (templateType) {
      case "p":
        return <ProfessionalTemplate variant={templateNumber} data={resumeData} />
      case "c":
        return <CreativeTemplate variant={templateNumber} data={resumeData} />
      case "m":
        return <MinimalTemplate variant={templateNumber} data={resumeData} />
      case "e":
        return <ExecutiveTemplate variant={templateNumber} data={resumeData} />
      default:
        return <ProfessionalTemplate variant="1" data={resumeData} />
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Generating your resume...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-8 px-6">
      <Button variant="ghost" size="sm" className="mb-6" onClick={handleGoBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to templates
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          Your {categoryNames[categoryId]} - {templateNames[templateId]} Resume
        </h1>
        <p className="text-gray-600 mt-2">Generated from your audio input</p>
      </div>

      <div className="bg-gray-100 p-8 rounded-lg shadow-inner">
        <div className="max-w-4xl mx-auto bg-white rounded shadow-lg">{renderTemplate()}</div>
      </div>

      <div className="text-center mt-8">
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleDownload}>
            <Download className="mr-2 h-4 w-4" />
            Download PDF
          </Button>
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
          <Button variant="outline" onClick={handleEdit}>
            Edit Resume
          </Button>
        </div>
      </div>
    </div>
  )
}

// Professional template variations
function ProfessionalTemplate({ variant = "1", data }: { variant: string; data: any }) {
  switch (variant) {
    case "2":
      return <ProfessionalBusinessTemplate data={data} />
    default:
      return <ProfessionalCorporateTemplate data={data} />
  }
}

function ProfessionalCorporateTemplate({ data }: { data: any }) {
  return (
    <div className="p-8">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-3xl font-bold">{data.personalInfo.name}</h2>
        <p className="text-xl text-gray-600">{data.personalInfo.title}</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <p className="text-sm">{data.personalInfo.email}</p>
            <p className="text-sm">{data.personalInfo.phone}</p>
            <p className="text-sm">{data.personalInfo.location}</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <ul className="list-disc list-inside text-sm">
              {data.skills.map((skill: string, index: number) => (
                <li key={index}>{skill}</li>
              ))}
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Education</h3>
            {data.education.map((edu: any, index: number) => (
              <div key={index} className="mb-3">
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm">{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.years}</p>
              </div>
            ))}
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Experience</h3>

            {data.experience.map((exp: any, index: number) => (
              <div key={index} className="mb-4">
                <div className="flex justify-between">
                  <p className="font-medium">{exp.position}</p>
                  <p className="text-sm text-gray-600">{exp.years}</p>
                </div>
                <p className="text-sm">{exp.company}</p>
                <ul className="list-disc list-inside text-sm mt-2">
                  {exp.achievements.map((achievement: string, achievementIndex: number) => (
                    <li key={achievementIndex}>{achievement}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Projects</h3>

            {data.projects.map((project: any, index: number) => (
              <div key={index} className="mb-3">
                <p className="font-medium">{project.name}</p>
                <p className="text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfessionalBusinessTemplate({ data }: { data: any }) {
  // Implementation similar to ProfessionalCorporateTemplate but with different styling
  return (
    <div className="p-8">
      <div className="text-center border-b pb-6 mb-6">
        <h2 className="text-4xl font-bold">{data.personalInfo.name}</h2>
        <p className="text-xl text-gray-600 mt-2">{data.personalInfo.title}</p>

        <div className="flex justify-center gap-4 mt-4">
          <p className="text-sm">{data.personalInfo.email}</p>
          <span className="text-gray-400">|</span>
          <p className="text-sm">{data.personalInfo.phone}</p>
          <span className="text-gray-400">|</span>
          <p className="text-sm">{data.personalInfo.location}</p>
        </div>
      </div>

      {/* Rest of the template implementation */}
      <div className="grid grid-cols-1 gap-6">
        {/* Experience section */}
        <div>
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">Experience</h3>
          {data.experience.map((exp: any, index: number) => (
            <div key={index} className="mb-5">
              <div className="flex justify-between items-center">
                <p className="font-bold text-lg">{exp.position}</p>
                <p className="text-sm text-gray-600">{exp.years}</p>
              </div>
              <p className="text-md font-medium">{exp.company}</p>
              <ul className="list-disc list-inside text-sm mt-2 ml-2">
                {exp.achievements.map((achievement: string, achievementIndex: number) => (
                  <li key={achievementIndex}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education and Skills section */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Education</h3>
            {data.education.map((edu: any, index: number) => (
              <div key={index} className="mb-3">
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm">{edu.institution}</p>
                <p className="text-sm text-gray-600">{edu.years}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, index: number) => (
                <span key={index} className="bg-gray-100 px-3 py-1 rounded-full text-sm">
                  {skill}
                </span>
              ))}
            </div>

            <h3 className="text-lg font-semibold border-b pb-2 mb-3 mt-6">Projects</h3>
            {data.projects.map((project: any, index: number) => (
              <div key={index} className="mb-3">
                <p className="font-medium">{project.name}</p>
                <p className="text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Creative template variations
function CreativeTemplate({ variant = "1", data }: { variant: string; data: any }) {
  // Implementation similar to ProfessionalTemplate but with creative styling
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <div className="bg-rose-100 p-8 md:col-span-1">
        <div className="mb-8">
          <div className="w-32 h-32 bg-rose-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-rose-500">
            {data.personalInfo.name
              .split(" ")
              .map((name: string) => name[0])
              .join("")}
          </div>
          <h2 className="text-2xl font-bold text-center">{data.personalInfo.name}</h2>
          <p className="text-md text-center text-rose-700 mt-1">{data.personalInfo.title}</p>
        </div>

        {/* Contact info */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-rose-800 mb-3 border-b border-rose-200 pb-1">Contact</h3>
          <div className="space-y-2">
            <p className="text-sm">{data.personalInfo.email}</p>
            <p className="text-sm">{data.personalInfo.phone}</p>
            <p className="text-sm">{data.personalInfo.location}</p>
          </div>
        </div>

        {/* Skills */}
        <div className="mb-6">
          <h3 className="text-lg font-bold text-rose-800 mb-3 border-b border-rose-200 pb-1">Skills</h3>
          <div className="space-y-2">
            {data.skills.map((skill: string, index: number) => (
              <div key={index} className="bg-white rounded-full px-3 py-1 text-sm">
                {skill}
              </div>
            ))}
          </div>
        </div>

        {/* Education */}
        <div>
          <h3 className="text-lg font-bold text-rose-800 mb-3 border-b border-rose-200 pb-1">Education</h3>
          {data.education.map((edu: any, index: number) => (
            <div key={index} className="mb-3">
              <p className="font-medium">{edu.degree}</p>
              <p className="text-sm">{edu.institution}</p>
              <p className="text-sm text-rose-700">{edu.years}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Right column */}
      <div className="p-8 md:col-span-2">
        {/* Experience */}
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-rose-800 mb-4 border-b border-rose-200 pb-2">Experience</h3>
          {data.experience.map((exp: any, index: number) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-baseline">
                <p className="font-bold text-lg">{exp.position}</p>
                <p className="text-sm text-rose-700">{exp.years}</p>
              </div>
              <p className="text-md italic mb-2">{exp.company}</p>
              <ul className="list-disc list-outside text-sm ml-5 space-y-1">
                {exp.achievements.map((achievement: string, achievementIndex: number) => (
                  <li key={achievementIndex}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Projects */}
        <div>
          <h3 className="text-2xl font-bold text-rose-800 mb-4 border-b border-rose-200 pb-2">Projects</h3>
          {data.projects.map((project: any, index: number) => (
            <div key={index} className="mb-4">
              <p className="font-bold">{project.name}</p>
              <p className="text-sm">{project.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

// Minimal template variations
function MinimalTemplate({ variant = "1", data }: { variant: string; data: any }) {
  // Implementation similar to ProfessionalTemplate but with minimal styling
  return (
    <div className="p-8 font-light">
      {/* Header */}
      <div className="mb-8">
        <h2 className="text-3xl font-normal tracking-wide">{data.personalInfo.name}</h2>
        <p className="text-lg text-gray-500 mt-1">{data.personalInfo.title}</p>

        <div className="flex gap-4 mt-3 text-sm text-gray-600">
          <p>{data.personalInfo.email}</p>
          <span>•</span>
          <p>{data.personalInfo.phone}</p>
          <span>•</span>
          <p>{data.personalInfo.location}</p>
        </div>
      </div>

      {/* Content */}
      <div className="grid grid-cols-1 gap-6">
        {/* Experience */}
        <div>
          <h3 className="text-md uppercase tracking-wider text-gray-500 mb-3">Experience</h3>
          {data.experience.map((exp: any, index: number) => (
            <div key={index} className="mb-5">
              <div className="flex justify-between items-baseline">
                <p className="font-medium">{exp.position}</p>
                <p className="text-sm text-gray-500">{exp.years}</p>
              </div>
              <p className="text-sm">{exp.company}</p>
              <ul className="list-disc list-outside text-sm mt-2 ml-4">
                {exp.achievements.map((achievement: string, achievementIndex: number) => (
                  <li key={achievementIndex}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        {/* Education and Skills */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md uppercase tracking-wider text-gray-500 mb-3">Education</h3>
            {data.education.map((edu: any, index: number) => (
              <div key={index} className="mb-3">
                <p className="font-medium">{edu.degree}</p>
                <p className="text-sm">{edu.institution}</p>
                <p className="text-sm text-gray-500">{edu.years}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-md uppercase tracking-wider text-gray-500 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              {data.skills.map((skill: string, index: number) => (
                <span key={index} className="text-sm">
                  {skill}
                  {index < data.skills.length - 1 && <span className="ml-1 mr-1">•</span>}
                </span>
              ))}
            </div>

            <h3 className="text-md uppercase tracking-wider text-gray-500 mb-3 mt-6">Projects</h3>
            {data.projects.map((project: any, index: number) => (
              <div key={index} className="mb-3">
                <p className="font-medium">{project.name}</p>
                <p className="text-sm">{project.description}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

// Executive template variations
function ExecutiveTemplate({ variant = "1", data }: { variant: string; data: any }) {
  // Implementation similar to ProfessionalTemplate but with executive styling
  return (
    <div className="p-8 bg-slate-50">
      <div className="border-b-4 border-slate-800 pb-6 mb-6">
        <h2 className="text-4xl font-bold text-slate-800">{data.personalInfo.name}</h2>
        <p className="text-xl text-slate-600 mt-2">{data.personalInfo.title}</p>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-700">
          <p>{data.personalInfo.email}</p>
          <span>|</span>
          <p>{data.personalInfo.phone}</p>
          <span>|</span>
          <p>{data.personalInfo.location}</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-wider">Professional Experience</h3>
          {data.experience.map((exp: any, index: number) => (
            <div key={index} className="mb-6">
              <div className="flex justify-between items-baseline border-b border-slate-300 pb-1 mb-2">
                <p className="font-bold text-lg">{exp.position}</p>
                <p className="text-sm text-slate-600">{exp.years}</p>
              </div>
              <p className="text-md font-medium mb-2">{exp.company}</p>
              <ul className="list-disc list-outside text-sm ml-5 space-y-2">
                {exp.achievements.map((achievement: string, achievementIndex: number) => (
                  <li key={achievementIndex}>{achievement}</li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-wider">Education</h3>
            {data.education.map((edu: any, index: number) => (
              <div key={index} className="mb-4">
                <p className="font-bold">{edu.degree}</p>
                <p className="text-sm">{edu.institution}</p>
                <p className="text-sm text-slate-600">{edu.years}</p>
              </div>
            ))}

            <h3 className="text-xl font-bold text-slate-800 mb-4 mt-6 uppercase tracking-wider">Projects</h3>
            {data.projects.map((project: any, index: number) => (
              <div key={index} className="mb-3">
                <p className="font-bold">{project.name}</p>
                <p className="text-sm">{project.description}</p>
              </div>
            ))}
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-wider">Skills & Expertise</h3>
            <div className="grid grid-cols-2 gap-2">
              {data.skills.map((skill: string, index: number) => (
                <div key={index} className="bg-white border border-slate-200 px-3 py-2 rounded text-sm">
                  {skill}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
