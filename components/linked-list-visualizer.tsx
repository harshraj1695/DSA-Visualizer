"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { toast } from "@/components/ui/use-toast"

// Linked List Node Type
type ListNode = {
  value: number
  id: number
  state?: "default" | "highlighted" | "inserted" | "found" | "deleted" | "current"
}

// Update the component props interface or add it if it doesn't exist
interface LinkedListVisualizerProps {
  isDoublyLinked?: boolean
}

// Update the component definition to use the prop
export default function LinkedListVisualizer({ isDoublyLinked = false }: LinkedListVisualizerProps) {
  const [linkedList, setLinkedList] = useState<ListNode[]>([])
  const [inputValue, setInputValue] = useState("")
  const [positionValue, setPositionValue] = useState("")
  const [keyValue, setKeyValue] = useState("")
  const [operation, setOperation] = useState<
    | "insertBeginning"
    | "insertEnd"
    | "insertPosition"
    | "insertAfterKey"
    | "deleteBeginning"
    | "deleteEnd"
    | "deletePosition"
    | "deleteKey"
    | "traverse"
    | "search"
    | null
  >(null)
  const [nextId, setNextId] = useState(0)
  const [message, setMessage] = useState("")
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)
  const [animatingNode, setAnimatingNode] = useState<ListNode | null>(null)
  const [animationPosition, setAnimationPosition] = useState<number | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Code snippets for different operations
  const insertBeginningCode = [
    "function insertAtBeginning(head, value) {",
    "  // Create a new node",
    "  const newNode = { value, next: null };",
    "",
    "  // Make the new node point to the current head",
    "  newNode.next = head;",
    "",
    "  // Update the head to be the new node",
    "  head = newNode;",
    "",
    "  return head;",
    "}",
  ]

  const insertEndCode = [
    "function insertAtEnd(head, value) {",
    "  // Create a new node",
    "  const newNode = { value, next: null };",
    "",
    "  // If the list is empty, make the new node the head",
    "  if (head === null) {",
    "    return newNode;",
    "  }",
    "",
    "  // Traverse to the end of the list",
    "  let current = head;",
    "  while (current.next !== null) {",
    "    current = current.next;",
    "  }",
    "",
    "  // Make the last node point to the new node",
    "  current.next = newNode;",
    "",
    "  return head;",
    "}",
  ]

  const insertPositionCode = [
    "function insertAtPosition(head, value, position) {",
    "  // Create a new node",
    "  const newNode = { value, next: null };",
    "",
    "  // If position is 0, insert at beginning",
    "  if (position === 0) {",
    "    newNode.next = head;",
    "    return newNode;",
    "  }",
    "",
    "  // Traverse to the node before the position",
    "  let current = head;",
    "  let count = 0;",
    "  while (current !== null && count < position - 1) {",
    "    current = current.next;",
    "    count++;",
    "  }",
    "",
    "  // If position is beyond the length, insert at end",
    "  if (current === null) {",
    "    return insertAtEnd(head, value);",
    "  }",
    "",
    "  // Insert the new node at the position",
    "  newNode.next = current.next;",
    "  current.next = newNode;",
    "",
    "  return head;",
    "}",
  ]

  const insertAfterKeyCode = [
    "function insertAfterKey(head, value, key) {",
    "  // Create a new node",
    "  const newNode = { value, next: null };",
    "",
    "  // If the list is empty, return the new node",
    "  if (head === null) {",
    "    return newNode;",
    "  }",
    "",
    "  // Find the node with the key value",
    "  let current = head;",
    "  while (current !== null && current.value !== key) {",
    "    current = current.next;",
    "  }",
    "",
    "  // If key not found, insert at end",
    "  if (current === null) {",
    "    return insertAtEnd(head, value);",
    "  }",
    "",
    "  // Insert the new node after the key node",
    "  newNode.next = current.next;",
    "  current.next = newNode;",
    "",
    "  return head;",
    "}",
  ]

  const deleteBeginningCode = [
    "function deleteFromBeginning(head) {",
    "  // If the list is empty, return null",
    "  if (head === null) {",
    "    return null;",
    "  }",
    "",
    "  // Move the head to the next node",
    "  head = head.next;",
    "",
    "  return head;",
    "}",
  ]

  const deleteEndCode = [
    "function deleteFromEnd(head) {",
    "  // If the list is empty, return null",
    "  if (head === null) {",
    "    return null;",
    "  }",
    "",
    "  // If there's only one node, return null",
    "  if (head.next === null) {",
    "    return null;",
    "  }",
    "",
    "  // Traverse to the second last node",
    "  let current = head;",
    "  while (current.next.next !== null) {",
    "    current = current.next;",
    "  }",
    "",
    "  // Make the second last node point to null",
    "  current.next = null;",
    "",
    "  return head;",
    "}",
  ]

  const deletePositionCode = [
    "function deleteFromPosition(head, position) {",
    "  // If the list is empty, return null",
    "  if (head === null) {",
    "    return null;",
    "  }",
    "",
    "  // If position is 0, delete from beginning",
    "  if (position === 0) {",
    "    return head.next;",
    "  }",
    "",
    "  // Traverse to the node before the position",
    "  let current = head;",
    "  let count = 0;",
    "  while (current !== null && count < position - 1) {",
    "    current = current.next;",
    "    count++;",
    "  }",
    "",
    "  // If position is beyond the length or next node is null",
    "  if (current === null || current.next === null) {",
    "    return head;",
    "  }",
    "",
    "  // Delete the node at the position",
    "  current.next = current.next.next;",
    "",
    "  return head;",
    "}",
  ]

  const deleteKeyCode = [
    "function deleteByKey(head, key) {",
    "  // If the list is empty, return null",
    "  if (head === null) {",
    "    return null;",
    "  }",
    "",
    "  // If the head node has the key, delete it",
    "  if (head.value === key) {",
    "    return head.next;",
    "  }",
    "",
    "  // Find the node before the one with the key",
    "  let current = head;",
    "  while (current.next !== null && current.next.value !== key) {",
    "    current = current.next;",
    "  }",
    "",
    "  // If key not found, return the original list",
    "  if (current.next === null) {",
    "    return head;",
    "  }",
    "",
    "  // Delete the node with the key",
    "  current.next = current.next.next;",
    "",
    "  return head;",
    "}",
  ]

  const traverseCode = [
    "function traverse(head) {",
    "  // Initialize an array to store values",
    "  const values = [];",
    "",
    "  // Traverse the list and collect values",
    "  let current = head;",
    "  while (current !== null) {",
    "    values.push(current.value);",
    "    current = current.next;",
    "  }",
    "",
    "  return values;",
    "}",
  ]

  const searchCode = [
    "function search(head, key) {",
    "  // Traverse the list to find the key",
    "  let current = head;",
    "  while (current !== null) {",
    "    if (current.value === key) {",
    "      return true; // Key found",
    "    }",
    "    current = current.next;",
    "  }",
    "",
    "  return false; // Key not found",
    "}",
  ]

  // Draw linked list on canvas
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    const ctx = canvas.getContext("2d")
    if (!ctx) return

    // Set canvas size
    canvas.width = canvas.clientWidth
    canvas.height = canvas.clientHeight

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height)

    // Draw linked list
    drawLinkedList(ctx, canvas.width, canvas.height)
  }, [linkedList, animatingNode, animationPosition, isDoublyLinked])

  const drawLinkedList = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    if (linkedList.length === 0) return

    const nodeRadius = 25
    const nodeSpacing = 100
    const startX = 50
    const startY = height / 2

    // Draw nodes and arrows
    linkedList.forEach((node, index) => {
      const x = startX + index * nodeSpacing
      const y = startY

      // Draw arrow to next node
      if (index < linkedList.length - 1) {
        const nextX = startX + (index + 1) * nodeSpacing
        drawArrow(ctx, x + nodeRadius, y, nextX - nodeRadius, y)
      } else {
        // Draw null pointer for the last node
        drawArrow(ctx, x + nodeRadius, y, x + nodeRadius + 40, y)
        ctx.font = "14px Arial"
        ctx.fillStyle = "#64748b"
        ctx.fillText("null", x + nodeRadius + 45, y + 5)
      }

      // Draw node
      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI)

      // Set node color based on state
      switch (node.state) {
        case "highlighted":
          ctx.fillStyle = "#fef3c7" // yellow-100
          ctx.strokeStyle = "#f59e0b" // amber-500
          break
        case "inserted":
          ctx.fillStyle = "#dcfce7" // green-100
          ctx.strokeStyle = "#22c55e" // green-500
          break
        case "found":
          ctx.fillStyle = "#dbeafe" // blue-100
          ctx.strokeStyle = "#3b82f6" // blue-500
          break
        case "deleted":
          ctx.fillStyle = "#fee2e2" // red-100
          ctx.strokeStyle = "#ef4444" // red-500
          break
        case "current":
          ctx.fillStyle = "#f3e8ff" // purple-100
          ctx.strokeStyle = "#a855f7" // purple-500
          break
        default:
          ctx.fillStyle = "#f1f5f9" // slate-100
          ctx.strokeStyle = "#64748b" // slate-500
      }

      ctx.fill()
      ctx.stroke()

      // Draw node value
      ctx.fillStyle = "#334155" // slate-700
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(node.value.toString(), x, y)

      // Render backward pointers or indicate bidirectional connections
      if (isDoublyLinked && index > 0) {
        const prevX = startX + (index - 1) * nodeSpacing
        drawArrow(ctx, x - nodeRadius, y, prevX + nodeRadius, y)
      }
    })

    // Draw animating node if exists
    if (animatingNode && animationPosition !== null) {
      const x = startX + animationPosition * nodeSpacing
      const y = startY - 60 // Position above the list

      ctx.beginPath()
      ctx.arc(x, y, nodeRadius, 0, 2 * Math.PI)
      ctx.fillStyle = "#dcfce7" // green-100
      ctx.strokeStyle = "#22c55e" // green-500
      ctx.fill()
      ctx.stroke()

      // Draw node value
      ctx.fillStyle = "#334155" // slate-700
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(animatingNode.value.toString(), x, y)

      // Draw arrow pointing to insertion position
      ctx.beginPath()
      ctx.moveTo(x, y + nodeRadius)
      ctx.lineTo(x, startY - nodeRadius)
      ctx.strokeStyle = "#22c55e" // green-500
      ctx.stroke()
    }
  }

  const drawArrow = (ctx: CanvasRenderingContext2D, fromX: number, fromY: number, toX: number, toY: number) => {
    const headLength = 10
    const angle = Math.atan2(toY - fromY, toX - fromX)

    ctx.beginPath()
    ctx.moveTo(fromX, fromY)
    ctx.lineTo(toX, toY)
    ctx.lineTo(toX - headLength * Math.cos(angle - Math.PI / 6), toY - headLength * Math.sin(angle - Math.PI / 6))
    ctx.moveTo(toX, toY)
    ctx.lineTo(toX - headLength * Math.cos(angle + Math.PI / 6), toY - headLength * Math.sin(angle + Math.PI / 6))
    ctx.strokeStyle = "#64748b" // slate-500
    ctx.lineWidth = 1.5
    ctx.stroke()
  }

  // Insertion operations
  const insertAtBeginning = async () => {
    if (inputValue.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a value",
        variant: "destructive",
      })
      return
    }

    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Please enter a valid number",
        variant: "destructive",
      })
      return
    }

    setOperation("insertBeginning")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a new node
    setHighlightedLine(2)
    const newNode: ListNode = { value, id: nextId, state: "inserted" }
    setNextId(nextId + 1)
    setAnimatingNode(newNode)
    setAnimationPosition(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Make the new node point to the current head
    setHighlightedLine(5)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Update the head to be the new node
    setHighlightedLine(8)
    setLinkedList([newNode, ...linkedList.map((node) => ({ ...node, state: "default" }))])
    setAnimatingNode(null)
    setAnimationPosition(null)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setHighlightedLine(10)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOperation(null)
    setHighlightedLine(null)
    setInputValue("")
    setMessage(`Inserted ${value} at the beginning`)
  }

  const insertAtEnd = async () => {
    if (inputValue.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a value",
        variant: "destructive",
      })
      return
    }

    const value = Number.parseInt(inputValue)
    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Please enter a valid number",
        variant: "destructive",
      })
      return
    }

    setOperation("insertEnd")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a new node
    setHighlightedLine(2)
    const newNode: ListNode = { value, id: nextId, state: "inserted" }
    setNextId(nextId + 1)
    setAnimatingNode(newNode)
    setAnimationPosition(linkedList.length)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If the list is empty, make the new node the head
    setHighlightedLine(5)
    if (linkedList.length === 0) {
      setHighlightedLine(6)
      setLinkedList([newNode])
      setAnimatingNode(null)
      setAnimationPosition(null)
      await new Promise((resolve) => setTimeout(resolve, 500))
    } else {
      // Traverse to the end of the list
      setHighlightedLine(10)
      let current = 0
      while (current < linkedList.length) {
        const updatedList = [...linkedList]
        updatedList[current].state = "current"
        setLinkedList(updatedList)
        await new Promise((resolve) => setTimeout(resolve, 300))
        current++
      }

      // Make the last node point to the new node
      setHighlightedLine(15)
      setLinkedList([...linkedList.map((node) => ({ ...node, state: "default" })), newNode])
      setAnimatingNode(null)
      setAnimationPosition(null)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setHighlightedLine(18)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOperation(null)
    setHighlightedLine(null)
    setInputValue("")
    setMessage(`Inserted ${value} at the end`)
  }

  const insertAtPosition = async () => {
    if (inputValue.trim() === "" || positionValue.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter both value and position",
        variant: "destructive",
      })
      return
    }

    const value = Number.parseInt(inputValue)
    const position = Number.parseInt(positionValue)
    if (isNaN(value) || isNaN(position) || position < 0) {
      toast({
        title: "Error",
        description: "Please enter valid numbers",
        variant: "destructive",
      })
      return
    }

    setOperation("insertPosition")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a new node
    setHighlightedLine(2)
    const newNode: ListNode = { value, id: nextId, state: "inserted" }
    setNextId(nextId + 1)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If position is 0, insert at beginning
    setHighlightedLine(5)
    if (position === 0) {
      setHighlightedLine(6)
      setAnimatingNode(newNode)
      setAnimationPosition(0)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setLinkedList([newNode, ...linkedList.map((node) => ({ ...node, state: "default" }))])
      setAnimatingNode(null)
      setAnimationPosition(null)
      await new Promise((resolve) => setTimeout(resolve, 500))
    } else {
      // Traverse to the node before the position
      setHighlightedLine(11)
      let current = 0
      let count = 0
      while (current < linkedList.length && count < position - 1) {
        const updatedList = [...linkedList]
        updatedList[current].state = "current"
        setLinkedList(updatedList)
        await new Promise((resolve) => setTimeout(resolve, 300))
        current++
        count++
      }

      // If position is beyond the length, insert at end
      setHighlightedLine(17)
      if (current >= linkedList.length) {
        setAnimatingNode(newNode)
        setAnimationPosition(linkedList.length)
        await new Promise((resolve) => setTimeout(resolve, 500))

        setLinkedList([...linkedList.map((node) => ({ ...node, state: "default" })), newNode])
        setAnimatingNode(null)
        setAnimationPosition(null)
      } else {
        // Insert the new node at the position
        setHighlightedLine(22)
        setAnimatingNode(newNode)
        setAnimationPosition(current + 1)
        await new Promise((resolve) => setTimeout(resolve, 500))

        const updatedList = [...linkedList]
        updatedList.splice(current + 1, 0, newNode)
        setLinkedList(updatedList.map((node) => ({ ...node, state: "default" })))
        setAnimatingNode(null)
        setAnimationPosition(null)
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setHighlightedLine(26)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOperation(null)
    setHighlightedLine(null)
    setInputValue("")
    setPositionValue("")
    setMessage(`Inserted ${value} at position ${position}`)
  }

  const insertAfterKey = async () => {
    if (inputValue.trim() === "" || keyValue.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter both value and key",
        variant: "destructive",
      })
      return
    }

    const value = Number.parseInt(inputValue)
    const key = Number.parseInt(keyValue)
    if (isNaN(value) || isNaN(key)) {
      toast({
        title: "Error",
        description: "Please enter valid numbers",
        variant: "destructive",
      })
      return
    }

    setOperation("insertAfterKey")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a new node
    setHighlightedLine(2)
    const newNode: ListNode = { value, id: nextId, state: "inserted" }
    setNextId(nextId + 1)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If the list is empty, return the new node
    setHighlightedLine(5)
    if (linkedList.length === 0) {
      setHighlightedLine(6)
      setAnimatingNode(newNode)
      setAnimationPosition(0)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setLinkedList([newNode])
      setAnimatingNode(null)
      setAnimationPosition(null)
      await new Promise((resolve) => setTimeout(resolve, 500))
    } else {
      // Find the node with the key value
      setHighlightedLine(10)
      let current = 0
      let found = false
      while (current < linkedList.length) {
        const updatedList = [...linkedList]
        updatedList[current].state = "highlighted"
        setLinkedList(updatedList)
        await new Promise((resolve) => setTimeout(resolve, 300))

        if (linkedList[current].value === key) {
          found = true
          break
        }

        updatedList[current].state = "default"
        setLinkedList(updatedList)
        current++
      }

      // If key not found, insert at end
      setHighlightedLine(15)
      if (!found) {
        setAnimatingNode(newNode)
        setAnimationPosition(linkedList.length)
        await new Promise((resolve) => setTimeout(resolve, 500))

        setLinkedList([...linkedList.map((node) => ({ ...node, state: "default" })), newNode])
        setAnimatingNode(null)
        setAnimationPosition(null)
      } else {
        // Insert the new node after the key node
        setHighlightedLine(20)
        setAnimatingNode(newNode)
        setAnimationPosition(current + 1)
        await new Promise((resolve) => setTimeout(resolve, 500))

        const updatedList = [...linkedList]
        updatedList.splice(current + 1, 0, newNode)
        setLinkedList(updatedList.map((node) => ({ ...node, state: "default" })))
        setAnimatingNode(null)
        setAnimationPosition(null)
      }
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setHighlightedLine(24)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOperation(null)
    setHighlightedLine(null)
    setInputValue("")
    setKeyValue("")
    setMessage(`Inserted ${value} after key ${key}`)
  }

  // Deletion operations
  const deleteFromBeginning = async () => {
    setOperation("deleteBeginning")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If the list is empty, return null
    setHighlightedLine(2)
    if (linkedList.length === 0) {
      setHighlightedLine(3)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setMessage("List is empty, nothing to delete")
    } else {
      // Move the head to the next node
      setHighlightedLine(6)
      const updatedList = [...linkedList]
      updatedList[0].state = "deleted"
      setLinkedList(updatedList)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setLinkedList(linkedList.slice(1).map((node) => ({ ...node, state: "default" })))
      await new Promise((resolve) => setTimeout(resolve, 500))
      setMessage("Deleted node from the beginning")
    }

    setHighlightedLine(9)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOperation(null)
    setHighlightedLine(null)
  }

  const deleteFromEnd = async () => {
    setOperation("deleteEnd")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If the list is empty, return null
    setHighlightedLine(2)
    if (linkedList.length === 0) {
      setHighlightedLine(3)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setMessage("List is empty, nothing to delete")
    } else {
      // If there's only one node, return null
      setHighlightedLine(6)
      if (linkedList.length === 1) {
        setHighlightedLine(7)
        const updatedList = [...linkedList]
        updatedList[0].state = "deleted"
        setLinkedList(updatedList)
        await new Promise((resolve) => setTimeout(resolve, 500))

        setLinkedList([])
        await new Promise((resolve) => setTimeout(resolve, 500))
        setMessage("Deleted the only node in the list")
      } else {
        // Traverse to the second last node
        setHighlightedLine(11)
        let current = 0
        while (current < linkedList.length - 2) {
          const updatedList = [...linkedList]
          updatedList[current].state = "current"
          setLinkedList(updatedList)
          await new Promise((resolve) => setTimeout(resolve, 300))
          updatedList[current].state = "default"
          setLinkedList(updatedList)
          current++
        }

        // Mark the last node as deleted
        const updatedList = [...linkedList]
        updatedList[linkedList.length - 1].state = "deleted"
        setLinkedList(updatedList)
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Make the second last node point to null
        setHighlightedLine(16)
        setLinkedList(linkedList.slice(0, -1).map((node) => ({ ...node, state: "default" })))
        await new Promise((resolve) => setTimeout(resolve, 500))
        setMessage("Deleted node from the end")
      }
    }

    setHighlightedLine(19)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOperation(null)
    setHighlightedLine(null)
  }

  const deleteFromPosition = async () => {
    if (positionValue.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a position",
        variant: "destructive",
      })
      return
    }

    const position = Number.parseInt(positionValue)
    if (isNaN(position) || position < 0) {
      toast({
        title: "Error",
        description: "Please enter a valid position",
        variant: "destructive",
      })
      return
    }

    setOperation("deletePosition")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If the list is empty, return null
    setHighlightedLine(2)
    if (linkedList.length === 0) {
      setHighlightedLine(3)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setMessage("List is empty, nothing to delete")
    } else {
      // If position is 0, delete from beginning
      setHighlightedLine(6)
      if (position === 0) {
        setHighlightedLine(7)
        const updatedList = [...linkedList]
        updatedList[0].state = "deleted"
        setLinkedList(updatedList)
        await new Promise((resolve) => setTimeout(resolve, 500))

        setLinkedList(linkedList.slice(1).map((node) => ({ ...node, state: "default" })))
        await new Promise((resolve) => setTimeout(resolve, 500))
        setMessage("Deleted node from position " + position)
      } else {
        // Traverse to the node before the position
        setHighlightedLine(11)
        let current = 0
        let count = 0
        while (current < linkedList.length && count < position - 1) {
          const updatedList = [...linkedList]
          updatedList[current].state = "current"
          setLinkedList(updatedList)
          await new Promise((resolve) => setTimeout(resolve, 300))
          updatedList[current].state = "default"
          setLinkedList(updatedList)
          current++
          count++
        }

        // If position is beyond the length or next node is null
        setHighlightedLine(17)
        if (current >= linkedList.length - 1 || position >= linkedList.length) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setMessage("Position out of range")
        } else {
          // Delete the node at the position
          setHighlightedLine(22)
          const updatedList = [...linkedList]
          updatedList[current + 1].state = "deleted"
          setLinkedList(updatedList)
          await new Promise((resolve) => setTimeout(resolve, 500))

          updatedList.splice(current + 1, 1)
          setLinkedList(updatedList.map((node) => ({ ...node, state: "default" })))
          await new Promise((resolve) => setTimeout(resolve, 500))
          setMessage("Deleted node from position " + position)
        }
      }
    }

    setHighlightedLine(26)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOperation(null)
    setHighlightedLine(null)
    setPositionValue("")
  }

  const deleteByKey = async () => {
    if (keyValue.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a key value",
        variant: "destructive",
      })
      return
    }

    const key = Number.parseInt(keyValue)
    if (isNaN(key)) {
      toast({
        title: "Error",
        description: "Please enter a valid number",
        variant: "destructive",
      })
      return
    }

    setOperation("deleteKey")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If the list is empty, return null
    setHighlightedLine(2)
    if (linkedList.length === 0) {
      setHighlightedLine(3)
      await new Promise((resolve) => setTimeout(resolve, 500))
      setMessage("List is empty, nothing to delete")
    } else {
      // If the head node has the key, delete it
      setHighlightedLine(6)
      if (linkedList[0].value === key) {
        setHighlightedLine(7)
        const updatedList = [...linkedList]
        updatedList[0].state = "deleted"
        setLinkedList(updatedList)
        await new Promise((resolve) => setTimeout(resolve, 500))

        setLinkedList(linkedList.slice(1).map((node) => ({ ...node, state: "default" })))
        await new Promise((resolve) => setTimeout(resolve, 500))
        setMessage("Deleted node with key " + key)
      } else {
        // Find the node before the one with the key
        setHighlightedLine(11)
        let current = 0
        let found = false
        while (current < linkedList.length - 1) {
          const updatedList = [...linkedList]
          updatedList[current].state = "current"
          setLinkedList(updatedList)
          await new Promise((resolve) => setTimeout(resolve, 300))

          if (linkedList[current + 1].value === key) {
            found = true
            break
          }

          updatedList[current].state = "default"
          setLinkedList(updatedList)
          current++
        }

        // If key not found, return the original list
        setHighlightedLine(17)
        if (!found) {
          await new Promise((resolve) => setTimeout(resolve, 500))
          setMessage("Key " + key + " not found")
        } else {
          // Delete the node with the key
          setHighlightedLine(22)
          const updatedList = [...linkedList]
          updatedList[current + 1].state = "deleted"
          setLinkedList(updatedList)
          await new Promise((resolve) => setTimeout(resolve, 500))

          updatedList.splice(current + 1, 1)
          setLinkedList(updatedList.map((node) => ({ ...node, state: "default" })))
          await new Promise((resolve) => setTimeout(resolve, 500))
          setMessage("Deleted node with key " + key)
        }
      }
    }

    setHighlightedLine(26)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOperation(null)
    setHighlightedLine(null)
    setKeyValue("")
  }

  // Traversal operation
  const traverse = async () => {
    setOperation("traverse")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Initialize an array to store values
    setHighlightedLine(2)
    const values: number[] = []
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Traverse the list and collect values
    setHighlightedLine(5)
    let current = 0
    while (current < linkedList.length) {
      const updatedList = [...linkedList]
      updatedList[current].state = "current"
      setLinkedList(updatedList)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setHighlightedLine(6)
      values.push(linkedList[current].value)
      await new Promise((resolve) => setTimeout(resolve, 300))

      updatedList[current].state = "default"
      setLinkedList(updatedList)
      current++
    }

    setHighlightedLine(10)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOperation(null)
    setHighlightedLine(null)
    setMessage("Traversal result: " + values.join(", "))
  }

  // Search operation
  const search = async () => {
    if (keyValue.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a key value to search",
        variant: "destructive",
      })
      return
    }

    const key = Number.parseInt(keyValue)
    if (isNaN(key)) {
      toast({
        title: "Error",
        description: "Please enter a valid number",
        variant: "destructive",
      })
      return
    }

    setOperation("search")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Traverse the list to find the key
    setHighlightedLine(2)
    let current = 0
    let found = false
    while (current < linkedList.length) {
      const updatedList = [...linkedList]
      updatedList[current].state = "highlighted"
      setLinkedList(updatedList)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setHighlightedLine(3)
      if (linkedList[current].value === key) {
        setHighlightedLine(4)
        updatedList[current].state = "found"
        setLinkedList(updatedList)
        await new Promise((resolve) => setTimeout(resolve, 500))
        found = true
        break
      }

      updatedList[current].state = "default"
      setLinkedList(updatedList)
      current++
    }

    setHighlightedLine(found ? 4 : 9)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOperation(null)
    setHighlightedLine(null)
    setKeyValue("")
    setMessage(found ? "Key " + key + " found at position " + current : "Key " + key + " not found")
  }

  // Generate a sample linked list
  const generateSampleList = () => {
    const sampleValues = [10, 20, 30, 40, 50]
    const newList: ListNode[] = sampleValues.map((value, index) => ({
      value,
      id: index,
      state: "default",
    }))
    setLinkedList(newList)
    setNextId(sampleValues.length)
    setMessage("Generated a sample linked list")
  }

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold mb-4">
        {isDoublyLinked ? "Doubly Linked List Visualization" : "Linked List Visualization"}
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full"
              />
              <Button onClick={insertAtBeginning} disabled={operation !== null}>
                Insert at Beginning
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full"
              />
              <Button onClick={insertAtEnd} disabled={operation !== null}>
                Insert at End
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full md:w-1/2"
              />
              <Input
                type="text"
                placeholder="Enter position"
                value={positionValue}
                onChange={(e) => setPositionValue(e.target.value)}
                className="w-full md:w-1/2"
              />
              <Button onClick={insertAtPosition} disabled={operation !== null}>
                Insert at Position
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter value"
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                className="w-full md:w-1/2"
              />
              <Input
                type="text"
                placeholder="Enter key"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                className="w-full md:w-1/2"
              />
              <Button onClick={insertAfterKey} disabled={operation !== null}>
                Insert After Key
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button onClick={deleteFromBeginning} disabled={operation !== null || linkedList.length === 0}>
                Delete from Beginning
              </Button>
              <Button onClick={deleteFromEnd} disabled={operation !== null || linkedList.length === 0}>
                Delete from End
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter position"
                value={positionValue}
                onChange={(e) => setPositionValue(e.target.value)}
                className="w-full"
              />
              <Button onClick={deleteFromPosition} disabled={operation !== null || linkedList.length === 0}>
                Delete from Position
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Enter key"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                className="w-full"
              />
              <Button onClick={deleteByKey} disabled={operation !== null || linkedList.length === 0}>
                Delete by Key
              </Button>
            </div>
          </div>

          <div className="flex flex-col gap-2">
            <div className="flex gap-2">
              <Button onClick={traverse} disabled={operation !== null || linkedList.length === 0}>
                Traverse
              </Button>
              <Input
                type="text"
                placeholder="Enter key"
                value={keyValue}
                onChange={(e) => setKeyValue(e.target.value)}
                className="w-full"
              />
              <Button onClick={search} disabled={operation !== null || linkedList.length === 0}>
                Search
              </Button>
            </div>
            <Button onClick={generateSampleList} disabled={operation !== null}>
              Generate Sample List
            </Button>
          </div>

          {message && <div className="p-2 bg-muted rounded-md text-sm">{message}</div>}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {operation === "insertBeginning"
                ? "Insert at Beginning"
                : operation === "insertEnd"
                  ? "Insert at End"
                  : operation === "insertPosition"
                    ? "Insert at Position"
                    : operation === "insertAfterKey"
                      ? "Insert After Key"
                      : operation === "deleteBeginning"
                        ? "Delete from Beginning"
                        : operation === "deleteEnd"
                          ? "Delete from End"
                          : operation === "deletePosition"
                            ? "Delete from Position"
                            : operation === "deleteKey"
                              ? "Delete by Key"
                              : operation === "traverse"
                                ? "Traverse"
                                : operation === "search"
                                  ? "Search"
                                  : "Linked List Operations"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-auto h-64 font-mono text-sm">
              {(operation === "insertBeginning"
                ? insertBeginningCode
                : operation === "insertEnd"
                  ? insertEndCode
                  : operation === "insertPosition"
                    ? insertPositionCode
                    : operation === "insertAfterKey"
                      ? insertAfterKeyCode
                      : operation === "deleteBeginning"
                        ? deleteBeginningCode
                        : operation === "deleteEnd"
                          ? deleteEndCode
                          : operation === "deletePosition"
                            ? deletePositionCode
                            : operation === "deleteKey"
                              ? deleteKeyCode
                              : operation === "traverse"
                                ? traverseCode
                                : operation === "search"
                                  ? searchCode
                                  : insertBeginningCode
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

      <div className="border rounded-md bg-white h-[200px] overflow-auto">
        <canvas ref={canvasRef} className="w-full h-full" />
        {linkedList.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Linked list is empty. Add nodes to visualize.
          </div>
        ) : null}
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
            <div className="w-4 h-4 bg-green-100 border border-green-500 rounded-sm"></div>
            <span className="text-sm">Inserted</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded-sm"></div>
            <span className="text-sm">Found</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-red-100 border border-red-500 rounded-sm"></div>
            <span className="text-sm">Deleted</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-purple-100 border border-purple-500 rounded-sm"></div>
            <span className="text-sm">Current</span>
          </div>
        </div>
      </div>
    </div>
  )
}
