import { NextResponse } from "next/server"

export const runtime = "nodejs"

export async function GET() {
  try {
    // Check if HUGGINGFACE_API_KEY is set
    const apiKey = process.env.HUGGINGFACE_API_KEY

    if (!apiKey) {
      return NextResponse.json(
        {
          error: "Missing HUGGINGFACE_API_KEY environment variable",
          solution: "Please add your Hugging Face API key to your .env.local file or Vercel environment variables.",
        },
        { status: 500 },
      )
    }

    if (apiKey.trim() === "") {
      return NextResponse.json(
        {
          error: "HUGGINGFACE_API_KEY is empty",
          solution: "Please add a valid Hugging Face API key to your .env.local file or Vercel environment variables.",
        },
        { status: 500 },
      )
    }

    // Check if the API key has any suspicious characters that might indicate it's not properly formatted
    if (apiKey.includes('"') || apiKey.includes("'") || apiKey.includes(" ")) {
      return NextResponse.json(
        {
          error: "HUGGINGFACE_API_KEY contains invalid characters",
          solution: "Please remove any quotes or spaces from your API key in the .env.local file.",
        },
        { status: 500 },
      )
    }

    // Make a simple request to the Hugging Face API to verify the key
    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        inputs: "Hello, how are you?",
        parameters: {
          max_new_tokens: 50,
          return_full_text: false,
        },
      }),
    })

    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Hugging Face API error: Status ${response.status} - ${errorText}`)

      if (response.status === 401 || errorText.includes("Invalid credentials")) {
        return NextResponse.json(
          {
            error: "Invalid Hugging Face API key",
            details: "The API key was rejected by Hugging Face. Please check that you're using a valid API key.",
            solution: "Get a new API key from https://huggingface.co/settings/tokens",
          },
          { status: 401 },
        )
      }

      throw new Error(`Hugging Face API error: ${response.statusText} - ${errorText}`)
    }

    // Just return a success response with a masked version of the key
    const maskedKey =
      apiKey.length > 8 ? `${apiKey.substring(0, 4)}...${apiKey.substring(apiKey.length - 4)}` : "********"

    return NextResponse.json({
      success: true,
      message: "HUGGINGFACE_API_KEY is configured and working",
      keyPreview: maskedKey,
    })
  } catch (error) {
    console.error("Error in test Hugging Face endpoint:", error)
    return NextResponse.json(
      {
        error: "Failed to verify Hugging Face API key",
        details: error instanceof Error ? error.message : "Unknown error",
        solution:
          "Please check your internet connection and try again. If the problem persists, try getting a new API key from https://huggingface.co/settings/tokens",
      },
      { status: 500 },
    )
  }
}
