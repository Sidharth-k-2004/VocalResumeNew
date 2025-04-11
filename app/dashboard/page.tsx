"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"
import { Plus, FileText, Edit, Download, Trash2, Loader2 } from "lucide-react"

interface Resume {
  id: string
  templateName: string
  createdAt: string
  updatedAt: string
}

export default function DashboardPage() {
  const router = useRouter()
  const [resumes, setResumes] = useState<Resume[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [isDeleting, setIsDeleting] = useState<string | null>(null)

  useEffect(() => {
    // Check if user is authenticated and fetch resumes
    const fetchResumes = async () => {
      try {
        const authResponse = await fetch("http://localhost:5000/api/check-auth", {
          credentials: "include",
        })

        if (!authResponse.ok) {
          router.push("/login")
          return
        }

        const resumesResponse = await fetch("http://localhost:5000/api/resumes", {
          credentials: "include",
        })

        if (resumesResponse.ok) {
          const data = await resumesResponse.json()
          setResumes(data.resumes)
        } else {
          toast({
            title: "Error",
            description: "Failed to load your resumes. Please try again.",
            variant: "destructive",
          })
        }
      } catch (error) {
        toast({
          title: "Error",
          description: "An error occurred while loading your resumes.",
          variant: "destructive",
        })
      } finally {
        setIsLoading(false)
      }
    }

    fetchResumes()
  }, [router])

  const handleDeleteResume = async (id: string) => {
    setIsDeleting(id)

    try {
      const response = await fetch(`http://localhost:5000/api/resume/${id}`, {
        method: "DELETE",
        credentials: "include",
      })

      if (response.ok) {
        setResumes(resumes.filter((resume) => resume.id !== id))
        toast({
          title: "Resume deleted",
          description: "Your resume has been deleted successfully.",
        })
      } else {
        const errorData = await response.json()
        toast({
          title: "Delete failed",
          description: errorData.message || "Failed to delete resume. Please try again.",
          variant: "destructive",
        })
      }
    } catch (error) {
      toast({
        title: "Error",
        description: "An error occurred while deleting your resume.",
        variant: "destructive",
      })
    } finally {
      setIsDeleting(null)
    }
  }

  const handleDownloadResume = async (id: string) => {
    try {
      const response = await fetch(`http://localhost:5000/api/resume/${id}/download`, {
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

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center">
        <div className="text-center">
          <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
          <p>Loading your resumes...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="container mx-auto py-12 px-6">
      <div className="flex justify-between items-center mb-8">
        <h1 className="text-3xl font-bold">My Resumes</h1>
        <Link href="/templates">
          <Button className="gap-2">
            <Plus size={16} />
            Create New Resume
          </Button>
        </Link>
      </div>

      {resumes.length === 0 ? (
        <Card className="p-12 text-center">
          <FileText size={48} className="mx-auto text-gray-300 mb-4" />
          <h2 className="text-xl font-semibold mb-2">No Resumes Yet</h2>
          <p className="text-gray-500 mb-6">
            You haven&apos;t created any resumes yet. Get started by creating your first resume.
          </p>
          <Link href="/templates">
            <Button>Create Your First Resume</Button>
          </Link>
        </Card>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {resumes.map((resume) => (
            <Card key={resume.id} className="overflow-hidden">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className="bg-primary/10 p-2 rounded">
                    <FileText className="h-6 w-6 text-primary" />
                  </div>
                  <span className="text-sm text-gray-500">{new Date(resume.updatedAt).toLocaleDateString()}</span>
                </div>
                <h3 className="font-semibold text-lg mb-1">Resume</h3>
                <p className="text-sm text-gray-500 mb-4">Template: {resume.templateName}</p>
                <div className="flex space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/resume-preview?id=${resume.id}`)}
                  >
                    <FileText className="h-4 w-4 mr-1" /> View
                  </Button>
                  <Button
                    variant="outline"
                    size="sm"
                    className="flex-1"
                    onClick={() => router.push(`/edit-resume?id=${resume.id}`)}
                  >
                    <Edit className="h-4 w-4 mr-1" /> Edit
                  </Button>
                </div>
              </CardContent>
              <CardFooter className="bg-gray-50 p-4 flex justify-between">
                <Button variant="ghost" size="sm" onClick={() => handleDownloadResume(resume.id)}>
                  <Download className="h-4 w-4 mr-1" /> Download
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  className="text-red-500 hover:text-red-700 hover:bg-red-50"
                  onClick={() => handleDeleteResume(resume.id)}
                  disabled={isDeleting === resume.id}
                >
                  {isDeleting === resume.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      )}
    </div>
  )
}



// "use client"

// import { useState, useEffect } from "react"
// import Link from "next/link"
// import { useRouter } from "next/navigation"
// import { Button } from "@/components/ui/button"
// import { Card, CardContent, CardFooter } from "@/components/ui/card"
// import { toast } from "@/components/ui/use-toast"
// import { Plus, FileText, Edit, Download, Trash2, Loader2 } from "lucide-react"

// interface Resume {
//   id: string
//   templateName: string
//   createdAt: string
//   updatedAt: string
// }

// export default function DashboardPage() {
//   const router = useRouter()
//   const [resumes, setResumes] = useState<Resume[]>([])
//   const [isLoading, setIsLoading] = useState(true)
//   const [isDeleting, setIsDeleting] = useState<string | null>(null)

//   useEffect(() => {
//     const fetchResumes = async () => {
//       try {
//         const resumesResponse = await fetch("http://localhost:5000/api/resumes", {
//           credentials: "include",
//         })

//         if (resumesResponse.ok) {
//           const data = await resumesResponse.json()
//           setResumes(data.resumes)
//         } else {
//           toast({
//             title: "Error",
//             description: "Failed to load your resumes. Please try again.",
//             variant: "destructive",
//           })
//         }
//       } catch (error) {
//         toast({
//           title: "Error",
//           description: "An error occurred while loading your resumes.",
//           variant: "destructive",
//         })
//       } finally {
//         setIsLoading(false)
//       }
//     }

//     fetchResumes()
//   }, [router])

//   const handleDeleteResume = async (id: string) => {
//     setIsDeleting(id)

//     try {
//       const response = await fetch(`http://localhost:5000/api/resume/${id}`, {
//         method: "DELETE",
//         credentials: "include",
//       })

//       if (response.ok) {
//         setResumes(resumes.filter((resume) => resume.id !== id))
//         toast({
//           title: "Resume deleted",
//           description: "Your resume has been deleted successfully.",
//         })
//       } else {
//         const errorData = await response.json()
//         toast({
//           title: "Delete failed",
//           description: errorData.message || "Failed to delete resume. Please try again.",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred while deleting your resume.",
//         variant: "destructive",
//       })
//     } finally {
//       setIsDeleting(null)
//     }
//   }

//   const handleDownloadResume = async (id: string) => {
//     try {
//       const response = await fetch(`http://localhost:5000/api/resume/${id}/download`, {
//         credentials: "include",
//       })

//       if (response.ok) {
//         const blob = await response.blob()
//         const url = window.URL.createObjectURL(blob)
//         const a = document.createElement("a")
//         a.href = url
//         a.download = `resume-${Date.now()}.pdf`
//         document.body.appendChild(a)
//         a.click()

//         window.URL.revokeObjectURL(url)
//         document.body.removeChild(a)
//       } else {
//         const errorData = await response.json()
//         toast({
//           title: "Download failed",
//           description: errorData.message || "Failed to download resume. Please try again.",
//           variant: "destructive",
//         })
//       }
//     } catch (error) {
//       toast({
//         title: "Error",
//         description: "An error occurred while downloading your resume.",
//         variant: "destructive",
//       })
//     }
//   }

//   if (isLoading) {
//     return (
//       <div className="flex min-h-screen items-center justify-center">
//         <div className="text-center">
//           <div className="animate-spin h-8 w-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
//           <p>Loading your resumes...</p>
//         </div>
//       </div>
//     )
//   }

//   return (
//     <div className="container mx-auto py-12 px-6">
//       <div className="flex justify-between items-center mb-8">
//         <h1 className="text-3xl font-bold">My Resumes</h1>
//         <Link href="/templates">
//           <Button className="gap-2">
//             <Plus size={16} />
//             Create New Resume
//           </Button>
//         </Link>
//       </div>

//       {resumes.length === 0 ? (
//         <Card className="p-12 text-center">
//           <FileText size={48} className="mx-auto text-gray-300 mb-4" />
//           <h2 className="text-xl font-semibold mb-2">No Resumes Yet</h2>
//           <p className="text-gray-500 mb-6">
//             You haven&apos;t created any resumes yet. Get started by creating your first resume.
//           </p>
//           <Link href="/templates">
//             <Button>Create Your First Resume</Button>
//           </Link>
//         </Card>
//       ) : (
//         <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
//           {resumes.map((resume) => (
//             <Card key={resume.id} className="overflow-hidden">
//               <CardContent className="p-6">
//                 <div className="flex items-center justify-between mb-4">
//                   <div className="bg-primary/10 p-2 rounded">
//                     <FileText className="h-6 w-6 text-primary" />
//                   </div>
//                   <span className="text-sm text-gray-500">{new Date(resume.updatedAt).toLocaleDateString()}</span>
//                 </div>
//                 <h3 className="font-semibold text-lg mb-1">Resume</h3>
//                 <p className="text-sm text-gray-500 mb-4">Template: {resume.templateName}</p>
//                 <div className="flex space-x-2">
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex-1"
//                     onClick={() => router.push(`/resume-preview?id=${resume.id}`)}
//                   >
//                     <FileText className="h-4 w-4 mr-1" /> View
//                   </Button>
//                   <Button
//                     variant="outline"
//                     size="sm"
//                     className="flex-1"
//                     onClick={() => router.push(`/edit-resume?id=${resume.id}`)}
//                   >
//                     <Edit className="h-4 w-4 mr-1" /> Edit
//                   </Button>
//                 </div>
//               </CardContent>
//               <CardFooter className="bg-gray-50 p-4 flex justify-between">
//                 <Button variant="ghost" size="sm" onClick={() => handleDownloadResume(resume.id)}>
//                   <Download className="h-4 w-4 mr-1" /> Download
//                 </Button>
//                 <Button
//                   variant="ghost"
//                   size="sm"
//                   className="text-red-500 hover:text-red-700 hover:bg-red-50"
//                   onClick={() => handleDeleteResume(resume.id)}
//                   disabled={isDeleting === resume.id}
//                 >
//                   {isDeleting === resume.id ? (
//                     <Loader2 className="h-4 w-4 animate-spin" />
//                   ) : (
//                     <Trash2 className="h-4 w-4" />
//                   )}
//                 </Button>
//               </CardFooter>
//             </Card>
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }
