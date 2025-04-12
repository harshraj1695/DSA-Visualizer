"use client"

import { useState } from "react"
import { motion, AnimatePresence } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { ArrowDown, ArrowUp } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

type StackItem = {
  value: string
  id: number
}

export default function StackVisualizer() {
  const [stack, setStack] = useState<StackItem[]>([])
  const [inputValue, setInputValue] = useState("")
  const [nextId, setNextId] = useState(0)
  const [operation, setOperation] = useState<"push" | "pop" | null>(null)
  const [animatingItem, setAnimatingItem] = useState<StackItem | null>(null)
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)

  const pushCode = [
    "function push(stack, value) {",
    "  // Create new item",
    "  const newItem = { value, id: nextId }",
    "  ",
    "  // Add item to the top of the stack",
    "  stack.push(newItem)",
    "  ",
    "  // Return updated stack",
    "  return stack",
    "}",
  ]

  const popCode = [
    "function pop(stack) {",
    "  // Check if stack is empty",
    "  if (stack.length === 0) {",
    "    return 'Stack Underflow'",
    "  }",
    "  ",
    "  // Remove item from the top of the stack",
    "  const poppedItem = stack.pop()",
    "  ",
    "  // Return the popped item",
    "  return poppedItem",
    "}",
  ]

  const handlePush = () => {
    if (inputValue.trim() === "") return

    const newItem = { value: inputValue, id: nextId }
    setAnimatingItem(newItem)
    setOperation("push")
    setNextId(nextId + 1)
    setHighlightedLine(2) // Highlight creating new item

    setTimeout(() => {
      setHighlightedLine(5) // Highlight adding to stack
      setTimeout(() => {
        setStack([...stack, newItem])
        setAnimatingItem(null)
        setOperation(null)
        setInputValue("")
        setHighlightedLine(8) // Highlight returning stack
        setTimeout(() => {
          setHighlightedLine(null)
        }, 500)
      }, 500)
    }, 500)
  }

  const handlePop = () => {
    if (stack.length === 0) {
      setHighlightedLine(2) // Highlight empty check
      setTimeout(() => {
        setHighlightedLine(3) // Highlight underflow
        setTimeout(() => {
          setHighlightedLine(null)
        }, 1000)
      }, 500)
      return
    }

    const poppedItem = stack[stack.length - 1]
    setAnimatingItem(poppedItem)
    setOperation("pop")
    setHighlightedLine(7) // Highlight removing item

    setTimeout(() => {
      setStack(stack.slice(0, -1))
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
              if (e.key === "Enter") handlePush()
            }}
          />
          <Button onClick={handlePush} disabled={operation !== null}>
            <ArrowDown className="mr-2 h-4 w-4" />
            Push
          </Button>
        </div>
        <Button onClick={handlePop} disabled={stack.length === 0 || operation !== null}>
          <ArrowUp className="mr-2 h-4 w-4" />
          Pop
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="relative border rounded-md bg-muted/20 p-4 min-h-[300px] flex flex-col items-center">
          <div className="w-full text-center font-medium py-2 mb-4 border-b bg-primary text-primary-foreground">
            Stack Top
          </div>

          <div className="w-full flex flex-col-reverse items-center gap-2">
            <AnimatePresence>
              {stack.map((item, index) => (
                <motion.div
                  key={item.id}
                  className="w-full max-w-[200px] p-3 bg-card border rounded-md shadow-sm text-center"
                  initial={{ opacity: 0, y: -20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ duration: 0.3 }}
                >
                  {item.value}
                </motion.div>
              ))}
            </AnimatePresence>

            {/* Animating item */}
            {operation === "push" && animatingItem && (
              <motion.div
                className="w-full max-w-[200px] p-3 bg-green-100 border border-green-300 rounded-md shadow-sm text-center absolute"
                initial={{ opacity: 0, y: -100 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                style={{ top: "80px" }}
              >
                {animatingItem.value}
              </motion.div>
            )}

            {operation === "pop" && animatingItem && (
              <motion.div
                className="w-full max-w-[200px] p-3 bg-red-100 border border-red-300 rounded-md shadow-sm text-center absolute"
                initial={{ opacity: 1, y: 0 }}
                animate={{ opacity: 0, y: -100 }}
                transition={{ duration: 0.5 }}
                style={{ top: "80px" }}
              >
                {animatingItem.value}
              </motion.div>
            )}

            {stack.length === 0 && !animatingItem && <div className="text-muted-foreground italic">Stack is empty</div>}
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">{operation === "pop" ? "Pop Operation" : "Push Operation"}</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-auto h-64 font-mono text-sm">
              {(operation === "pop" ? popCode : pushCode).map((line, index) => (
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
        <h3 className="font-medium">Stack Operations</h3>
        <p className="text-sm text-muted-foreground mt-1">
          Push: Add an element to the top of the stack
          <br />
          Pop: Remove the top element from the stack
        </p>
      </div>
    </div>
  )
}
