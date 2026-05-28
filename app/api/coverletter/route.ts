import { GoogleGenerativeAI } from "@google/generative-ai"
import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const apiKey = process.env.GEMINI_API_KEY
    if (!apiKey) {
      return NextResponse.json(
        { error: "API key missing" },
        { status: 500 }
      )
    }

    const genAI = new GoogleGenerativeAI(apiKey)
    const { resume, jobDesc } = await req.json()

    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash"
    })

    const prompt = `
You are an expert career coach. Write a professional cover letter based on this resume and job description.

JOB DESCRIPTION:
${jobDesc}

RESUME:
${resume}

Write a compelling cover letter that:
- Opens with a strong hook
- Matches skills from resume to job requirements
- Shows enthusiasm for the role
- Ends with a confident call to action
- Is 3-4 paragraphs long
- Sounds human and natural, not robotic

Write only the cover letter, nothing else.
`

    const result = await model.generateContent(prompt)
    const coverLetter = result.response.text()

    return NextResponse.json({ coverLetter })
  } catch (error: any) {
    console.error("Cover letter error:", error?.message)
    return NextResponse.json(
      { error: error?.message },
      { status: 500 }
    )
  }
}