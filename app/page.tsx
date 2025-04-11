import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowRight } from "lucide-react"

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="border-b">
        <div className="container mx-auto py-4 px-6 flex justify-between items-center">
          <h1 className="text-2xl font-bold">VocalResume</h1>
          <div className="space-x-4">
            <Link href="/login">
              <Button variant="outline">Login</Button>
            </Link>
            <Link href="/signup">
              <Button>Sign Up</Button>
            </Link>
          </div>
        </div>
      </header>

      <main className="flex-1">
        <section className="py-20 px-6">
          <div className="container mx-auto max-w-5xl text-center">
            <h2 className="text-5xl font-bold mb-6">Create Your Resume with Voice</h2>
            <p className="text-xl text-gray-600 mb-10 max-w-3xl mx-auto">
              Select from multiple templates, record your information, and let AI do the rest. Download your
              professional resume in minutes.
            </p>
            <Link href="/templates">
              <Button size="lg" className="gap-2">
                Get Started <ArrowRight size={16} />
              </Button>
            </Link>
          </div>
        </section>

        <section className="bg-gray-50 py-20 px-6">
          <div className="container mx-auto max-w-5xl">
            <h2 className="text-3xl font-bold mb-10 text-center">How It Works</h2>
            <div className="grid md:grid-cols-3 gap-10">
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary font-bold">
                  1
                </div>
                <h3 className="text-xl font-semibold mb-2">Choose a Template</h3>
                <p className="text-gray-600">Browse and select from our collection of professional resume templates.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary font-bold">
                  2
                </div>
                <h3 className="text-xl font-semibold mb-2">Record or Upload Audio</h3>
                <p className="text-gray-600">Tell us about your experience, skills, and education through voice.</p>
              </div>
              <div className="bg-white p-6 rounded-lg shadow-sm">
                <div className="w-12 h-12 bg-primary/10 rounded-full flex items-center justify-center mb-4 text-primary font-bold">
                  3
                </div>
                <h3 className="text-xl font-semibold mb-2">Download Your Resume</h3>
                <p className="text-gray-600">
                  Our AI formats your information into a professional resume ready to download.
                </p>
              </div>
            </div>
          </div>
        </section>
      </main>

      <footer className="border-t py-8 px-6">
        <div className="container mx-auto text-center text-gray-500">
          <p>© {new Date().getFullYear()} VocalResume. All rights reserved.</p>
        </div>
      </footer>
    </div>
  )
}
