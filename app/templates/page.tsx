"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useRouter } from "next/navigation"

export default function TemplatesPage() {
  const router = useRouter()
  const [selectedCategory, setSelectedCategory] = useState("1")

  // Template categories
  const categories = [
    { id: "1", name: "Professional" },
    { id: "2", name: "Creative" },
    { id: "3", name: "Minimal" },
    { id: "4", name: "Executive" },
  ]

  // Templates for each category
  const templates = {
    "1": [
      { id: "p1", name: "Corporate" },
      { id: "p2", name: "Business" },
      { id: "p3", name: "Executive Pro" },
      { id: "p4", name: "Modern Professional" },
      { id: "p5", name: "Classic" },
    ],
    "2": [
      { id: "c1", name: "Designer" },
      { id: "c2", name: "Artistic" },
      { id: "c3", name: "Digital Creative" },
      { id: "c4", name: "Portfolio Plus" },
      { id: "c5", name: "Innovation" },
    ],
    "3": [
      { id: "m1", name: "Clean" },
      { id: "m2", name: "Simplicity" },
      { id: "m3", name: "Essentials" },
      { id: "m4", name: "Minimalist Pro" },
      { id: "m5", name: "Whitespace" },
    ],
    "4": [
      { id: "e1", name: "Leadership" },
      { id: "e2", name: "C-Suite" },
      { id: "e3", name: "Director" },
      { id: "e4", name: "Board Member" },
      { id: "e5", name: "Executive Elite" },
    ],
  }

  const handlePreview = (categoryId: string, templateId: string) => {
    router.push(`/preview-template/${categoryId}/${templateId}`)
  }

  return (
    <div className="container mx-auto py-8 px-6">
      <div className="text-center mb-10">
        <h1 className="text-4xl font-bold mb-4">Choose Your Resume Template</h1>
        <p className="text-gray-600 max-w-2xl mx-auto">
          Select a template that best represents your professional style. After selecting, you'll be able to provide
          your resume details through audio input.
        </p>
      </div>

      <Tabs defaultValue="1" value={selectedCategory} onValueChange={setSelectedCategory} className="w-full">
        <TabsList className="grid grid-cols-2 md:grid-cols-4 gap-2 mb-8">
          {categories.map((category) => (
            <TabsTrigger key={category.id} value={category.id} className="w-full">
              {category.name}
            </TabsTrigger>
          ))}
        </TabsList>

        {categories.map((category) => (
          <TabsContent key={category.id} value={category.id}>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {templates[category.id as keyof typeof templates].map((template) => (
                <Card key={template.id} className="overflow-hidden">
                  <CardContent className="p-0">
                    <div className="relative h-64 bg-gray-100">
                      {/* Template thumbnail/preview image */}
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-full h-full p-4">
                          <div className="w-full h-full border border-gray-200 bg-white rounded flex items-center justify-center">
                            <div className="text-center p-4">
                              <div className="font-bold">{template.name}</div>
                              <div className="text-xs text-gray-500 mt-1">Template Preview</div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                    <div className="p-4">
                      <div className="flex items-center justify-between">
                        <h3 className="font-medium">{template.name}</h3>
                        <Button size="sm" onClick={() => handlePreview(category.id, template.id)}>
                          Preview
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
        ))}
      </Tabs>
    </div>
  )
}
