"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowRight, ArrowLeft } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type QueueItem = {
  value: string
  id: number
}

export default function QueueVisualizer() {
  const [queue, setQueue] = useState<QueueItem[]>([])
  const [inputValue, setInputValue] = useState("")
  const [nextId, setNextId] = useState(0)
  const [operation, setOperation] = useState<"enqueue" | "dequeue" | null>(null)
  const [animatingItem, setAnimatingItem] = useState<QueueItem | null>(null)
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)

  const enqueueCode = [
    "function enqueue(queue, value) {",
    "  // Create new item",
    "  const newItem = { value, id: nextId }",
    "  ",
    "  // Add item to the end of the queue",
    "  queue.push(newItem)",
    "  ",
    "  // Return updated queue",
    "  return queue",
    "}",
  ]

  const dequeueCode = [
    "function dequeue(queue) {",
    "  // Check if queue is empty",
    "  if (queue.length === 0) {",
    "    return 'Queue Underflow'",
    "  }",
    "  ",
    "  // Remove item from the front of the queue",
    "  const dequeuedItem = queue.shift()",
    "  ",
    "  // Return the dequeued item",
    "  return dequeuedItem",
    "}",
  ]

  const handleEnqueue = () => {
    if (inputValue.trim() === "") return

    const newItem = { value: inputValue, id: nextId }
    setAnimatingItem(newItem)
    setOperation("enqueue")
    setNextId(nextId + 1)
    setHighlightedLine(2) // Highlight creating new item

    setTimeout(() => {
      setHighlightedLine(5) // Highlight adding to queue
      setTimeout(() => {
        setQueue([...queue, newItem])
        setAnimatingItem(null)
        setOperation(null)
        setInputValue("")
        setHighlightedLine(8) // Highlight returning queue
        setTimeout(() => {
          setHighlightedLine(null)
        }, 500)
      }, 500)
    }, 500)
  }

  const handleDequeue = () => {
    if (queue.length === 0) {
      setHighlightedLine(2) // Highlight empty check
      setTimeout(() => {
        setHighlightedLine(3) // Highlight underflow
        setTimeout(() => {
          setHighlightedLine(null)
        }, 1000)
      }, 500)
      return
    }

    const dequeuedItem = queue[0]
    setAnimatingItem(dequeuedItem)
    setOperation("dequeue")
    setHighlightedLine(7) // Highlight removing item

    setTimeout(() => {
      setQueue(queue.slice(1))
      setHighlightedLine(10) // Highlight returning item
      setTimeout(() => {
        setAnimatingItem(null)
        setOperation(null)
        setHighlightedLine(null)
      }, 500)
    }, 500)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex gap-2 w-full md:w-auto">
          <Input
            type="text"
            placeholder="Enter value"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="w-full md:w-48"
            onKeyDown={(e) => {
              if (e.key === "Enter") handleEnqueue()
            }}
          />
          <Button onClick={handleEnqueue} disabled={operation !== null}>
            <ArrowRight className="mr-2 h-4 w-4" />
            Enqueue
          </Button>
        </div>
        <Button onClick={handleDequeue} disabled={queue.length === 0 || operation !== null}>
          <ArrowLeft className="mr-2 h-4 w-4" />
          Dequeue
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative border rounded-md bg-muted/20 p-4 min-h-[200px] flex flex-col">
          <div className="w-full text-center font-medium py-2 mb-4 border-b bg-primary text-primary-foreground">
            Queue (Front → Back)
          </div>

          <div className="flex items-center justify-center gap-4 flex-wrap p-4">
            <AnimatePresence>
              {queue.map((item, index) => (
                <motion.div
                  key={item.id}
                  className={`w-16 h-16 flex items-center justify-center border rounded-md shadow-sm text-center
                    ${index === 0 ? "bg-blue-100 border-blue-300 dark:bg-blue-900/30" : "bg-card border-muted"}`}
                  initial={{ opacity: 0, x: 50 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -50 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.value}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Animating item for enqueue */}
            {operation === "enqueue" && animatingItem && (
              <motion.div
                className="w-16 h-16 flex items-center justify-center bg-green-100 border border-green-300 rounded-md shadow-sm absolute right-8"
                initial={{ opacity: 0, x: 100 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5 }}
              >
                {animatingItem.value}
              </motion.div>
            )}

            {/* Animating item for dequeue */}
            {operation === "dequeue" && animatingItem && (
              <motion.div
                className="w-16 h-16 flex items-center justify-center bg-red-100 border border-red-300 rounded-md shadow-sm absolute left-8"
                initial={{ opacity: 1, x: 0 }}
                animate={{ opacity: 0, x: -100 }}
                transition={{ duration: 0.5 }}
              >
                {animatingItem.value}
              </motion.div>
            )}

            {queue.length === 0 && !animatingItem && <div className="text-muted-foreground italic">Queue is empty</div>}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {operation === "dequeue" ? "Dequeue Operation" : "Enqueue Operation"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-auto h-64 font-mono text-sm">
              {(operation === "dequeue" ? dequeueCode : enqueueCode).map((line, index) => (
                <div
                  key={index}
                  className={`${highlightedLine === index ? "bg-yellow-100 dark:bg-yellow-900/30" : ""} px-2 py-0.5`}
                >
                  {line}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="text-center">
        <h3 className="font-medium">Queue Operations</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Enqueue: Add an element to the back of the queue
          <br />
          Dequeue: Remove an element from the front of the queue
        </p>
      </div>
    </div>
  )
}
