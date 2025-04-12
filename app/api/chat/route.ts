import { findBestResponse, generateGenericResponse } from "@/utils/dsa-responses"

export const runtime = "nodejs"

export async function POST(req: Request) {
  const { messages } = await req.json()

  // If there are no messages, return early
  if (!messages || messages.length === 0) {
    return new Response(
      JSON.stringify({
        error: "No messages provided",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    )
  }

  // Get the last user message
  const lastUserMessage = messages.filter((msg) => msg.role === "user").pop()

  if (!lastUserMessage) {
    return new Response(
      JSON.stringify({
        error: "No user message found",
      }),
      {
        status: 400,
        headers: { "Content-Type": "application/json" },
      },
    )
  }

  const lastMessage = lastUserMessage.content.trim()

  // Handle simple greetings directly
  if (isSimpleGreeting(lastMessage)) {
    const greeting = generateGreetingResponse()
    return new Response(
      JSON.stringify({
        reply: greeting,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  }

  // Try to find a local response first
  const localResponse = findBestResponse(lastMessage)
  if (localResponse) {
    return new Response(
      JSON.stringify({
        reply: localResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  }

  // If no local response is found, try the API if available
  try {
    // Check if API key exists
    const apiKey = process.env.HUGGINGFACE_API_KEY

    if (!apiKey || apiKey.trim() === "") {
      // No API key, use generic response
      const genericResponse = generateGenericResponse(lastMessage)
      return new Response(
        JSON.stringify({
          reply: genericResponse,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Format messages for the Hugging Face API
    const formattedMessages = messages
      .map((msg: any) => `${msg.role === "user" ? "Human" : "Assistant"}: ${msg.content}`)
      .join("\n")

    // Add system prompt
    const systemPrompt = `You are a helpful Data Structures and Algorithms (DSA) assistant. 
Your primary purpose is to explain algorithms and data structures in a clear, step-by-step manner.

When explaining algorithms:
1. Provide a simple definition
2. Explain the step-by-step process of how the algorithm works
3. Analyze the time and space complexity
4. Give examples of use cases
5. Provide pseudocode or code examples when appropriate

When explaining data structures:
1. Provide a clear definition
2. Explain the properties and characteristics
3. Describe common operations and their time complexities
4. Compare with similar data structures when relevant
5. Give examples of real-world applications

Focus on being educational and making complex concepts easy to understand.`

    const fullPrompt = `${systemPrompt}\n\n${formattedMessages}\nAssistant:`

    console.log("Calling Hugging Face API...")

    // Call Hugging Face Inference API
    const response = await fetch("https://api-inference.huggingface.co/models/HuggingFaceH4/zephyr-7b-beta", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey.trim()}`,
      },
      body: JSON.stringify({
        inputs: fullPrompt,
        parameters: {
          max_new_tokens: 1000,
          temperature: 0.7,
          return_full_text: false,
          do_sample: true,
        },
      }),
    })

    // If credits exceeded or other API error, fall back to generic response
    if (!response.ok) {
      const errorText = await response.text()
      console.error(`Hugging Face API error: Status ${response.status} - ${errorText}`)

      // Generate a generic response
      const genericResponse = generateGenericResponse(lastMessage)
      return new Response(
        JSON.stringify({
          reply: genericResponse,
        }),
        {
          status: 200,
          headers: { "Content-Type": "application/json" },
        },
      )
    }

    // Get the response as text
    const result = await response.json()
    const generatedText = result[0]?.generated_text || "Sorry, I couldn't generate a response."

    console.log("Hugging Face API response received successfully")

    // Return the response as a regular JSON response
    return new Response(
      JSON.stringify({
        reply: generatedText,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  } catch (error) {
    console.error("Error in chat API:", error)

    // Fall back to generic response for any error
    const genericResponse = generateGenericResponse(lastMessage)
    return new Response(
      JSON.stringify({
        reply: genericResponse,
      }),
      {
        status: 200,
        headers: { "Content-Type": "application/json" },
      },
    )
  }
}

// Function to check if a message is a simple greeting
function isSimpleGreeting(message: string): boolean {
  const greetings = [
    "hi",
    "hello",
    "hey",
    "hii",
    "hiii",
    "hiiii",
    "hiiiii",
    "hola",
    "greetings",
    "howdy",
    "sup",
    "what's up",
    "yo",
    "good morning",
    "good afternoon",
    "good evening",
    "good day",
  ]

  const lowercaseMessage = message.toLowerCase()
  return greetings.some(
    (greeting) =>
      lowercaseMessage === greeting ||
      lowercaseMessage.startsWith(`${greeting} `) ||
      lowercaseMessage.startsWith(`${greeting}!`),
  )
}

// Function to generate a friendly greeting response
function generateGreetingResponse(): string {
  const responses = [
    "Hi there! I'm your DSA assistant. How can I help you with algorithms or data structures today?",
    "Hello! I'm here to help with any data structures or algorithms questions you might have.",
    "Hey! Need help understanding a particular algorithm or data structure? I'm here to assist!",
    "Hi! I'm your DSA assistant. What would you like to learn about today?",
    "Hello there! I'm ready to help with any DSA concepts you want to explore.",
    "Hey! What algorithm or data structure would you like me to explain today?",
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}
