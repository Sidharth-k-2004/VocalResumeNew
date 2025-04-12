"use client"

import { useEffect, useState } from "react"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"
import { useRouter } from "next/navigation"

export default function PreviewTemplate({ params }: { params: { categoryId: string; templateId: string } }) {
    
  const [isLoading, setIsLoading] = useState(true)
  const router = useRouter()
  const { categoryId, templateId } = params
  console.log(categoryId, templateId)

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
    // Simulate loading the template
    setTimeout(() => {
      setIsLoading(false)
    }, 1000)
  }, [])

  const handleSelectTemplate = () => {
    // Navigate to the audio input page with the selected template
    router.push(`/audio-input?template=${templateId}&category=${categoryId}`)
  }

  const handleGoBack = () => {
    router.push("/templates")
  }

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading template preview...</p>
        </div>
      </div>
    )
  }

  // Render the appropriate template based on the template ID
  const renderTemplate = () => {
    // First character of template ID indicates the category
    const templateType = templateId.charAt(0)
    const templateNumber = templateId.substring(1)

    switch (templateType) {
      case "p":
        return <ProfessionalTemplate variant={templateNumber} />
      case "c":
        return <CreativeTemplate variant={templateNumber} />
      case "m":
        return <MinimalTemplate variant={templateNumber} />
      case "e":
        return <ExecutiveTemplate variant={templateNumber} />
      default:
        return <ProfessionalTemplate variant="1" />
    }
  }

  return (
    <div className="container mx-auto py-8 px-6">
      <Button variant="ghost" size="sm" className="mb-6" onClick={handleGoBack}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to selection
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          {categoryNames[categoryId] || "Template"} - {templateNames[templateId] || "Preview"}
        </h1>
        <p className="text-gray-600 mt-2">Template Preview</p>
      </div>

      <div className="bg-gray-100 p-8 rounded-lg shadow-inner">
        <div className="max-w-4xl mx-auto bg-white rounded shadow-lg">{renderTemplate()}</div>
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">
          Like this template? Select it and record your resume details to generate your personalized resume.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 justify-center">
          <Button onClick={handleSelectTemplate}>Select This Template</Button>
          <Button variant="outline" onClick={handleGoBack}>
            View Other Templates
          </Button>
        </div>
      </div>
    </div>
  )
}

// Professional template variations
function ProfessionalTemplate({ variant = "1" }) {
  switch (variant) {
    case "2":
      return <ProfessionalBusinessTemplate />
    default:
      return <ProfessionalCorporateTemplate />
  }
}

