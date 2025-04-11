"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Check } from "lucide-react"

const templates = [
  {
    id: 1,
    name: "Professional",
    description: "A clean and professional template suitable for most industries.",
    image: "/placeholder.svg?height=300&width=220",
  },
  {
    id: 2,
    name: "Creative",
    description: "A modern and creative template for design and creative roles.",
    image: "/placeholder.svg?height=300&width=220",
  },
  {
    id: 3,
    name: "Minimal",
    description: "A minimalist template that focuses on content and readability.",
    image: "/placeholder.svg?height=300&width=220",
  },
  {
    id: 4,
    name: "Executive",
    description: "An elegant template for senior positions and executives.",
    image: "/placeholder.svg?height=300&width=220",
  },
]

export default function TemplatesPage() {
  const router = useRouter()
  const [selectedTemplate, setSelectedTemplate] = useState<number | null>(null)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Check if user is authenticated
    const checkAuth = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/check-auth", {
          credentials: "include",
        })

        if (response.ok) {
          setIsAuthenticated(true)
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
  }, [router])

  const handleSelectTemplate = (id: number) => {
    setSelectedTemplate(id)
  }

  const handleContinue = () => {
    if (selectedTemplate) {
      router.push(`/audio-input?template=${selectedTemplate}`)
    } else {
      toast({
        title: "No template selected",
        description: "Please select a template to continue.",
        variant: "destructive",
      })
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
      <h1 className="text-3xl font-bold mb-8">Select a Resume Template</h1>
      <p className="text-gray-600 mb-8">
        Choose a template that best represents your professional style. You can preview each template before making your
        selection.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {templates.map((template) => (
          <Card
            key={template.id}
            className={`overflow-hidden cursor-pointer transition-all ${
              selectedTemplate === template.id ? "ring-2 ring-primary" : ""
            }`}
            onClick={() => handleSelectTemplate(template.id)}
          >
            <div className="relative">
              <img src={template.image || "/placeholder.svg"} alt={template.name} className="w-full h-auto" />
              {selectedTemplate === template.id && (
                <div className="absolute top-2 right-2 bg-primary text-white rounded-full p-1">
                  <Check size={16} />
                </div>
              )}
            </div>
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg">{template.name}</h3>
              <p className="text-sm text-gray-500 mt-1">{template.description}</p>
            </CardContent>
            <CardFooter className="p-4 pt-0">
              <Button
                variant="outline"
                size="sm"
                className="w-full"
                onClick={(e) => {
                  e.stopPropagation()
                  window.open(`/preview-template/${template.id}`, "_blank")
                }}
              >
                Preview
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <div className="flex justify-end">
        <Button size="lg" onClick={handleContinue} disabled={!selectedTemplate}>
          Continue
        </Button>
      </div>
    </div>
  )
}
