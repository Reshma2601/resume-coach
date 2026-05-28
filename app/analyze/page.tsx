"use client"
import { useState } from "react"
import toast from "react-hot-toast"

export default function AnalyzePage() {
  const [resume, setResume] = useState("")
  const [jobDesc, setJobDesc] = useState("")
  const [feedback, setFeedback] = useState("")
  const [loading, setLoading] = useState(false)
  const [score, setScore] = useState<number | null>(null)
  const [coverLetter, setCoverLetter] = useState("")
  const [coverLoading, setCoverLoading] = useState(false)

  const handleAnalyze = async () => {
    if (!resume || !jobDesc) {
      toast.error("Please fill both resume and job description!")
      return
    }
    setLoading(true)
    setFeedback("")
    setScore(null)
    try {
      const res = await fetch("/api/analyze", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDesc }),
      })
      const data = await res.json()
      setFeedback(data.feedback)
      const scoreMatch = data.feedback.match(/MATCH SCORE:\s*(\d+)\/10/)
      if (scoreMatch) {
        setScore(parseInt(scoreMatch[1]))
      }
      toast.success("Analysis complete!")
    } catch (error) {
      setFeedback("Something went wrong. Please try again.")
      toast.error("Something went wrong!")
    }
    setLoading(false)
  }

  const handleCoverLetter = async () => {
    if (!resume || !jobDesc) {
      toast.error("Please fill both resume and job description!")
      return
    }
    setCoverLoading(true)
    setCoverLetter("")
    try {
      const res = await fetch("/api/coverletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ resume, jobDesc }),
      })
      const data = await res.json()
      console.log("Cover letter data:", data)
      setCoverLetter(data.coverLetter)
      toast.success("Cover letter generated!")
    } catch (error) {
      toast.error("Something went wrong!")
    }
    setCoverLoading(false)
  }

  return (
    <main className="min-h-screen bg-gray-950 text-white p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-blue-400 mb-2">
              Analyze My Resume
            </h1>
            <p className="text-gray-400">
              Paste your resume and job description below
            </p>
          </div>
          <div className="flex gap-3">
            <a href="/" className="text-gray-400 hover:text-white text-sm transition">
              ← Home
            </a>
            <a href="/history" className="text-gray-400 hover:text-white text-sm transition">
              History
            </a>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Your Resume
            </label>
            <textarea
              className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-blue-500"
              placeholder="Paste your resume here..."
              value={resume}
              onChange={(e) => setResume(e.target.value)}
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              Job Description
            </label>
            <textarea
              className="w-full h-64 bg-gray-900 border border-gray-700 rounded-lg p-4 text-white resize-none focus:outline-none focus:border-blue-500"
              placeholder="Paste the job description here..."
              value={jobDesc}
              onChange={(e) => setJobDesc(e.target.value)}
            />
          </div>
        </div>

        <button
          onClick={handleAnalyze}
          disabled={loading || !resume || !jobDesc}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition mb-4"
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Analyzing your resume...
            </span>
          ) : (
            "Analyze My Resume →"
          )}
        </button>

        <button
          onClick={handleCoverLetter}
          disabled={coverLoading || !resume || !jobDesc}
          className="w-full bg-purple-600 hover:bg-purple-700 disabled:bg-gray-700 disabled:cursor-not-allowed text-white font-semibold py-3 rounded-lg transition mb-8"
        >
          {coverLoading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              Generating Cover Letter...
            </span>
          ) : (
            "Generate Cover Letter ✉️"
          )}
        </button>

        {coverLetter && (
          <div className="bg-gray-900 border border-purple-700 rounded-lg p-6 mb-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-semibold text-purple-400">
                ✉️ Generated Cover Letter
              </h2>
              <button
                onClick={() => {
                  navigator.clipboard.writeText(coverLetter)
                  toast.success("Cover letter copied!")
                }}
                className="text-sm bg-purple-700 hover:bg-purple-600 px-3 py-1 rounded text-white transition"
              >
                Copy ✅
              </button>
            </div>
            <p className="text-gray-300 whitespace-pre-wrap">{coverLetter}</p>
          </div>
        )}

        {feedback && (
          <div className="bg-gray-900 border border-gray-700 rounded-lg p-6">
            {score !== null && (
              <div className="flex flex-col items-center mb-6">
                <div className="relative w-32 h-32">
                  <svg className="w-32 h-32 -rotate-90" viewBox="0 0 120 120">
                    <circle cx="60" cy="60" r="54" fill="none" stroke="#1f2937" strokeWidth="10" />
                    <circle
                      cx="60" cy="60" r="54" fill="none"
                      stroke={score >= 7 ? "#22c55e" : score >= 4 ? "#f59e0b" : "#ef4444"}
                      strokeWidth="10"
                      strokeDasharray={`${(score / 10) * 339} 339`}
                      strokeLinecap="round"
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-3xl font-bold text-white">{score}</span>
                    <span className="text-gray-400 text-sm">out of 10</span>
                  </div>
                </div>
                <p className="text-gray-400 mt-2 text-sm">
                  {score >= 7 ? "🟢 Strong Match!" : score >= 4 ? "🟡 Average Match" : "🔴 Weak Match"}
                </p>
              </div>
            )}
            <h2 className="text-xl font-semibold text-blue-400 mb-4">
              AI Feedback
            </h2>
            <p className="text-gray-300 whitespace-pre-wrap">{feedback}</p>
          </div>
        )}
      </div>
    </main>
  )
}