function ProfessionalCorporateTemplate() {
  return (
    <div className="p-8">
      <div className="border-b pb-4 mb-6">
        <h2 className="text-3xl font-bold">John Doe</h2>
        <p className="text-xl text-gray-600">Software Engineer</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <div className="md:col-span-1">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Contact</h3>
            <p className="text-sm">john.doe@example.com</p>
            <p className="text-sm">(555) 123-4567</p>
            <p className="text-sm">San Francisco, CA</p>
          </div>

          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-2">Skills</h3>
            <ul className="list-disc list-inside text-sm">
              <li>JavaScript</li>
              <li>React</li>
              <li>Node.js</li>
              <li>TypeScript</li>
              <li>GraphQL</li>
            </ul>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-2">Education</h3>
            <div className="mb-3">
              <p className="font-medium">Computer Science, BS</p>
              <p className="text-sm">Stanford University</p>
              <p className="text-sm text-gray-600">2015 - 2019</p>
            </div>
          </div>
        </div>

        <div className="md:col-span-2">
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Experience</h3>

            <div className="mb-4">
              <div className="flex justify-between">
                <p className="font-medium">Senior Software Engineer</p>
                <p className="text-sm text-gray-600">2021 - Present</p>
              </div>
              <p className="text-sm">Tech Innovations Inc.</p>
              <ul className="list-disc list-inside text-sm mt-2">
                <li>Led development of company's flagship product</li>
                <li>Managed team of 5 engineers</li>
                <li>Implemented CI/CD pipeline reducing deployment time by 40%</li>
              </ul>
            </div>

            <div className="mb-4">
              <div className="flex justify-between">
                <p className="font-medium">Software Engineer</p>
                <p className="text-sm text-gray-600">2019 - 2021</p>
              </div>
              <p className="text-sm">Digital Solutions LLC</p>
              <ul className="list-disc list-inside text-sm mt-2">
                <li>Developed responsive web applications using React</li>
                <li>Collaborated with design team to implement UI/UX improvements</li>
                <li>Optimized database queries resulting in 30% performance improvement</li>
              </ul>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold mb-3">Projects</h3>

            <div className="mb-3">
              <p className="font-medium">Personal Portfolio Website</p>
              <p className="text-sm">
                Designed and developed a personal portfolio website using Next.js and Tailwind CSS
              </p>
            </div>

            <div>
              <p className="font-medium">Task Management App</p>
              <p className="text-sm">
                Created a full-stack task management application with React, Node.js, and MongoDB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

function ProfessionalBusinessTemplate() {
  return (
    <div className="p-8">
      <div className="text-center border-b pb-6 mb-6">
        <h2 className="text-4xl font-bold">John Doe</h2>
        <p className="text-xl text-gray-600 mt-2">Software Engineer</p>

        <div className="flex justify-center gap-4 mt-4">
          <p className="text-sm">john.doe@example.com</p>
          <span className="text-gray-400">|</span>
          <p className="text-sm">(555) 123-4567</p>
          <span className="text-gray-400">|</span>
          <p className="text-sm">San Francisco, CA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <h3 className="text-lg font-semibold border-b pb-2 mb-3">Experience</h3>
          <div className="mb-5">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Senior Software Engineer</p>
              <p className="text-sm text-gray-600">2021 - Present</p>
            </div>
            <p className="text-md font-medium">Tech Innovations Inc.</p>
            <ul className="list-disc list-inside text-sm mt-2 ml-2">
              <li>Led development of company's flagship product</li>
              <li>Managed team of 5 engineers</li>
              <li>Implemented CI/CD pipeline reducing deployment time by 40%</li>
            </ul>
          </div>

          <div className="mb-5">
            <div className="flex justify-between items-center">
              <p className="font-bold text-lg">Software Engineer</p>
              <p className="text-sm text-gray-600">2019 - 2021</p>
            </div>
            <p className="text-md font-medium">Digital Solutions LLC</p>
            <ul className="list-disc list-inside text-sm mt-2 ml-2">
              <li>Developed responsive web applications using React</li>
              <li>Collaborated with design team to implement UI/UX improvements</li>
              <li>Optimized database queries resulting in 30% performance improvement</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Education</h3>
            <div className="mb-3">
              <p className="font-medium">Computer Science, BS</p>
              <p className="text-sm">Stanford University</p>
              <p className="text-sm text-gray-600">2015 - 2019</p>
            </div>

            <h3 className="text-lg font-semibold border-b pb-2 mb-3 mt-6">Skills</h3>
            <div className="flex flex-wrap gap-2">
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">JavaScript</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">React</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">Node.js</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">TypeScript</span>
              <span className="bg-gray-100 px-3 py-1 rounded-full text-sm">GraphQL</span>
            </div>
          </div>

          <div>
            <h3 className="text-lg font-semibold border-b pb-2 mb-3">Projects</h3>
            <div className="mb-4">
              <p className="font-medium">Personal Portfolio Website</p>
              <p className="text-sm">
                Designed and developed a personal portfolio website using Next.js and Tailwind CSS
              </p>
            </div>

            <div className="mb-4">
              <p className="font-medium">Task Management App</p>
              <p className="text-sm">
                Created a full-stack task management application with React, Node.js, and MongoDB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Creative template variations
function CreativeTemplate({ variant = "1" }) {
  return (
    <div className="grid grid-cols-1 md:grid-cols-3">
      <div className="bg-rose-100 p-8 md:col-span-1">
        <div className="mb-8">
          <div className="w-32 h-32 bg-rose-200 rounded-full mx-auto mb-4 flex items-center justify-center text-3xl font-bold text-rose-500">
            JD
          </div>
          <h2 className="text-2xl font-bold text-center">John Doe</h2>
          <p className="text-md text-center text-rose-700 mt-1">Software Engineer</p>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-rose-800 mb-3 border-b border-rose-200 pb-1">Contact</h3>
          <div className="space-y-2">
            <p className="text-sm">john.doe@example.com</p>
            <p className="text-sm">(555) 123-4567</p>
            <p className="text-sm">San Francisco, CA</p>
          </div>
        </div>

        <div className="mb-6">
          <h3 className="text-lg font-bold text-rose-800 mb-3 border-b border-rose-200 pb-1">Skills</h3>
          <div className="space-y-2">
            <div className="bg-white rounded-full px-3 py-1 text-sm">JavaScript</div>
            <div className="bg-white rounded-full px-3 py-1 text-sm">React</div>
            <div className="bg-white rounded-full px-3 py-1 text-sm">Node.js</div>
            <div className="bg-white rounded-full px-3 py-1 text-sm">TypeScript</div>
            <div className="bg-white rounded-full px-3 py-1 text-sm">GraphQL</div>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-bold text-rose-800 mb-3 border-b border-rose-200 pb-1">Education</h3>
          <div className="mb-3">
            <p className="font-medium">Computer Science, BS</p>
            <p className="text-sm">Stanford University</p>
            <p className="text-sm text-rose-700">2015 - 2019</p>
          </div>
        </div>
      </div>

      <div className="p-8 md:col-span-2">
        <div className="mb-6">
          <h3 className="text-2xl font-bold text-rose-800 mb-4 border-b border-rose-200 pb-2">Experience</h3>
          <div className="mb-6">
            <div className="flex justify-between items-baseline">
              <p className="font-bold text-lg">Senior Software Engineer</p>
              <p className="text-sm text-rose-700">2021 - Present</p>
            </div>
            <p className="text-md italic mb-2">Tech Innovations Inc.</p>
            <ul className="list-disc list-outside text-sm ml-5 space-y-1">
              <li>Led development of company's flagship product</li>
              <li>Managed team of 5 engineers</li>
              <li>Implemented CI/CD pipeline reducing deployment time by 40%</li>
            </ul>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-baseline">
              <p className="font-bold text-lg">Software Engineer</p>
              <p className="text-sm text-rose-700">2019 - 2021</p>
            </div>
            <p className="text-md italic mb-2">Digital Solutions LLC</p>
            <ul className="list-disc list-outside text-sm ml-5 space-y-1">
              <li>Developed responsive web applications using React</li>
              <li>Collaborated with design team to implement UI/UX improvements</li>
              <li>Optimized database queries resulting in 30% performance improvement</li>
            </ul>
          </div>
        </div>

        <div>
          <h3 className="text-2xl font-bold text-rose-800 mb-4 border-b border-rose-200 pb-2">Projects</h3>
          <div className="mb-4">
            <p className="font-bold">Personal Portfolio Website</p>
            <p className="text-sm">
              Designed and developed a personal portfolio website using Next.js and Tailwind CSS
            </p>
          </div>

          <div className="mb-4">
            <p className="font-bold">Task Management App</p>
            <p className="text-sm">Created a full-stack task management application with React, Node.js, and MongoDB</p>
          </div>
        </div>
      </div>
    </div>
  )
}

// Minimal template variations
function MinimalTemplate({ variant = "1" }) {
  return (
    <div className="p-8 font-light">
      <div className="mb-8">
        <h2 className="text-3xl font-normal tracking-wide">John Doe</h2>
        <p className="text-lg text-gray-500 mt-1">Software Engineer</p>

        <div className="flex gap-4 mt-3 text-sm text-gray-600">
          <p>john.doe@example.com</p>
          <span>•</span>
          <p>(555) 123-4567</p>
          <span>•</span>
          <p>San Francisco, CA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        <div>
          <h3 className="text-md uppercase tracking-wider text-gray-500 mb-3">Experience</h3>
          <div className="mb-5">
            <div className="flex justify-between items-baseline">
              <p className="font-medium">Senior Software Engineer</p>
              <p className="text-sm text-gray-500">2021 - Present</p>
            </div>
            <p className="text-sm">Tech Innovations Inc.</p>
            <ul className="list-disc list-outside text-sm mt-2 ml-4">
              <li>Led development of company's flagship product</li>
              <li>Managed team of 5 engineers</li>
              <li>Implemented CI/CD pipeline reducing deployment time by 40%</li>
            </ul>
          </div>

          <div className="mb-5">
            <div className="flex justify-between items-baseline">
              <p className="font-medium">Software Engineer</p>
              <p className="text-sm text-gray-500">2019 - 2021</p>
            </div>
            <p className="text-sm">Digital Solutions LLC</p>
            <ul className="list-disc list-outside text-sm mt-2 ml-4">
              <li>Developed responsive web applications using React</li>
              <li>Collaborated with design team to implement UI/UX improvements</li>
              <li>Optimized database queries resulting in 30% performance improvement</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <h3 className="text-md uppercase tracking-wider text-gray-500 mb-3">Education</h3>
            <div className="mb-3">
              <p className="font-medium">Computer Science, BS</p>
              <p className="text-sm">Stanford University</p>
              <p className="text-sm text-gray-500">2015 - 2019</p>
            </div>
          </div>

          <div>
            <h3 className="text-md uppercase tracking-wider text-gray-500 mb-3">Skills</h3>
            <div className="flex flex-wrap gap-2">
              <span className="text-sm">JavaScript</span>
              <span>•</span>
              <span className="text-sm">React</span>
              <span>•</span>
              <span className="text-sm">Node.js</span>
              <span>•</span>
              <span className="text-sm">TypeScript</span>
              <span>•</span>
              <span className="text-sm">GraphQL</span>
            </div>

            <h3 className="text-md uppercase tracking-wider text-gray-500 mb-3 mt-6">Projects</h3>
            <div className="mb-3">
              <p className="font-medium">Personal Portfolio Website</p>
              <p className="text-sm">
                Designed and developed a personal portfolio website using Next.js and Tailwind CSS
              </p>
            </div>

            <div className="mb-3">
              <p className="font-medium">Task Management App</p>
              <p className="text-sm">
                Created a full-stack task management application with React, Node.js, and MongoDB
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

// Executive template variations
function ExecutiveTemplate({ variant = "1" }) {
  return (
    <div className="p-8 bg-slate-50">
      <div className="border-b-4 border-slate-800 pb-6 mb-6">
        <h2 className="text-4xl font-bold text-slate-800">John Doe</h2>
        <p className="text-xl text-slate-600 mt-2">Software Engineer</p>

        <div className="flex flex-wrap gap-4 mt-4 text-sm text-slate-700">
          <p>john.doe@example.com</p>
          <span>|</span>
          <p>(555) 123-4567</p>
          <span>|</span>
          <p>San Francisco, CA</p>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-8">
        <div>
          <h3 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-wider">Professional Experience</h3>
          <div className="mb-6">
            <div className="flex justify-between items-baseline border-b border-slate-300 pb-1 mb-2">
              <p className="font-bold text-lg">Senior Software Engineer</p>
              <p className="text-sm text-slate-600">2021 - Present</p>
            </div>
            <p className="text-md font-medium mb-2">Tech Innovations Inc.</p>
            <ul className="list-disc list-outside text-sm ml-5 space-y-2">
              <li>Led development of company's flagship product</li>
              <li>Managed team of 5 engineers</li>
              <li>Implemented CI/CD pipeline reducing deployment time by 40%</li>
            </ul>
          </div>

          <div className="mb-6">
            <div className="flex justify-between items-baseline border-b border-slate-300 pb-1 mb-2">
              <p className="font-bold text-lg">Software Engineer</p>
              <p className="text-sm text-slate-600">2019 - 2021</p>
            </div>
            <p className="text-md font-medium mb-2">Digital Solutions LLC</p>
            <ul className="list-disc list-outside text-sm ml-5 space-y-2">
              <li>Developed responsive web applications using React</li>
              <li>Collaborated with design team to implement UI/UX improvements</li>
              <li>Optimized database queries resulting in 30% performance improvement</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-wider">Education</h3>
            <div className="mb-4">
              <p className="font-bold">Computer Science, BS</p>
              <p className="text-sm">Stanford University</p>
              <p className="text-sm text-slate-600">2015 - 2019</p>
            </div>

            <h3 className="text-xl font-bold text-slate-800 mb-4 mt-6 uppercase tracking-wider">Projects</h3>
            <div className="mb-3">
              <p className="font-bold">Personal Portfolio Website</p>
              <p className="text-sm">
                Designed and developed a personal portfolio website using Next.js and Tailwind CSS
              </p>
            </div>

            <div className="mb-3">
              <p className="font-bold">Task Management App</p>
              <p className="text-sm">
                Created a full-stack task management application with React, Node.js, and MongoDB
              </p>
            </div>
          </div>

          <div>
            <h3 className="text-xl font-bold text-slate-800 mb-4 uppercase tracking-wider">Skills & Expertise</h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="bg-white border border-slate-200 px-3 py-2 rounded text-sm">JavaScript</div>
              <div className="bg-white border border-slate-200 px-3 py-2 rounded text-sm">React</div>
              <div className="bg-white border border-slate-200 px-3 py-2 rounded text-sm">Node.js</div>
              <div className="bg-white border border-slate-200 px-3 py-2 rounded text-sm">TypeScript</div>
              <div className="bg-white border border-slate-200 px-3 py-2 rounded text-sm">GraphQL</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
