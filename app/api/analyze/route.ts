import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      return NextResponse.json(
        { feedback: "API key is missing!" },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const { resume, jobDesc } = await req.json()

    const model = genAI.getGenerativeModel({ 
      model: "gemini-2.5-flash" 
    })

    const prompt = `
You are an expert resume coach. Analyze this resume against the job description.

JOB DESCRIPTION:
${jobDesc}

RESUME:
${resume}

Give feedback in this exact format:

MATCH SCORE: X/10

STRONG POINTS:
- List what matches well

MISSING SKILLS:
- List skills in job description but missing from resume

IMPROVEMENTS:
- List specific changes to make

REWRITTEN SUMMARY:
Write an improved professional summary for this role
`

    const result = await model.generateContent(prompt)
    const feedback = result.response.text()

    const { createClient } = await import("@supabase/supabase-js")
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
)

await supabase.from("resumes").insert({
  job_description: jobDesc,
  resume_text: resume,
  ai_feedback: feedback
})

    return NextResponse.json({ feedback })

  } catch (error: any) {
    console.error("Gemini error:", error?.message)
    return NextResponse.json(
      { feedback: "Error: " + error?.message },
      { status: 500 }
    )
  }
}