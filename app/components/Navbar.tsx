export default function Navbar() {
  return (
    <nav className="bg-gray-900 border-b border-gray-800 px-6 py-4">
      <div className="max-w-4xl mx-auto flex justify-between items-center">
        <a href="/" className="text-blue-400 font-bold text-xl">
          ResumeCoach AI
        </a>
        <div className="flex gap-6">
          <a
            href="/analyze"
            className="text-gray-400 hover:text-white text-sm transition"
          >
            Analyze
          </a>
          <a
            href="/history"
            className="text-gray-400 hover:text-white text-sm transition"
          >
            History
          </a>
        </div>
      </div>
    </nav>
  )
}