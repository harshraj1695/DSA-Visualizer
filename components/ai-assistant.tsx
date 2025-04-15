"use client"

import { useState, useRef, useEffect } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Bot, X, Minimize2, Maximize2, Send, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Avatar } from "@/components/ui/avatar"
import { ScrollArea } from "@/components/ui/scroll-area"
import { Spinner } from "@/components/ui/spinner"
import { Alert, AlertDescription } from "@/components/ui/alert"

type Message = {
  id: string
  content: string
  role: "user" | "assistant"
}

export default function AIAssistant() {
  const [isOpen, setIsOpen] = useState(false)
  const [isMinimized, setIsMinimized] = useState(false)
  const [showWelcome, setShowWelcome] = useState(true)
  const [showLimitedModeNotice, setShowLimitedModeNotice] = useState(true)
  const [input, setInput] = useState("")
  const [messages, setMessages] = useState<Message[]>([])
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<Error | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const displayMessages = showWelcome
    ? [
        {
          id: "welcome-message",
          content:
            "Hi! I'm your DSA assistant. Ask me about any algorithm or data structure, and I'll explain it step by step.",
          role: "assistant" as const,
        },
        ...messages,
      ]
    : messages

  useEffect(() => {
    if (messages.length > 0 && messages[0].role === "user") {
      setShowWelcome(false)
    }
  }, [messages])

  useEffect(() => {
    if (messagesEndRef.current) {
      messagesEndRef.current.scrollIntoView({ behavior: "smooth" })
    }
  }, [displayMessages])

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    const trimmedInput = input.trim()
    if (!trimmedInput) return

    const newUserMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: trimmedInput,
    }

    setMessages((prev) => [...prev, newUserMessage])
    setInput("")
    setIsLoading(true)
    setError(null)

    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: [...messages, newUserMessage] }),
      })

      const data = await res.json()

      const newAssistantMessage: Message = {
        id: `${Date.now()}-bot`,
        role: "assistant",
        content: data.reply || "Sorry, I couldn't find a good response.",
      }

      setMessages((prev) => [...prev, newAssistantMessage])
    } catch (err: any) {
      console.error(err)
      setError(err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{
              opacity: 1,
              scale: 1,
              y: 0,
              width: isMinimized ? "auto" : "350px",
              height: isMinimized ? "auto" : "500px",
            }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.2 }}
            className="fixed bottom-20 right-6 z-50 shadow-2xl rounded-lg overflow-hidden"
          >
            {isMinimized ? (
              <Button
                onClick={() => setIsMinimized(false)}
                className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white p-3 rounded-full"
              >
                <Maximize2 size={20} />
              </Button>
            ) : (
              <Card className="w-full h-full flex flex-col">
                <CardHeader className="bg-gradient-to-r from-indigo-500 to-purple-600 text-white py-3 px-4 flex flex-row justify-between items-center">
                  <div className="flex items-center gap-2">
                    <Avatar className="h-8 w-8 bg-white/20">
                      <Bot size={16} className="text-white" />
                    </Avatar>
                    <span className="font-medium">DSA Assistant</span>
                  </div>
                  <div className="flex gap-1">
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsMinimized(true)}
                      className="h-7 w-7 text-white hover:bg-white/20"
                    >
                      <Minimize2 size={16} />
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => setIsOpen(false)}
                      className="h-7 w-7 text-white hover:bg-white/20"
                    >
                      <X size={16} />
                    </Button>
                  </div>
                </CardHeader>
                <CardContent className="flex-grow overflow-hidden p-0">
                  <ScrollArea className="h-[380px] p-4">
                    <div className="flex flex-col gap-3">
                      {showLimitedModeNotice && (
                        <Alert className="bg-amber-50 border-amber-200 dark:bg-amber-900/20 dark:border-amber-800">
                          <AlertCircle className="h-4 w-4 text-amber-600 dark:text-amber-400" />
                          <AlertDescription className="text-xs text-amber-800 dark:text-amber-300">
                            Running in limited mode with pre-defined responses for common DSA topics as the API Limit Exceded.
                            <Button
                              variant="link"
                              className="text-xs p-0 h-auto text-amber-800 dark:text-amber-300 underline"
                              onClick={() => setShowLimitedModeNotice(false)}
                            >
                              Dismiss
                            </Button>
                          </AlertDescription>
                        </Alert>
                      )}

                      {displayMessages.map((message) => (
                        <div
                          key={message.id}
                          className={`flex ${message.role === "user" ? "justify-end" : "justify-start"}`}
                        >
                          <div
                            className={`max-w-[80%] rounded-lg px-3 py-2 text-sm ${
                              message.role === "user"
                                ? "bg-indigo-500 text-white"
                                : "bg-gray-100 dark:bg-gray-800"
                            }`}
                          >
                            <p className="whitespace-pre-line">{message.content}</p>
                          </div>
                        </div>
                      ))}
                      {isLoading && (
                        <div className="flex justify-start">
                          <div className="max-w-[80%] rounded-lg px-3 py-2 bg-gray-100 dark:bg-gray-800">
                            <Spinner className="h-5 w-5 text-indigo-500" />
                          </div>
                        </div>
                      )}
                      {error && (
                        <div className="flex justify-center">
                          <div className="max-w-[80%] rounded-lg px-3 py-2 bg-red-100 text-red-600 dark:bg-red-900/30 dark:text-red-400 text-sm">
                            Error: {error.message || "Failed to load response"}
                          </div>
                        </div>
                      )}
                      <div ref={messagesEndRef} />
                    </div>
                  </ScrollArea>
                </CardContent>
                <CardFooter className="p-3 border-t">
                  <form onSubmit={handleSubmit} className="flex w-full gap-2">
                    <Input
                      placeholder="Ask about any algorithm..."
                      value={input}
                      onChange={(e) => setInput(e.target.value)}
                      className="flex-grow"
                      disabled={isLoading}
                    />
                    <Button
                      type="submit"
                      size="icon"
                      className="bg-indigo-500 hover:bg-indigo-600"
                      disabled={isLoading || !input.trim()}
                    >
                      <Send size={16} />
                    </Button>
                  </form>
                </CardFooter>
              </Card>
            )}
          </motion.div>
        )}
      </AnimatePresence>

      {!isOpen && (
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="fixed bottom-6 right-6 z-50"
        >
          <motion.button
            className="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-600 text-white px-4 py-3 rounded-full shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={() => setIsOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            initial={{ width: "auto" }}
            animate={{
              width: "auto",
              transition: { duration: 0.3 },
            }}
          >
            <motion.div
              initial={{ rotate: 0 }}
              animate={{
                rotate: [0, -10, 10, -10, 10, 0],
                transition: {
                  repeat: Number.POSITIVE_INFINITY,
                  repeatDelay: 5,
                  duration: 1.5,
                  ease: "easeInOut",
                },
              }}
            >
              <Bot size={24} />
            </motion.div>
            <motion.span
              initial={{ opacity: 0, width: 0 }}
              animate={{
                opacity: 1,
                width: "auto",
                transition: { delay: 0.5, duration: 0.3 },
              }}
              className="font-medium whitespace-nowrap"
            >
              Ask DSA Assistant
            </motion.span>
          </motion.button>
          <motion.div
            className="absolute -top-2 -right-2 h-4 w-4 bg-green-500 rounded-full"
            animate={{
              scale: [1, 1.2, 1],
              opacity: [0.7, 1, 0.7],
            }}
            transition={{
              duration: 2,
              repeat: Number.POSITIVE_INFINITY,
              ease: "easeInOut",
            }}
          />
        </motion.div>
      )}
    </>
  )
}
