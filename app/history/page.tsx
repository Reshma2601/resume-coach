"use client"
import toast from "react-hot-toast"
import { useEffect, useState } from "react"
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

export default function HistoryPage() {
  const [resumes, setResumes] = useState<any[]>([])
  const [expanded, setExpanded] = useState<number | null>(null)

  useEffect(() => {
    const fetchResumes = async () => {
      const { data } = await supabase
        .from("resumes")
        .select("*")
        .order("created_at", { ascending: false })
      if (data) setResumes(data)
        toast.success("History loaded!")
    }
    fetchResumes()
  }, [])

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold text-blue-400 mb-2">
          Analysis History
        </h1>
        <p className="text-gray-400 mb-8">
          All your previous resume analyses
        </p>

        {resumes.length === 0 && (
          <div className="text-center text-gray-500 mt-20">
            <p className="text-xl">No analyses yet</p>
            <a
              href="/analyze"
              className="text-blue-400 hover:underline mt-2 block"
            >
              Analyze your first resume →
            </a>
          </div>
        )}

        <div className="flex flex-col gap-4">
          {resumes.map((item: any) => (
            <div
              key={item.id}
              className="bg-gray-900 border border-gray-700 rounded-lg p-6" >
              <div className="flex justify-between items-center mb-4">
                <span className="text-blue-400 font-semibold">
                  Resume Analysis
                </span>
                <span className="text-gray-500 text-sm">
                  {new Date(item.created_at).toLocaleDateString("en-IN", {
                    day: "numeric",
                    month: "short",
                    year: "numeric",
                    hour: "2-digit",
                    minute: "2-digit"
                  })}
                </span>
              </div>

              <div className="mb-3">
                <p className="text-gray-400 text-sm mb-1">
                  Job Description:
                </p>
                <p className="text-gray-300 text-sm line-clamp-2">
                  {item.job_description}
                </p>
              </div>

              <div className="mb-4">
                <p className="text-gray-400 text-sm mb-1">
                  AI Feedback:
                </p>
                <p className={`text-gray-300 text-sm whitespace-pre-wrap ${
                  expanded === item.id ? "" : "line-clamp-3"
                }`}>
                  {item.ai_feedback}
                </p>
              </div>

              <div className="flex gap-4">
                <button
                  onClick={() =>
                    setExpanded(expanded === item.id ? null : item.id)
                  }
                  className="text-blue-400 text-sm hover:underline">
                  {expanded === item.id ? "Show Less ↑" : "View Full Result ↓"}
                </button>
                <a
                  href="/analyze"
                  className="text-gray-400 text-sm hover:underline">
                  Analyze again →
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  )
}