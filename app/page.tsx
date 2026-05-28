export default function Home() {
  return (
    <main className="min-h-screen bg-gray-950 text-white flex flex-col items-center justify-center p-6">
      <div className="max-w-2xl w-full text-center">
        <h1 className="text-4xl font-bold mb-4 text-blue-400">
          AI Resume Coach
        </h1>
        <p className="text-gray-400 text-lg mb-8">
          Paste your resume and job description — AI will tell you exactly what to improve
        </p>
        <a
          href="/analyze"
          className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-8 py-3 rounded-lg transition"
        >
          Start Analyzing →
        </a>
      </div>
    </main>
  )
}