import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Check if MISTRAL_API_KEY is set
    const apiKey = process.env.MISTRAL_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Missing MISTRAL_API_KEY environment variable",
        },
        { status: 500 },
      )
    }

    // Just return a success response with a masked version of the key
    // (first 4 chars + last 4 chars)
    const maskedKey =
      apiKey.length > 8 ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "********"

    return NextResponse.json({
      success: true,
      message: "MISTRAL_API_KEY is configured",
      keyPreview: maskedKey,
    })
  } catch (error) {
    console.error("Error in test Mistral endpoint:", error)
    return NextResponse.json(
      {
        error: "Failed to verify Mistral API key",
        details: error instanceof Error ? error.message : "Unknown error",
      },
      { status: 500 },
    )
  }
}
