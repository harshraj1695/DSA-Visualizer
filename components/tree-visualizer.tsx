"use client"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { toast } from "@/components/ui/use-toast"

// BST Node Types
type BSTNode = {
  value: number
  left: BSTNode | null
  right: BSTNode | null
  x?: number
  y?: number
  state?: "default" | "highlighted" | "inserted" | "found" | "deleted" | "current"
}

// Binary Tree Node Types (renamed from B-Tree)
type BinaryTreeNode = {
  value: number
  left: BinaryTreeNode | null
  right: BinaryTreeNode | null
  x?: number
  y?: number
  state?: "default" | "highlighted" | "inserted" | "found" | "deleted" | "current"
}

export default function TreeVisualizer() {
  const [treeType, setTreeType] = useState<"bst" | "binary">("bst")
  const [inputValue, setInputValue] = useState("")
  const [traversalType, setTraversalType] = useState<"inorder" | "preorder" | "postorder" | "levelorder">("inorder")
  const [operation, setOperation] = useState<"insert" | "delete" | "search" | "traverse" | null>(null)
  const [message, setMessage] = useState("")
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)

  // BST State
  const [bstRoot, setBSTRoot] = useState<BSTNode | null>(null)
  const [bstTraversalResult, setBSTTraversalResult] = useState<number[]>([])

  // Binary Tree State
  const [binaryTreeRoot, setBinaryTreeRoot] = useState<BinaryTreeNode | null>(null)
  const [binaryTreeTraversalResult, setBinaryTreeTraversalResult] = useState<number[]>([])

  const canvasRef = useRef<HTMLCanvasElement | null>(null)

  // Code snippets for different operations
  const bstInsertCode = [
    "function insert(root, value) {",
    "  // If the tree is empty, create a new node",
    "  if (root === null) {",
    "    return { value, left: null, right: null };",
    "  }",
    "",
    "  // Otherwise, recur down the tree",
    "  if (value < root.value) {",
    "    // Insert into the left subtree",
    "    root.left = insert(root.left, value);",
    "  } else if (value > root.value) {",
    "    // Insert into the right subtree",
    "    root.right = insert(root.right, value);",
    "  }",
    "",
    "  // Return the unchanged node pointer",
    "  return root;",
    "}",
  ]

  const bstDeleteCode = [
    "function deleteNode(root, value) {",
    "  // Base case: If the tree is empty",
    "  if (root === null) return null;",
    "",
    "  // Recursive calls for ancestors of node to be deleted",
    "  if (value < root.value) {",
    "    root.left = deleteNode(root.left, value);",
    "    return root;",
    "  } else if (value > root.value) {",
    "    root.right = deleteNode(root.right, value);",
    "    return root;",
    "  }",
    "",
    "  // We reach here when root is the node to be deleted",
    "",
    "  // Case 1: Node with only one child or no child",
    "  if (root.left === null) {",
    "    return root.right;",
    "  } else if (root.right === null) {",
    "    return root.left;",
    "  }",
    "",
    "  // Case 2: Node with two children",
    "  // Find the inorder successor (smallest in the right subtree)",
    "  root.value = minValue(root.right);",
    "",
    "  // Delete the inorder successor",
    "  root.right = deleteNode(root.right, root.value);",
    "",
    "  return root;",
    "}",
    "",
    "function minValue(node) {",
    "  let current = node;",
    "  while (current.left !== null) {",
    "    current = current.left;",
    "  }",
    "  return current.value;",
    "}",
  ]

  const binaryTreeInsertCode = [
    "function insert(root, value) {",
    "  // If the tree is empty, create a new node",
    "  if (root === null) {",
    "    return { value, left: null, right: null };",
    "  }",
    "",
    "  // Insert in level order (breadth-first)",
    "  const queue = [root];",
    "  while (queue.length > 0) {",
    "    const current = queue.shift();",
    "    ",
    "    // If left child is empty, insert here",
    "    if (current.left === null) {",
    "      current.left = { value, left: null, right: null };",
    "      return root;",
    "    } else {",
    "      queue.push(current.left);",
    "    }",
    "    ",
    "    // If right child is empty, insert here",
    "    if (current.right === null) {",
    "      current.right = { value, left: null, right: null };",
    "      return root;",
    "    } else {",
    "      queue.push(current.right);",
    "    }",
    "  }",
    "  ",
    "  return root;",
    "}",
  ]

  const traversalCode = [
    "// In-order traversal",
    "function inorderTraversal(root, result = []) {",
    "  if (root !== null) {",
    "    // First recur on left child",
    "    inorderTraversal(root.left, result);",
    "    // Then visit the node",
    "    result.push(root.value);",
    "    // Finally recur on right child",
    "    inorderTraversal(root.right, result);",
    "  }",
    "  return result;",
    "}",
    "",
    "// Pre-order traversal",
    "function preorderTraversal(root, result = []) {",
    "  if (root !== null) {",
    "    // First visit the node",
    "    result.push(root.value);",
    "    // Then recur on left child",
    "    preorderTraversal(root.left, result);",
    "    // Finally recur on right child",
    "    preorderTraversal(root.right, result);",
    "  }",
    "  return result;",
    "}",
    "",
    "// Post-order traversal",
    "function postorderTraversal(root, result = []) {",
    "  if (root !== null) {",
    "    // First recur on left child",
    "    postorderTraversal(root.left, result);",
    "    // Then recur on right child",
    "    postorderTraversal(root.right, result);",
    "    // Finally visit the node",
    "    result.push(root.value);",
    "  }",
    "  return result;",
    "}",
    "",
    "// Level-order traversal",
    "function levelorderTraversal(root) {",
    "  if (root === null) return [];",
    "  ",
    "  const result = [];",
    "  const queue = [root];",
    "  ",
    "  while (queue.length > 0) {",
    "    const node = queue.shift();",
    "    result.push(node.value);",
    "    ",
    "    if (node.left !== null) {",
    "      queue.push(node.left);",
    "    }",
    "    if (node.right !== null) {",
    "      queue.push(node.right);",
    "    }",
    "  }",
    "  ",
    "  return result;",
    "}",
  ]

  // Initialize canvas and draw trees
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

    if (treeType === "bst") {
      // Draw BST
      if (bstRoot) {
        // Calculate positions for each node with smaller initial spacing
        calculateTreePositions(bstRoot, canvas.width / 2, 50, canvas.width / 4)

        // Draw the tree
        drawTree(ctx, bstRoot)
      }
    } else {
      // Draw Binary Tree
      if (binaryTreeRoot) {
        // Calculate positions for each node with smaller initial spacing
        calculateTreePositions(binaryTreeRoot, canvas.width / 2, 50, canvas.width / 4)

        // Draw the tree
        drawTree(ctx, binaryTreeRoot)
      }
    }
  }, [treeType, bstRoot, binaryTreeRoot, operation])

  // Calculate positions for tree nodes (works for both BST and Binary Tree)
  const calculateTreePositions = (node: BSTNode | BinaryTreeNode, x: number, y: number, horizontalSpacing: number) => {
    if (!node) return

    node.x = x
    node.y = y

    // Calculate positions for children with smaller horizontal spacing and vertical distance
    if (node.left) {
      // Reduce horizontal spacing more aggressively and use smaller vertical distance
      calculateTreePositions(node.left, x - horizontalSpacing / 2, y + 40, horizontalSpacing / 2)
    }

    if (node.right) {
      // Reduce horizontal spacing more aggressively and use smaller vertical distance
      calculateTreePositions(node.right, x + horizontalSpacing / 2, y + 40, horizontalSpacing / 2)
    }
  }

  // Draw tree on canvas (works for both BST and Binary Tree)
  const drawTree = (ctx: CanvasRenderingContext2D, node: BSTNode | BinaryTreeNode) => {
    if (!node || node.x === undefined || node.y === undefined) return

    // Draw connections to children
    if (node.left && node.left.x !== undefined && node.left.y !== undefined) {
      ctx.beginPath()
      ctx.moveTo(node.x, node.y)
      ctx.lineTo(node.left.x, node.left.y)
      ctx.strokeStyle = "#64748b" // slate-500
      ctx.lineWidth = 0.8 // Thinner lines
      ctx.stroke()

      // Recursively draw left subtree
      drawTree(ctx, node.left)
    }

    if (node.right && node.right.x !== undefined && node.right.y !== undefined) {
      ctx.beginPath()
      ctx.moveTo(node.x, node.y)
      ctx.lineTo(node.right.x, node.right.y)
      ctx.strokeStyle = "#64748b" // slate-500
      ctx.lineWidth = 0.8 // Thinner lines
      ctx.stroke()

      // Recursively draw right subtree
      drawTree(ctx, node.right)
    }

    // Draw node
    ctx.beginPath()
    ctx.arc(node.x, node.y, 20, 0, 2 * Math.PI) // Smaller nodes

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
    ctx.font = "12px Arial" // Smaller font
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(node.value.toString(), node.x, node.y)
  }

  // BST Operations
  const insertBST = async (value: number) => {
    setOperation("insert")
    setHighlightedLine(0)

    // Create a deep copy of the current tree
    const newRoot = JSON.parse(JSON.stringify(bstRoot))

    // Reset all node states
    resetNodeStates(newRoot)

    // Perform insertion
    const updatedRoot = await insertBSTNode(newRoot, value)

    // Update the tree
    setBSTRoot(updatedRoot)

    setOperation(null)
    setHighlightedLine(null)
    setMessage(`Inserted ${value}`)
  }

  // Ensure the insertBSTNode function strictly follows BST properties
  const insertBSTNode = async (root: BSTNode | null, value: number): Promise<BSTNode> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If the tree is empty, create a new node
    if (root === null) {
      setHighlightedLine(2)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newNode: BSTNode = { value, left: null, right: null, state: "inserted" }
      setBSTRoot(newNode)

      setHighlightedLine(3)
      await new Promise((resolve) => setTimeout(resolve, 500))

      return newNode
    }

    // Highlight current node
    root.state = "highlighted"
    setBSTRoot({ ...root })

    setHighlightedLine(7)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Otherwise, recur down the tree
    if (value < root.value) {
      // Insert into the left subtree (smaller values)
      setHighlightedLine(8)
      await new Promise((resolve) => setTimeout(resolve, 500))

      root.left = await insertBSTNode(root.left, value)
    } else if (value > root.value) {
      // Insert into the right subtree (larger values)
      setHighlightedLine(11)
      await new Promise((resolve) => setTimeout(resolve, 500))

      root.right = await insertBSTNode(root.right, value)
    }
    // If value is equal, we don't insert duplicates in a BST

    // Reset highlight
    root.state = "default"
    setBSTRoot({ ...root })

    setHighlightedLine(16)
    await new Promise((resolve) => setTimeout(resolve, 500))

    return root
  }

  const deleteBST = async (value: number) => {
    if (!bstRoot) {
      setMessage("Tree is empty")
      return
    }

    setOperation("delete")
    setHighlightedLine(0)

    // Create a deep copy of the current tree
    const newRoot = JSON.parse(JSON.stringify(bstRoot))

    // Reset all node states
    resetNodeStates(newRoot)

    // Perform deletion
    const updatedRoot = await deleteBSTNode(newRoot, value)

    // Update the tree
    setBSTRoot(updatedRoot)

    setOperation(null)
    setHighlightedLine(null)
    setMessage(updatedRoot ? `Deleted ${value}` : "Value not found")
  }

  const deleteBSTNode = async (root: BSTNode | null, value: number): Promise<BSTNode | null> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Base case: If the tree is empty
    if (root === null) {
      setHighlightedLine(2)
      await new Promise((resolve) => setTimeout(resolve, 500))

      return null
    }

    // Highlight current node
    root.state = "highlighted"
    setBSTRoot({ ...root })

    setHighlightedLine(5)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Recursive calls for ancestors of node to be deleted
    if (value < root.value) {
      setHighlightedLine(6)
      await new Promise((resolve) => setTimeout(resolve, 500))

      root.left = await deleteBSTNode(root.left, value)

      // Reset highlight
      root.state = "default"
      setBSTRoot({ ...root })

      return root
    } else if (value > root.value) {
      setHighlightedLine(9)
      await new Promise((resolve) => setTimeout(resolve, 500))

      root.right = await deleteBSTNode(root.right, value)

      // Reset highlight
      root.state = "default"
      setBSTRoot({ ...root })

      return root
    }

    // We reach here when root is the node to be deleted
    root.state = "deleted"
    setBSTRoot({ ...root })

    setHighlightedLine(15)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Case 1: Node with only one child or no child
    if (root.left === null) {
      setHighlightedLine(16)
      await new Promise((resolve) => setTimeout(resolve, 500))

      return root.right
    } else if (root.right === null) {
      setHighlightedLine(18)
      await new Promise((resolve) => setTimeout(resolve, 500))

      return root.left
    }

    // Case 2: Node with two children
    setHighlightedLine(23)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Find the inorder successor (smallest in the right subtree)
    const minValueNode = await findMinValueNode(root.right)
    root.value = minValueNode.value

    setHighlightedLine(26)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Delete the inorder successor
    root.right = await deleteBSTNode(root.right, minValueNode.value)

    // Reset highlight
    root.state = "default"
    setBSTRoot({ ...root })

    return root
  }

  const findMinValueNode = async (node: BSTNode): Promise<BSTNode> => {
    setHighlightedLine(32)
    await new Promise((resolve) => setTimeout(resolve, 500))

    let current = node
    current.state = "highlighted"
    setBSTRoot({ ...bstRoot })

    setHighlightedLine(33)
    await new Promise((resolve) => setTimeout(resolve, 500))

    while (current.left !== null) {
      current.state = "default"
      current.left.state = "highlighted"
      current = current.left
      setBSTRoot({ ...bstRoot })

      setHighlightedLine(34)
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    current.state = "found"
    setBSTRoot({ ...bstRoot })

    setHighlightedLine(36)
    await new Promise((resolve) => setTimeout(resolve, 500))

    return current
  }

  const searchBST = async (value: number) => {
    if (!bstRoot) {
      setMessage("Tree is empty")
      return
    }

    setOperation("search")
    setHighlightedLine(0)

    // Create a deep copy of the current tree
    const newRoot = JSON.parse(JSON.stringify(bstRoot))

    // Reset all node states
    resetNodeStates(newRoot)

    // Perform search
    const found = await searchBSTNode(newRoot, value)

    // Update the tree
    setBSTRoot(newRoot)

    setOperation(null)
    setHighlightedLine(null)
    setMessage(found ? `Found ${value}` : `${value} not found`)
  }

  const searchBSTNode = async (root: BSTNode | null, value: number): Promise<boolean> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    if (root === null) {
      return false
    }

    // Highlight current node
    root.state = "highlighted"
    setBSTRoot({ ...root })

    await new Promise((resolve) => setTimeout(resolve, 500))

    if (root.value === value) {
      root.state = "found"
      setBSTRoot({ ...root })

      await new Promise((resolve) => setTimeout(resolve, 500))

      return true
    }

    if (value < root.value) {
      // Reset highlight
      root.state = "default"
      setBSTRoot({ ...root })

      return await searchBSTNode(root.left, value)
    } else {
      // Reset highlight
      root.state = "default"
      setBSTRoot({ ...root })

      return await searchBSTNode(root.right, value)
    }
  }

  // Binary Tree Operations
  const insertBinaryTree = async (value: number) => {
    setOperation("insert")
    setHighlightedLine(0)

    // Create a deep copy of the current tree
    const newRoot = JSON.parse(JSON.stringify(binaryTreeRoot))

    // Reset all node states
    resetNodeStates(newRoot)

    // Perform insertion
    const updatedRoot = await insertBinaryTreeNode(newRoot, value)

    // Update the tree
    setBinaryTreeRoot(updatedRoot)

    setOperation(null)
    setHighlightedLine(null)
    setMessage(`Inserted ${value}`)
  }

  const insertBinaryTreeNode = async (root: BinaryTreeNode | null, value: number): Promise<BinaryTreeNode> => {
    await new Promise((resolve) => setTimeout(resolve, 500))

    // If the tree is empty, create a new node
    if (root === null) {
      setHighlightedLine(2)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const newNode: BinaryTreeNode = { value, left: null, right: null, state: "inserted" }
      setBinaryTreeRoot(newNode)

      setHighlightedLine(3)
      await new Promise((resolve) => setTimeout(resolve, 500))

      return newNode
    }

    // Insert in level order (breadth-first)
    setHighlightedLine(7)
    await new Promise((resolve) => setTimeout(resolve, 500))

    const queue: BinaryTreeNode[] = [root]

    while (queue.length > 0) {
      const current = queue.shift()!

      // Highlight current node
      current.state = "highlighted"
      setBinaryTreeRoot({ ...root })

      setHighlightedLine(9)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // If left child is empty, insert here
      if (current.left === null) {
        setHighlightedLine(12)
        await new Promise((resolve) => setTimeout(resolve, 500))

        const newNode: BinaryTreeNode = { value, left: null, right: null, state: "inserted" }
        current.left = newNode
        setBinaryTreeRoot({ ...root })

        // Reset highlight
        current.state = "default"
        setBinaryTreeRoot({ ...root })

        return root
      } else {
        setHighlightedLine(15)
        await new Promise((resolve) => setTimeout(resolve, 500))

        queue.push(current.left)
      }

      // If right child is empty, insert here
      if (current.right === null) {
        setHighlightedLine(19)
        await new Promise((resolve) => setTimeout(resolve, 500))

        const newNode: BinaryTreeNode = { value, left: null, right: null, state: "inserted" }
        current.right = newNode
        setBinaryTreeRoot({ ...root })

        // Reset highlight
        current.state = "default"
        setBinaryTreeRoot({ ...root })

        return root
      } else {
        setHighlightedLine(22)
        await new Promise((resolve) => setTimeout(resolve, 500))

        queue.push(current.right)
      }

      // Reset highlight
      current.state = "default"
      setBinaryTreeRoot({ ...root })
    }

    return root
  }

  // Traversal operations (works for both BST and Binary Tree)
  const traverseTree = async () => {
    if (treeType === "bst") {
      if (!bstRoot) {
        setMessage("Tree is empty")
        return
      }

      setOperation("traverse")

      // Create a deep copy of the current tree
      const newRoot = JSON.parse(JSON.stringify(bstRoot))

      // Reset all node states
      resetNodeStates(newRoot)

      // Perform traversal
      let result: number[] = []

      switch (traversalType) {
        case "inorder":
          setHighlightedLine(1)
          result = await inorderTraversal(newRoot)
          break
        case "preorder":
          setHighlightedLine(13)
          result = await preorderTraversal(newRoot)
          break
        case "postorder":
          setHighlightedLine(24)
          result = await postorderTraversal(newRoot)
          break
        case "levelorder":
          setHighlightedLine(35)
          result = await levelOrderTraversal(newRoot)
          break
      }

      // Update the tree and result
      setBSTRoot(newRoot)
      setBSTTraversalResult(result)

      setOperation(null)
      setHighlightedLine(null)
      setMessage(`${traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} traversal: ${result.join(", ")}`)
    } else {
      if (!binaryTreeRoot) {
        setMessage("Tree is empty")
        return
      }

      setOperation("traverse")

      // Create a deep copy of the current tree
      const newRoot = JSON.parse(JSON.stringify(binaryTreeRoot))

      // Reset all node states
      resetNodeStates(newRoot)

      // Perform traversal
      let result: number[] = []

      switch (traversalType) {
        case "inorder":
          setHighlightedLine(1)
          result = await inorderTraversal(newRoot)
          break
        case "preorder":
          setHighlightedLine(13)
          result = await preorderTraversal(newRoot)
          break
        case "postorder":
          setHighlightedLine(24)
          result = await postorderTraversal(newRoot)
          break
        case "levelorder":
          setHighlightedLine(35)
          result = await levelOrderTraversal(newRoot)
          break
      }

      // Update the tree and result
      setBinaryTreeRoot(newRoot)
      setBinaryTreeTraversalResult(result)

      setOperation(null)
      setHighlightedLine(null)
      setMessage(`${traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} traversal: ${result.join(", ")}`)
    }
  }

  const inorderTraversal = async (root: BSTNode | BinaryTreeNode | null, result: number[] = []): Promise<number[]> => {
    if (root !== null) {
      // Highlight current node
      root.state = "highlighted"
      if (treeType === "bst") {
        setBSTRoot({ ...bstRoot })
      } else {
        setBinaryTreeRoot({ ...binaryTreeRoot })
      }

      setHighlightedLine(3)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // First recur on left child
      await inorderTraversal(root.left, result)

      // Then visit the node
      root.state = "current"
      if (treeType === "bst") {
        setBSTRoot({ ...bstRoot })
      } else {
        setBinaryTreeRoot({ ...binaryTreeRoot })
      }

      setHighlightedLine(5)
      await new Promise((resolve) => setTimeout(resolve, 500))

      result.push(root.value)

      // Reset state
      root.state = "default"
      if (treeType === "bst") {
        setBSTRoot({ ...bstRoot })
      } else {
        setBinaryTreeRoot({ ...binaryTreeRoot })
      }

      setHighlightedLine(7)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Finally recur on right child
      await inorderTraversal(root.right, result)
    }

    return result
  }

  const preorderTraversal = async (root: BSTNode | BinaryTreeNode | null, result: number[] = []): Promise<number[]> => {
    if (root !== null) {
      // Highlight current node
      root.state = "highlighted"
      if (treeType === "bst") {
        setBSTRoot({ ...bstRoot })
      } else {
        setBinaryTreeRoot({ ...binaryTreeRoot })
      }

      setHighlightedLine(15)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // First visit the node
      root.state = "current"
      if (treeType === "bst") {
        setBSTRoot({ ...bstRoot })
      } else {
        setBinaryTreeRoot({ ...binaryTreeRoot })
      }

      result.push(root.value)

      // Reset state
      root.state = "default"
      if (treeType === "bst") {
        setBSTRoot({ ...bstRoot })
      } else {
        setBinaryTreeRoot({ ...binaryTreeRoot })
      }

      setHighlightedLine(17)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Then recur on left child
      await preorderTraversal(root.left, result)

      setHighlightedLine(19)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Finally recur on right child
      await preorderTraversal(root.right, result)
    }

    return result
  }

  const postorderTraversal = async (
    root: BSTNode | BinaryTreeNode | null,
    result: number[] = [],
  ): Promise<number[]> => {
    if (root !== null) {
      // Highlight current node
      root.state = "highlighted"
      if (treeType === "bst") {
        setBSTRoot({ ...bstRoot })
      } else {
        setBinaryTreeRoot({ ...binaryTreeRoot })
      }

      setHighlightedLine(26)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // First recur on left child
      await postorderTraversal(root.left, result)

      setHighlightedLine(28)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Then recur on right child
      await postorderTraversal(root.right, result)

      // Finally visit the node
      root.state = "current"
      if (treeType === "bst") {
        setBSTRoot({ ...bstRoot })
      } else {
        setBinaryTreeRoot({ ...binaryTreeRoot })
      }

      setHighlightedLine(30)
      await new Promise((resolve) => setTimeout(resolve, 500))

      result.push(root.value)

      // Reset state
      root.state = "default"
      if (treeType === "bst") {
        setBSTRoot({ ...bstRoot })
      } else {
        setBinaryTreeRoot({ ...binaryTreeRoot })
      }
    }

    return result
  }

  const levelOrderTraversal = async (root: BSTNode | BinaryTreeNode | null): Promise<number[]> => {
    if (root === null) {
      setHighlightedLine(36)
      await new Promise((resolve) => setTimeout(resolve, 500))

      return []
    }

    const result: number[] = []
    const queue: (BSTNode | BinaryTreeNode)[] = [root]

    setHighlightedLine(38)
    await new Promise((resolve) => setTimeout(resolve, 500))

    while (queue.length > 0) {
      setHighlightedLine(41)
      await new Promise((resolve) => setTimeout(resolve, 500))

      const node = queue.shift()!

      // Highlight current node
      node.state = "current"
      if (treeType === "bst") {
        setBSTRoot({ ...bstRoot })
      } else {
        setBinaryTreeRoot({ ...binaryTreeRoot })
      }

      setHighlightedLine(42)
      await new Promise((resolve) => setTimeout(resolve, 500))

      result.push(node.value)

      // Reset state
      node.state = "default"
      if (treeType === "bst") {
        setBSTRoot({ ...bstRoot })
      } else {
        setBinaryTreeRoot({ ...binaryTreeRoot })
      }

      if (node.left !== null) {
        setHighlightedLine(44)
        await new Promise((resolve) => setTimeout(resolve, 500))

        node.left.state = "highlighted"
        if (treeType === "bst") {
          setBSTRoot({ ...bstRoot })
        } else {
          setBinaryTreeRoot({ ...binaryTreeRoot })
        }

        queue.push(node.left)

        // Reset state
        node.left.state = "default"
        if (treeType === "bst") {
          setBSTRoot({ ...bstRoot })
        } else {
          setBinaryTreeRoot({ ...binaryTreeRoot })
        }
      }

      if (node.right !== null) {
        setHighlightedLine(47)
        await new Promise((resolve) => setTimeout(resolve, 500))

        node.right.state = "highlighted"
        if (treeType === "bst") {
          setBSTRoot({ ...bstRoot })
        } else {
          setBinaryTreeRoot({ ...binaryTreeRoot })
        }

        queue.push(node.right)

        // Reset state
        node.right.state = "default"
        if (treeType === "bst") {
          setBSTRoot({ ...bstRoot })
        } else {
          setBinaryTreeRoot({ ...binaryTreeRoot })
        }
      }
    }

    return result
  }

  // Reset all node states in tree
  const resetNodeStates = (root: BSTNode | BinaryTreeNode | null) => {
    if (root === null) return

    root.state = "default"
    resetNodeStates(root.left)
    resetNodeStates(root.right)
  }

  // Handle input value submission
  const handleSubmit = () => {
    const value = Number.parseInt(inputValue.trim())

    if (isNaN(value)) {
      toast({
        title: "Error",
        description: "Please enter a valid number",
        variant: "destructive",
      })
      return
    }

    if (treeType === "bst") {
      if (operation === "insert" || operation === null) {
        insertBST(value)
      } else if (operation === "delete") {
        deleteBST(value)
      } else if (operation === "search") {
        searchBST(value)
      }
    } else {
      if (operation === "insert" || operation === null) {
        insertBinaryTree(value)
      } else if (operation === "search") {
        // Binary tree search is not implemented, but could be added
        toast({
          title: "Info",
          description: "Search is only available for BST",
        })
      }
    }

    setInputValue("")
  }

  // Generate a sample tree
  const generateSampleTree = () => {
    if (treeType === "bst") {
      // Create a balanced BST with values 1-15
      // Using a more balanced insertion order to create a proper BST
      const values = [8, 4, 12, 2, 6, 10, 14, 1, 3, 5, 7, 9, 11, 13, 15]

      // Reset the tree
      setBSTRoot(null)
      setBSTTraversalResult([])

      // Insert values one by one
      const insertValues = async () => {
        for (const value of values) {
          await insertBST(value)
        }
      }

      insertValues()
    } else {
      // Create a sample Binary Tree
      const values = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10]

      // Reset the tree
      setBinaryTreeRoot(null)
      setBinaryTreeTraversalResult([])

      // Insert values one by one
      const insertValues = async () => {
        for (const value of values) {
          await insertBinaryTree(value)
        }
      }

      insertValues()
    }
  }

  return (
    <div className="space-y-6">
      <Tabs value={treeType} onValueChange={(value: "bst" | "binary") => setTreeType(value)}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="bst">Binary Search Tree</TabsTrigger>
          <TabsTrigger value="binary">Binary Tree</TabsTrigger>
        </TabsList>

        <TabsContent value="bst" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit()
                  }}
                />
                <Button onClick={handleSubmit} disabled={operation !== null && operation !== "insert"}>
                  {operation === "delete" ? "Delete" : operation === "search" ? "Search" : "Insert"}
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant={operation === "insert" ? "default" : "outline"} onClick={() => setOperation("insert")}>
                  Insert Mode
                </Button>
                <Button variant={operation === "delete" ? "default" : "outline"} onClick={() => setOperation("delete")}>
                  Delete Mode
                </Button>
                <Button variant={operation === "search" ? "default" : "outline"} onClick={() => setOperation("search")}>
                  Search Mode
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select
                  value={traversalType}
                  onValueChange={(value: "inorder" | "preorder" | "postorder" | "levelorder") =>
                    setTraversalType(value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Traversal Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inorder">In-order</SelectItem>
                    <SelectItem value="preorder">Pre-order</SelectItem>
                    <SelectItem value="postorder">Post-order</SelectItem>
                    <SelectItem value="levelorder">Level-order</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={traverseTree} disabled={operation !== null}>
                  Traverse
                </Button>
                <Button onClick={generateSampleTree} disabled={operation !== null} variant="outline">
                  Generate Sample Tree
                </Button>
              </div>

              {bstTraversalResult.length > 0 && (
                <div className="p-2 bg-muted rounded-md text-sm">
                  <strong>Traversal Result:</strong> {bstTraversalResult.join(", ")}
                </div>
              )}

              {message && <div className="p-2 bg-muted rounded-md text-sm">{message}</div>}
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {operation === "delete"
                    ? "Delete Operation"
                    : operation === "search"
                      ? "Search Operation"
                      : operation === "traverse"
                        ? `${traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal`
                        : "Insert Operation"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md overflow-auto h-64 font-mono text-sm">
                  {(operation === "delete"
                    ? bstDeleteCode
                    : operation === "traverse"
                      ? traversalCode
                      : operation === "search"
                        ? bstDeleteCode.slice(0, 10)
                        : bstInsertCode
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
        </TabsContent>

        <TabsContent value="binary" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Enter value"
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") handleSubmit()
                  }}
                />
                <Button onClick={handleSubmit} disabled={operation !== null && operation !== "insert"}>
                  Insert
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Button variant={operation === "insert" ? "default" : "outline"} onClick={() => setOperation("insert")}>
                  Insert Mode
                </Button>
              </div>

              <div className="flex flex-wrap gap-2">
                <Select
                  value={traversalType}
                  onValueChange={(value: "inorder" | "preorder" | "postorder" | "levelorder") =>
                    setTraversalType(value)
                  }
                >
                  <SelectTrigger className="w-[180px]">
                    <SelectValue placeholder="Traversal Type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="inorder">In-order</SelectItem>
                    <SelectItem value="preorder">Pre-order</SelectItem>
                    <SelectItem value="postorder">Post-order</SelectItem>
                    <SelectItem value="levelorder">Level-order</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={traverseTree} disabled={operation !== null}>
                  Traverse
                </Button>
                <Button onClick={generateSampleTree} disabled={operation !== null} variant="outline">
                  Generate Sample Tree
                </Button>
              </div>

              {binaryTreeTraversalResult.length > 0 && (
                <div className="p-2 bg-muted rounded-md text-sm">
                  <strong>Traversal Result:</strong> {binaryTreeTraversalResult.join(", ")}
                </div>
              )}

              {message && <div className="p-2 bg-muted rounded-md text-sm">{message}</div>}
            </div>

            <Card>
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">
                  {operation === "traverse"
                    ? `${traversalType.charAt(0).toUpperCase() + traversalType.slice(1)} Traversal`
                    : "Insert Operation"}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-muted p-4 rounded-md overflow-auto h-64 font-mono text-sm">
                  {(operation === "traverse" ? traversalCode : binaryTreeInsertCode).map((line, index) => (
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
        </TabsContent>
      </Tabs>

      <div className="border rounded-md bg-white h-[400px] overflow-auto">
        <canvas ref={canvasRef} className="w-full h-full" />
        {(treeType === "bst" && !bstRoot) || (treeType === "binary" && !binaryTreeRoot) ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Tree is empty. Add values to visualize.
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
