"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

// This would be a route like /preview-template/[categoryId]/[templateId]/page.tsx
export default function PreviewTemplate({ params }: { params: { categoryId: string; templateId: string } }) {
  const router = useRouter()
  const [isLoading, setIsLoading] = useState(true)
  const { categoryId, templateId } = params

  // Template categories mapping for display purposes
  const categoryNames = {
    "1": "Professional",
    "2": "Creative",
    "3": "Minimal",
    "4": "Executive",
  }

  // Template names mapping
  const templateNames = {
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

  return (
    <div className="container mx-auto py-8 px-6">
      <Button variant="ghost" size="sm" className="mb-6" onClick={() => window.close()}>
        <ArrowLeft className="mr-2 h-4 w-4" />
        Back to selection
      </Button>

      <div className="text-center mb-8">
        <h1 className="text-3xl font-bold">
          {categoryNames[categoryId as keyof typeof categoryNames]} -{" "}
          {templateNames[templateId as keyof typeof templateNames]}
        </h1>
        <p className="text-gray-600 mt-2">Template Preview</p>
      </div>

      <div className="bg-gray-100 p-8 rounded-lg shadow-inner">
        <div className="max-w-4xl mx-auto bg-white p-8 rounded shadow-lg">
          {/* This would be the actual template preview */}
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
      </div>

      <div className="text-center mt-8">
        <p className="text-gray-600 mb-4">This is a preview of how your resume could look with this template.</p>
        <Button onClick={() => window.close()}>Return to Template Selection</Button>
      </div>
    </div>
  )
}
