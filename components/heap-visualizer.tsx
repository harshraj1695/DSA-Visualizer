"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Heap Node Type
type HeapNode = {
  value: number
  index: number
  x?: number
  y?: number
  state?: "default" | "highlighted" | "swapping" | "comparing" | "sorted" | "current"
}

export default function HeapVisualizer() {
  const [heap, setHeap] = useState<HeapNode[]>([])
  const [inputValue, setInputValue] = useState("")
  const [isMaxHeap, setIsMaxHeap] = useState(true)
  const [operation, setOperation] = useState<"insert" | "delete" | "peek" | "heapify" | "sort" | null>(null)
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [animationSpeed, setAnimationSpeed] = useState(500) // ms per step
  const [sortedIndices, setSortedIndices] = useState<number[]>([])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)

  // Code snippets for different operations
  const insertCode = [
    "function insert(heap, value) {",
    "  // Add the new element to the end of the heap",
    "  heap.push(value);",
    "  ",
    "  // Get the index of the newly added element",
    "  let index = heap.length - 1;",
    "  ",
    "  // Perform heapify-up (bubble-up)",
    "  while (index > 0) {",
    "    // Calculate parent index",
    "    const parentIndex = Math.floor((index - 1) / 2);",
    "    ",
    "    // For max-heap: if parent is smaller than child, swap",
    "    // For min-heap: if parent is larger than child, swap",
    "    if ((isMaxHeap && heap[parentIndex] < heap[index]) ||",
    "        (!isMaxHeap && heap[parentIndex] > heap[index])) {",
    "      // Swap parent and child",
    "      [heap[parentIndex], heap[index]] = [heap[index], heap[parentIndex]];",
    "      ",
    "      // Move up to the parent index",
    "      index = parentIndex;",
    "    } else {",
    "      // Heap property is satisfied",
    "      break;",
    "    }",
    "  }",
    "  ",
    "  return heap;",
    "}",
  ]

  const deleteCode = [
    "function deleteRoot(heap) {",
    "  // If heap is empty, return null",
    "  if (heap.length === 0) return null;",
    "  ",
    "  // Store the root value to return later",
    "  const root = heap[0];",
    "  ",
    "  // Replace root with the last element",
    "  heap[0] = heap[heap.length - 1];",
    "  ",
    "  // Remove the last element",
    "  heap.pop();",
    "  ",
    "  // Perform heapify-down (sink-down)",
    "  let index = 0;",
    "  const length = heap.length;",
    "  ",
    "  while (true) {",
    "    // Calculate indices of left and right children",
    "    const leftChildIdx = 2 * index + 1;",
    "    const rightChildIdx = 2 * index + 2;",
    "    ",
    "    // Initialize largest/smallest as current index",
    "    let targetIdx = index;",
    "    ",
    "    // For max-heap: find the largest among parent and children",
    "    // For min-heap: find the smallest among parent and children",
    "    if (leftChildIdx < length && ",
    "        ((isMaxHeap && heap[leftChildIdx] > heap[targetIdx]) ||",
    "         (!isMaxHeap && heap[leftChildIdx] < heap[targetIdx]))) {",
    "      targetIdx = leftChildIdx;",
    "    }",
    "    ",
    "    if (rightChildIdx < length && ",
    "        ((isMaxHeap && heap[rightChildIdx] > heap[targetIdx]) ||",
    "         (!isMaxHeap && heap[rightChildIdx] < heap[targetIdx]))) {",
    "      targetIdx = rightChildIdx;",
    "    }",
    "    ",
    "    // If target index is still the current index, we're done",
    "    if (targetIdx === index) break;",
    "    ",
    "    // Swap with the target child",
    "    [heap[index], heap[targetIdx]] = [heap[targetIdx], heap[index]];",
    "    ",
    "    // Move down to the target index",
    "    index = targetIdx;",
    "  }",
    "  ",
    "  return root;",
    "}",
  ]

  const peekCode = [
    "function peek(heap) {",
    "  // If heap is empty, return null",
    "  if (heap.length === 0) return null;",
    "  ",
    "  // Return the root element without removing it",
    "  return heap[0];",
    "}",
  ]

  const heapifyCode = [
    "function buildHeap(array) {",
    "  // Create a copy of the input array",
    "  const heap = [...array];",
    "  const length = heap.length;",
    "  ",
    "  // Start from the last non-leaf node and heapify down",
    "  // Last non-leaf node is at index Math.floor(length / 2) - 1",
    "  for (let i = Math.floor(length / 2) - 1; i >= 0; i--) {",
    "    heapifyDown(heap, i, length);",
    "  }",
    "  ",
    "  return heap;",
    "}",
    "",
    "function heapifyDown(heap, index, length) {",
    "  let targetIdx = index;",
    "  const leftChildIdx = 2 * index + 1;",
    "  const rightChildIdx = 2 * index + 2;",
    "  ",
    "  // For max-heap: find the largest among parent and children",
    "  // For min-heap: find the smallest among parent and children",
    "  if (leftChildIdx < length && ",
    "      ((isMaxHeap && heap[leftChildIdx] > heap[targetIdx]) ||",
    "       (!isMaxHeap && heap[leftChildIdx] < heap[targetIdx]))) {",
    "    targetIdx = leftChildIdx;",
    "  }",
    "  ",
    "  if (rightChildIdx < length && ",
    "      ((isMaxHeap && heap[rightChildIdx] > heap[targetIdx]) ||",
    "       (!isMaxHeap && heap[rightChildIdx] < heap[targetIdx]))) {",
    "    targetIdx = rightChildIdx;",
    "  }",
    "  ",
    "  // If target index is not the current index, swap and continue",
    "  if (targetIdx !== index) {",
    "    [heap[index], heap[targetIdx]] = [heap[targetIdx], heap[index]];",
    "    heapifyDown(heap, targetIdx, length);",
    "  }",
    "}",
  ]

  const heapSortCode = [
    "function heapSort(array) {",
    "  // Build a heap from the array",
    "  const heap = buildHeap(array);",
    "  const result = [];",
    "  const length = heap.length;",
    "  ",
    "  // Extract elements one by one",
    "  for (let i = length - 1; i > 0; i--) {",
    "    // Move current root to the end",
    "    [heap[0], heap[i]] = [heap[i], heap[0]];",
    "    ",
    "    // Add the extracted element to result",
    "    result.unshift(heap[i]);",
    "    ",
    "    // Call heapify on the reduced heap",
    "    heapifyDown(heap, 0, i);",
    "  }",
    "  ",
    "  // Add the last element",
    "  result.unshift(heap[0]);",
    "  ",
    "  return result;",
    "}",
  ]

  // Initialize canvas and draw heap
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    const container = canvasContainerRef.current
    if (container) {
      canvas.width = container.clientWidth
      canvas.height = container.clientHeight
    }

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw heap
    drawHeap(ctx, canvas.width, canvas.height)
  }, [heap, sortedIndices])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      const container = canvasContainerRef.current
      if (!canvas || !container) return

      canvas.width = container.clientWidth
      canvas.height = container.clientHeight

      // Redraw heap
      const ctx = canvas.getContext("2d")
      if (ctx) {
        drawHeap(ctx, canvas.width, canvas.height)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [heap, sortedIndices])

  // Draw heap on canvas
  const drawHeap = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (heap.length === 0) return

    // Calculate positions for each node only if needed
    if (!heap[0].x || !heap[0].y) {
      calculateHeapPositions(width, height)
      return // Return and wait for the next render after positions are updated
    }

    // Draw connections between nodes
    for (let i = 0; i < heap.length; i++) {
      const node = heap[i]
      if (!node.x || !node.y) continue

      // Draw connections to children
      const leftChildIdx = 2 * i + 1
      const rightChildIdx = 2 * i + 2

      if (leftChildIdx < heap.length) {
        const leftChild = heap[leftChildIdx]
        if (leftChild.x && leftChild.y) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(leftChild.x, leftChild.y)
          ctx.strokeStyle = "#64748b" // slate-500
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }

      if (rightChildIdx < heap.length) {
        const rightChild = heap[rightChildIdx]
        if (rightChild.x && rightChild.y) {
          ctx.beginPath()
          ctx.moveTo(node.x, node.y)
          ctx.lineTo(rightChild.x, rightChild.y)
          ctx.strokeStyle = "#64748b" // slate-500
          ctx.lineWidth = 1.5
          ctx.stroke()
        }
      }
    }

    // Draw nodes
    for (let i = 0; i < heap.length; i++) {
      const node = heap[i]
      if (!node.x || !node.y) continue

      // Set node color based on state
      switch (node.state) {
        case "highlighted":
          ctx.fillStyle = "#fef3c7" // yellow-100
          ctx.strokeStyle = "#f59e0b" // amber-500
          break
        case "swapping":
          ctx.fillStyle = "#fee2e2" // red-100
          ctx.strokeStyle = "#ef4444" // red-500
          break
        case "comparing":
          ctx.fillStyle = "#dbeafe" // blue-100
          ctx.strokeStyle = "#3b82f6" // blue-500
          break
        case "sorted":
          ctx.fillStyle = "#dcfce7" // green-100
          ctx.strokeStyle = "#22c55e" // green-500
          break
        case "current":
          ctx.fillStyle = "#f3e8ff" // purple-100
          ctx.strokeStyle = "#a855f7" // purple-500
          break
        default:
          ctx.fillStyle = sortedIndices.includes(i) ? "#dcfce7" : "#f1f5f9" // green-100 if sorted, slate-100 otherwise
          ctx.strokeStyle = sortedIndices.includes(i) ? "#22c55e" : "#64748b" // green-500 if sorted, slate-500 otherwise
      }

      // Draw node circle
      ctx.beginPath()
      ctx.arc(node.x, node.y, 25, 0, 2 * Math.PI)
      ctx.fill()
      ctx.lineWidth = 2
      ctx.stroke()

      // Draw node value
      ctx.fillStyle = "#334155" // slate-700
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.value.toString(), node.x, node.y)

      // Draw index below the node
      ctx.font = "12px Arial"
      ctx.fillText(`[${i}]`, node.x, node.y + 35)
    }
  }

  // Calculate positions for heap nodes
  const calculateHeapPositions = (width: number, height: number) => {
    if (heap.length === 0) return

    const levelHeight = 80 // Vertical distance between levels
    const rootY = 50 // Y position of the root

    // Create a new copy of the heap with updated positions
    const updatedHeap = [...heap]

    for (let i = 0; i < updatedHeap.length; i++) {
      const level = Math.floor(Math.log2(i + 1)) // Level in the tree (0-based)
      const position = i - (Math.pow(2, level) - 1) // Position within the level (0-based)
      const totalNodesInLevel = Math.pow(2, level) // Total nodes in this level
      const levelWidth = width * 0.8 // Use 80% of the canvas width
      const horizontalSpacing = levelWidth / totalNodesInLevel
      const x = width * 0.1 + position * horizontalSpacing + horizontalSpacing / 2 // 10% margin on each side
      const y = rootY + level * levelHeight

      // Update node position
      updatedHeap[i] = { ...updatedHeap[i], x, y }
    }

    // Update the heap state once with all position changes
    setHeap(updatedHeap)
  }

  // Heap operations
  const insertNode = async (value: number) => {
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Please enter a valid number",
        variant: "destructive",
      })
      return
    }

    setOperation("insert")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // Add the new element to the end of the heap
    setHighlightedLine(2)
    const newNode: HeapNode = { value, index: heap.length, state: "highlighted" }

    // Update the heap with the new node
    setHeap((prevHeap) => [...prevHeap, newNode])
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // Get the index of the newly added element
    setHighlightedLine(5)
    const newIndex = heap.length // This will be the index after the state update
    await new Promise((resolve) => setTimeout(resolve, animationSpeed * 2)) // Give more time for state to update

    // Perform heapify-up (bubble-up)
    setHighlightedLine(8)
    if (newIndex > 0) {
      // Only heapify if we have more than one element
      await heapifyUp(newIndex)
    }

    setHighlightedLine(26)
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // Reset states
    setHeap((prevHeap) => prevHeap.map((node) => ({ ...node, state: "default" })))
    setOperation(null)
    setHighlightedLine(null)
    setInputValue("")
    setMessage(`Inserted ${value} into the ${isMaxHeap ? "max" : "min"} heap`)
  }

  const heapifyUp = async (index: number) => {
    // Get the current heap state to work with
    const currentHeap = [...heap]
    if (currentHeap.length <= 1) return

    // Use the last index if index is out of bounds
    let currentIndex = index >= currentHeap.length ? currentHeap.length - 1 : index

    while (currentIndex > 0) {
      // Calculate parent index
      setHighlightedLine(10)
      const parentIndex = Math.floor((currentIndex - 1) / 2)
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      // Safety check for array bounds
      if (
        parentIndex < 0 ||
        parentIndex >= currentHeap.length ||
        currentIndex < 0 ||
        currentIndex >= currentHeap.length
      ) {
        break
      }

      // Highlight parent and current node
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        if (newHeap[currentIndex]) newHeap[currentIndex].state = "comparing"
        if (newHeap[parentIndex]) newHeap[parentIndex].state = "comparing"
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      // For max-heap: if parent is smaller than child, swap
      // For min-heap: if parent is larger than child, swap
      setHighlightedLine(14)
      const shouldSwap = isMaxHeap
        ? currentHeap[parentIndex]?.value < currentHeap[currentIndex]?.value
        : currentHeap[parentIndex]?.value > currentHeap[currentIndex]?.value
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      if (shouldSwap) {
        // Swap parent and child
        setHighlightedLine(16)
        setHeap((prevHeap) => {
          const newHeap = [...prevHeap]
          if (newHeap[currentIndex]) newHeap[currentIndex].state = "swapping"
          if (newHeap[parentIndex]) newHeap[parentIndex].state = "swapping"
          return newHeap
        })
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))

        setHeap((prevHeap) => {
          const newHeap = [...prevHeap]
          if (!newHeap[parentIndex] || !newHeap[currentIndex]) return newHeap

          const temp = { ...newHeap[parentIndex] }
          newHeap[parentIndex] = { ...newHeap[currentIndex], index: parentIndex }
          newHeap[currentIndex] = { ...temp, index: currentIndex }

          // Update our working copy too
          currentHeap[parentIndex] = { ...currentHeap[currentIndex], index: parentIndex }
          currentHeap[currentIndex] = { ...temp, index: currentIndex }

          return newHeap
        })
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))

        // Move up to the parent index
        setHighlightedLine(19)
        currentIndex = parentIndex
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))
      } else {
        // Heap property is satisfied
        setHighlightedLine(21)
        setHeap((prevHeap) => {
          const newHeap = [...prevHeap]
          if (newHeap[currentIndex]) newHeap[currentIndex].state = "default"
          if (newHeap[parentIndex]) newHeap[parentIndex].state = "default"
          return newHeap
        })
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))
        break
      }

      // Reset states for this iteration
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        for (let i = 0; i < newHeap.length; i++) {
          if (i !== currentIndex) newHeap[i].state = "default"
        }
        return newHeap
      })
    }
  }

  const deleteRoot = async () => {
    if (heap.length === 0) {
      toast({
        title: "Error",
        description: "Heap is empty",
        variant: "destructive",
      })
      return
    }

    setOperation("delete")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // If heap is empty, return null
    setHighlightedLine(2)
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // Store the root value to return later
    setHighlightedLine(5)
    const rootValue = heap[0].value
    setHeap((prevHeap) => {
      const newHeap = [...prevHeap]
      newHeap[0].state = "highlighted"
      return newHeap
    })
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // Replace root with the last element
    setHighlightedLine(8)
    if (heap.length > 1) {
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        newHeap[prevHeap.length - 1].state = "swapping"
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        const lastNode = { ...newHeap[newHeap.length - 1], index: 0, state: "swapping" }
        newHeap[0] = lastNode
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))
    }

    // Remove the last element
    setHighlightedLine(11)
    setHeap((prevHeap) => {
      const newHeap = [...prevHeap]
      return newHeap.slice(0, -1)
    })
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // Perform heapify-down (sink-down)
    setHighlightedLine(14)
    await heapifyDown(0, heap.length - 1)

    // Reset states
    setHeap((prevHeap) => prevHeap.map((node) => ({ ...node, state: "default" })))
    setOperation(null)
    setHighlightedLine(null)
    setMessage(`Deleted root value ${rootValue} from the ${isMaxHeap ? "max" : "min"} heap`)
  }

  const heapifyDown = async (index: number, length: number) => {
    if (heap.length <= 1) return

    setHighlightedLine(16)
    let currentIndex = index
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    while (true) {
      // Calculate indices of left and right children
      setHighlightedLine(19)
      const leftChildIdx = 2 * currentIndex + 1
      const rightChildIdx = 2 * currentIndex + 2
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      // Initialize largest/smallest as current index
      setHighlightedLine(22)
      let targetIdx = currentIndex
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      // Highlight current node
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        if (newHeap[currentIndex]) newHeap[currentIndex].state = "current"
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      // For max-heap: find the largest among parent and children
      // For min-heap: find the smallest among parent and children
      setHighlightedLine(25)
      if (
        leftChildIdx < heap.length &&
        ((isMaxHeap && heap[leftChildIdx].value > heap[targetIdx].value) ||
          (!isMaxHeap && heap[leftChildIdx].value < heap[targetIdx].value))
      ) {
        // Highlight left child
        setHeap((prevHeap) => {
          const newHeap = [...prevHeap]
          if (newHeap[leftChildIdx]) newHeap[leftChildIdx].state = "comparing"
          return newHeap
        })
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))

        targetIdx = leftChildIdx
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))
      }

      setHighlightedLine(30)
      if (
        rightChildIdx < heap.length &&
        ((isMaxHeap && heap[rightChildIdx].value > heap[targetIdx].value) ||
          (!isMaxHeap && heap[rightChildIdx].value < heap[targetIdx].value))
      ) {
        // Highlight right child
        setHeap((prevHeap) => {
          const newHeap = [...prevHeap]
          if (newHeap[rightChildIdx]) newHeap[rightChildIdx].state = "comparing"
          return newHeap
        })
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))

        targetIdx = rightChildIdx
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))
      }

      // If target index is still the current index, we're done
      setHighlightedLine(35)
      if (targetIdx === currentIndex) {
        setHeap((prevHeap) => {
          const newHeap = [...prevHeap]
          for (let i = 0; i < newHeap.length; i++) {
            newHeap[i].state = "default"
          }
          return newHeap
        })
        await new Promise((resolve) => setTimeout(resolve, animationSpeed))
        break
      }

      // Swap with the target child
      setHighlightedLine(38)
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        if (newHeap[currentIndex]) newHeap[currentIndex].state = "swapping"
        if (newHeap[targetIdx]) newHeap[targetIdx].state = "swapping"
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        const temp = { ...newHeap[currentIndex] }
        newHeap[currentIndex] = { ...newHeap[targetIdx], index: currentIndex }
        newHeap[targetIdx] = { ...temp, index: targetIdx }
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      // Move down to the target index
      setHighlightedLine(41)
      currentIndex = targetIdx
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      // Reset states for this iteration
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        for (let i = 0; i < newHeap.length; i++) {
          if (i !== currentIndex) newHeap[i].state = "default"
        }
        return newHeap
      })
    }
  }

  const peekRoot = async () => {
    if (heap.length === 0) {
      toast({
        title: "Error",
        description: "Heap is empty",
        variant: "destructive",
      })
      return
    }

    setOperation("peek")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // If heap is empty, return null
    setHighlightedLine(2)
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // Return the root element without removing it
    setHighlightedLine(5)
    setHeap((prevHeap) => {
      const newHeap = [...prevHeap]
      newHeap[0].state = "highlighted"
      return newHeap
    })
    await new Promise((resolve) => setTimeout(resolve, animationSpeed * 2))

    // Reset states
    setHeap((prevHeap) => prevHeap.map((node) => ({ ...node, state: "default" })))
    setOperation(null)
    setHighlightedLine(null)
    setMessage(`Peek: Root value is ${heap[0].value}`)
  }

  const buildHeap = async (array: number[]) => {
    if (array.length === 0) {
      toast({
        title: "Error",
        description: "Array is empty",
        variant: "destructive",
      })
      return
    }

    setOperation("heapify")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // Create a copy of the input array
    setHighlightedLine(2)
    const heapArray: HeapNode[] = array.map((value, index) => ({
      value,
      index,
      state: "default",
    }))
    setHeap(heapArray)
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // Start from the last non-leaf node and heapify down
    setHighlightedLine(6)
    const length = heapArray.length
    for (let i = Math.floor(length / 2) - 1; i >= 0; i--) {
      setHighlightedLine(7)
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        if (newHeap[i]) newHeap[i].state = "current"
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      await heapifyDownRecursive(i, length)

      // Reset states for this iteration
      setHeap((prevHeap) => prevHeap.map((node) => ({ ...node, state: "default" })))
    }

    setHighlightedLine(10)
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // Reset states
    setHeap((prevHeap) => prevHeap.map((node) => ({ ...node, state: "default" })))
    setOperation(null)
    setHighlightedLine(null)
    setSortedIndices([])
    setMessage(`Built a ${isMaxHeap ? "max" : "min"} heap from the array`)
  }

  const heapifyDownRecursive = async (index: number, length: number) => {
    setHighlightedLine(14)
    let targetIdx = index
    const leftChildIdx = 2 * index + 1
    const rightChildIdx = 2 * index + 2
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // For max-heap: find the largest among parent and children
    // For min-heap: find the smallest among parent and children
    setHighlightedLine(19)
    if (
      leftChildIdx < length &&
      ((isMaxHeap && heap[leftChildIdx].value > heap[targetIdx].value) ||
        (!isMaxHeap && heap[leftChildIdx].value < heap[targetIdx].value))
    ) {
      // Highlight left child
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        if (newHeap[leftChildIdx]) newHeap[leftChildIdx].state = "comparing"
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      targetIdx = leftChildIdx
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))
    }

    setHighlightedLine(24)
    if (
      rightChildIdx < length &&
      ((isMaxHeap && heap[rightChildIdx].value > heap[targetIdx].value) ||
        (!isMaxHeap && heap[rightChildIdx].value < heap[targetIdx].value))
    ) {
      // Highlight right child
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        if (newHeap[rightChildIdx]) newHeap[rightChildIdx].state = "comparing"
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      targetIdx = rightChildIdx
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))
    }

    // If target index is not the current index, swap and continue
    setHighlightedLine(29)
    if (targetIdx !== index) {
      // Swap elements
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        if (newHeap[index]) newHeap[index].state = "swapping"
        if (newHeap[targetIdx]) newHeap[targetIdx].state = "swapping"
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        const temp = { ...newHeap[index] }
        newHeap[index] = { ...newHeap[targetIdx], index }
        newHeap[targetIdx] = { ...temp, index: targetIdx }
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      // Reset states for this swap
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        if (newHeap[index]) newHeap[index].state = "default"
        if (newHeap[targetIdx]) newHeap[targetIdx].state = "current"
        return newHeap
      })

      // Recursively heapify the affected subtree
      setHighlightedLine(31)
      await heapifyDownRecursive(targetIdx, length)
    }
  }

  const heapSort = async () => {
    if (heap.length === 0) {
      toast({
        title: "Error",
        description: "Heap is empty",
        variant: "destructive",
      })
      return
    }

    setOperation("sort")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    // Build a heap from the array (already done)
    setHighlightedLine(2)
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    const result: number[] = []
    const length = heap.length
    setSortedIndices([])

    // Extract elements one by one
    setHighlightedLine(6)
    for (let i = length - 1; i > 0; i--) {
      // Move current root to the end
      setHighlightedLine(8)

      // Mark nodes for swapping
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        newHeap[0].state = "swapping"
        newHeap[i].state = "swapping"
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      // Perform the swap
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        const temp = { ...newHeap[0] }
        newHeap[0] = { ...newHeap[i], index: 0 }
        newHeap[i] = { ...temp, index: i, state: "sorted" }
        return newHeap
      })
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      // Add the extracted element to result
      setHighlightedLine(11)
      result.unshift(heap[i].value)
      setSortedIndices((prev) => [...prev, i])
      await new Promise((resolve) => setTimeout(resolve, animationSpeed))

      // Call heapify on the reduced heap
      setHighlightedLine(14)
      await heapifyDown(0, i)

      // Reset states for this iteration
      setHeap((prevHeap) => {
        const newHeap = [...prevHeap]
        for (let j = 0; j < i; j++) {
          newHeap[j].state = "default"
        }
        return newHeap
      })
    }

    // Add the last element
    setHighlightedLine(17)
    result.unshift(heap[0].value)
    setSortedIndices((prev) => [...prev, 0])
    setHeap((prevHeap) => {
      const newHeap = [...prevHeap]
      newHeap[0].state = "sorted"
      return newHeap
    })
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    setHighlightedLine(20)
    await new Promise((resolve) => setTimeout(resolve, animationSpeed))

    setOperation(null)
    setHighlightedLine(null)
    setMessage(`Heap sort result: ${result.join(", ")}`)
  }

  // Parse input array
  const parseInputArray = (input: string): number[] => {
    try {
      return input
        .split(",")
        .map((val) => val.trim())
        .filter((val) => val !== "")
        .map((val) => {
          const num = Number.parseInt(val, 10)
          if (isNaN(num)) {
            throw new Error(`Invalid number: ${val}`)
          }
          return num
        })
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Please enter valid comma-separated numbers",
        variant: "destructive",
      })
      return []
    }
  }

  // Generate a random heap
  const generateRandomHeap = () => {
    const size = Math.floor(Math.random() * 7) + 5 // Random size between 5 and 11
    const values = Array.from({ length: size }, () => Math.floor(Math.random() * 100))
    buildHeap(values)
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <Switch
            id="heapType"
            checked={isMaxHeap}
            onCheckedChange={(checked) => {
              setIsMaxHeap(checked)
              // Rebuild the heap if we have elements
              if (heap.length > 0) {
                const values = heap.map((node) => node.value)
                buildHeap(values)
              }
            }}
          />
          <Label htmlFor="heapType">{isMaxHeap ? "Max Heap" : "Min Heap"}</Label>
        </div>
        <Button onClick={generateRandomHeap} variant="outline">
          Generate Random Heap
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Heap Operations</h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full"
                onKeyDown={(e) => {
                  if (e.key === "Enter" && !operation) {
                    const value = Number.parseInt(inputValue.trim())
                    if (!isNaN(value)) {
                      insertNode(value)
                    }
                  }
                }}
              />
              <Button
                onClick={() => {
                  const value = Number.parseInt(inputValue.trim())
                  if (!isNaN(value)) {
                    insertNode(value)
                  } else {
                    toast({
                      title: "Error",
                      description: "Please enter a valid number",
                      variant: "destructive",
                    })
                  }
                }}
                disabled={operation !== null}
              >
                Insert
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => deleteRoot()} disabled={operation !== null || heap.length === 0}>
                Delete Root
              </Button>
              <Button onClick={() => peekRoot()} disabled={operation !== null || heap.length === 0}>
                Peek Root
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter comma-separated values"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={() => {
                  const values = parseInputArray(inputValue)
                  if (values.length > 0) {
                    buildHeap(values)
                    setInputValue("")
                  }
                }}
                disabled={operation !== null}
              >
                Build Heap
              </Button>
            </div>
            <div className="flex gap-2">
              <Button onClick={() => heapSort()} disabled={operation !== null || heap.length === 0}>
                Heap Sort
              </Button>
            </div>
          </div>

          {message && <div className="p-2 bg-muted rounded-md text-sm">{message}</div>}

          <div className="mt-4">
            <h3 className="font-medium mb-2">Array Representation:</h3>
            <div className="flex flex-wrap gap-2 p-2 bg-muted rounded-md">
              {heap.map((node, index) => (
                <div
                  key={index}
                  className={`flex flex-col items-center justify-center w-12 h-12 border rounded-md ${
                    node.state === "highlighted"
                      ? "bg-yellow-100 border-amber-500"
                      : node.state === "swapping"
                        ? "bg-red-100 border-red-500"
                        : node.state === "comparing"
                          ? "bg-blue-100 border-blue-500"
                          : node.state === "sorted"
                            ? "bg-green-100 border-green-500"
                            : node.state === "current"
                              ? "bg-purple-100 border-purple-500"
                              : sortedIndices.includes(index)
                                ? "bg-green-100 border-green-500"
                                : "bg-slate-100 border-slate-500"
                  }`}
                >
                  <span className="text-sm font-medium">{node.value}</span>
                  <span className="text-xs text-gray-500">[{index}]</span>
                </div>
              ))}
              {heap.length === 0 && <div className="text-muted-foreground italic">Empty heap</div>}
            </div>
          </div>

          <div className="mt-4">
            <h3 className="font-medium mb-2">Color Legend:</h3>
            <div className="flex flex-wrap gap-4">
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-slate-100 border border-slate-500 rounded-sm"></div>
                <span className="text-sm">Default</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-yellow-100 border border-amber-500 rounded-sm"></div>
                <span className="text-sm">Highlighted</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-red-100 border border-red-500 rounded-sm"></div>
                <span className="text-sm">Swapping</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded-sm"></div>
                <span className="text-sm">Comparing</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-green-100 border border-green-500 rounded-sm"></div>
                <span className="text-sm">Sorted</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-purple-100 border border-purple-500 rounded-sm"></div>
                <span className="text-sm">Current</span>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {operation === "insert"
                ? "Insert Operation"
                : operation === "delete"
                  ? "Delete Operation"
                  : operation === "peek"
                    ? "Peek Operation"
                    : operation === "heapify"
                      ? "Heapify Operation"
                      : operation === "sort"
                        ? "Heap Sort Operation"
                        : "Heap Operations"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-auto h-64 font-mono text-sm">
              {(operation === "insert"
                ? insertCode
                : operation === "delete"
                  ? deleteCode
                  : operation === "peek"
                    ? peekCode
                    : operation === "heapify"
                      ? heapifyCode
                      : operation === "sort"
                        ? heapSortCode
                        : insertCode
              ).map((line, index) => (
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

      <div ref={canvasContainerRef} className="border rounded-md bg-white h-[400px] overflow-hidden relative">
        <canvas ref={canvasRef} className="w-full h-full" />
        {heap.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Heap is empty. Add elements to visualize.
          </div>
        ) : null}
      </div>
    </div>
  )
}
