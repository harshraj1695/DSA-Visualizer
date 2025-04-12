"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Label } from "@/components/ui/label"
import { toast } from "@/components/ui/use-toast"

// Graph Vertex Type
type Vertex = {
  id: string
  x: number
  y: number
  state?: "default" | "highlighted" | "visited" | "current" | "queued" | "stacked" | "selected"
}

// Graph Edge Type
type Edge = {
  from: string
  to: string
  state?: "default" | "highlighted" | "traversed" | "selected"
}

export default function GraphVisualizer() {
  const [vertices, setVertices] = useState<Vertex[]>([])
  const [edges, setEdges] = useState<Edge[]>([])
  const [vertexIdInput, setVertexIdInput] = useState("")
  const [fromVertexInput, setFromVertexInput] = useState("")
  const [toVertexInput, setToVertexInput] = useState("")
  const [startVertexInput, setStartVertexInput] = useState("")
  const [isDirected, setIsDirected] = useState(false)
  const [operation, setOperation] = useState<
    "addVertex" | "removeVertex" | "addEdge" | "removeEdge" | "bfs" | "dfs" | null
  >(null)
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)
  const [message, setMessage] = useState("")
  const [traversalResult, setTraversalResult] = useState<string[]>([])
  const [selectedVertex, setSelectedVertex] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [draggedVertex, setDraggedVertex] = useState<string | null>(null)

  const canvasRef = useRef<HTMLCanvasElement | null>(null)
  const canvasContainerRef = useRef<HTMLDivElement | null>(null)

  // Code snippets for different operations
  const bfsCode = [
    "function bfs(graph, startVertex) {",
    "  // Create a queue for BFS",
    "  const queue = [startVertex];",
    "  // Create a set to store visited vertices",
    "  const visited = new Set([startVertex]);",
    "  // Create an array to store the traversal order",
    "  const result = [startVertex];",
    "",
    "  // Loop until queue is empty",
    "  while (queue.length > 0) {",
    "    // Dequeue a vertex from queue",
    "    const currentVertex = queue.shift();",
    "",
    "    // Get all adjacent vertices of the dequeued vertex",
    "    // If an adjacent vertex has not been visited, mark it",
    "    // visited and enqueue it",
    "    for (const neighbor of graph[currentVertex]) {",
    "      if (!visited.has(neighbor)) {",
    "        visited.add(neighbor);",
    "        queue.push(neighbor);",
    "        result.push(neighbor);",
    "      }",
    "    }",
    "  }",
    "",
    "  return result;",
    "}",
  ]

  const dfsCode = [
    "function dfs(graph, startVertex) {",
    "  // Create a stack for DFS",
    "  const stack = [startVertex];",
    "  // Create a set to store visited vertices",
    "  const visited = new Set();",
    "  // Create an array to store the traversal order",
    "  const result = [];",
    "",
    "  // Loop until stack is empty",
    "  while (stack.length > 0) {",
    "    // Pop a vertex from stack",
    "    const currentVertex = stack.pop();",
    "",
    "    // If the vertex is not visited yet",
    "    if (!visited.has(currentVertex)) {",
    "      // Mark it as visited and add to result",
    "      visited.add(currentVertex);",
    "      result.push(currentVertex);",
    "",
    "      // Get all adjacent vertices of the popped vertex",
    "      // Push them to the stack in reverse order",
    "      const neighbors = [...graph[currentVertex]].reverse();",
    "      for (const neighbor of neighbors) {",
    "        if (!visited.has(neighbor)) {",
    "          stack.push(neighbor);",
    "        }",
    "      }",
    "    }",
    "  }",
    "",
    "  return result;",
    "}",
  ]

  const addVertexCode = [
    "function addVertex(graph, vertexId) {",
    "  // Check if vertex already exists",
    "  if (graph.hasVertex(vertexId)) {",
    "    return false; // Vertex already exists",
    "  }",
    "",
    "  // Add the vertex to the graph",
    "  graph.vertices.set(vertexId, {",
    "    id: vertexId,",
    "    edges: new Set()",
    "  });",
    "",
    "  return true; // Vertex added successfully",
    "}",
  ]

  const removeVertexCode = [
    "function removeVertex(graph, vertexId) {",
    "  // Check if vertex exists",
    "  if (!graph.hasVertex(vertexId)) {",
    "    return false; // Vertex doesn't exist",
    "  }",
    "",
    "  // Remove all edges connected to this vertex",
    "  for (const otherVertex of graph.vertices.values()) {",
    "    otherVertex.edges.delete(vertexId);",
    "  }",
    "",
    "  // Remove the vertex from the graph",
    "  graph.vertices.delete(vertexId);",
    "",
    "  return true; // Vertex removed successfully",
    "}",
  ]

  const addEdgeCode = [
    "function addEdge(graph, fromVertex, toVertex, directed = false) {",
    "  // Check if both vertices exist",
    "  if (!graph.hasVertex(fromVertex) || !graph.hasVertex(toVertex)) {",
    "    return false; // One or both vertices don't exist",
    "  }",
    "",
    "  // Add edge from source to destination",
    "  graph.vertices.get(fromVertex).edges.add(toVertex);",
    "",
    "  // If the graph is undirected, add edge from destination to source",
    "  if (!directed) {",
    "    graph.vertices.get(toVertex).edges.add(fromVertex);",
    "  }",
    "",
    "  return true; // Edge added successfully",
    "}",
  ]

  const removeEdgeCode = [
    "function removeEdge(graph, fromVertex, toVertex, directed = false) {",
    "  // Check if both vertices exist",
    "  if (!graph.hasVertex(fromVertex) || !graph.hasVertex(toVertex)) {",
    "    return false; // One or both vertices don't exist",
    "  }",
    "",
    "  // Remove edge from source to destination",
    "  graph.vertices.get(fromVertex).edges.delete(toVertex);",
    "",
    "  // If the graph is undirected, remove edge from destination to source",
    "  if (!directed) {",
    "    graph.vertices.get(toVertex).edges.delete(fromVertex);",
    "  }",
    "",
    "  return true; // Edge removed successfully",
    "}",
  ]

  // Initialize canvas and draw graph
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

    // Draw graph
    drawGraph(ctx, canvas.width, canvas.height)
  }, [vertices, edges, selectedVertex])

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current
      const container = canvasContainerRef.current
      if (!canvas || !container) return

      canvas.width = container.clientWidth
      canvas.height = container.clientHeight

      // Redraw graph
      const ctx = canvas.getContext("2d")
      if (ctx) {
        drawGraph(ctx, canvas.width, canvas.height)
      }
    }

    window.addEventListener("resize", handleResize)
    return () => window.removeEventListener("resize", handleResize)
  }, [vertices, edges])

  // Draw graph on canvas
  const drawGraph = (ctx: CanvasRenderingContext2D, width: number, height: number) => {
    // Draw edges first (so they appear behind vertices)
    edges.forEach((edge) => {
      const fromVertex = vertices.find((v) => v.id === edge.from)
      const toVertex = vertices.find((v) => v.id === edge.to)

      if (fromVertex && toVertex) {
        // Set edge color based on state
        switch (edge.state) {
          case "highlighted":
            ctx.strokeStyle = "#f59e0b" // amber-500
            break
          case "traversed":
            ctx.strokeStyle = "#22c55e" // green-500
            break
          case "selected":
            ctx.strokeStyle = "#3b82f6" // blue-500
            break
          default:
            ctx.strokeStyle = "#64748b" // slate-500
        }

        ctx.lineWidth = 2
        ctx.beginPath()
        ctx.moveTo(fromVertex.x, fromVertex.y)
        ctx.lineTo(toVertex.x, toVertex.y)
        ctx.stroke()

        // Draw arrow if directed
        if (isDirected) {
          const angle = Math.atan2(toVertex.y - fromVertex.y, toVertex.x - fromVertex.x)
          const headLength = 10
          const vertexRadius = 20

          // Calculate the point where the arrow should end (at the edge of the vertex)
          const endX = toVertex.x - vertexRadius * Math.cos(angle)
          const endY = toVertex.y - vertexRadius * Math.sin(angle)

          ctx.beginPath()
          ctx.moveTo(endX, endY)
          ctx.lineTo(
            endX - headLength * Math.cos(angle - Math.PI / 6),
            endY - headLength * Math.sin(angle - Math.PI / 6),
          )
          ctx.lineTo(
            endX - headLength * Math.cos(angle + Math.PI / 6),
            endY - headLength * Math.sin(angle + Math.PI / 6),
          )
          ctx.closePath()
          ctx.fill()
        }
      }
    })

    // Draw vertices
    vertices.forEach((vertex) => {
      // Set vertex color based on state
      switch (vertex.state) {
        case "highlighted":
          ctx.fillStyle = "#fef3c7" // yellow-100
          ctx.strokeStyle = "#f59e0b" // amber-500
          break
        case "visited":
          ctx.fillStyle = "#dcfce7" // green-100
          ctx.strokeStyle = "#22c55e" // green-500
          break
        case "current":
          ctx.fillStyle = "#f3e8ff" // purple-100
          ctx.strokeStyle = "#a855f7" // purple-500
          break
        case "queued":
          ctx.fillStyle = "#dbeafe" // blue-100
          ctx.strokeStyle = "#3b82f6" // blue-500
          break
        case "stacked":
          ctx.fillStyle = "#fce7f3" // pink-100
          ctx.strokeStyle = "#ec4899" // pink-500
          break
        case "selected":
          ctx.fillStyle = "#e0f2fe" // sky-100
          ctx.strokeStyle = "#0ea5e9" // sky-500
          ctx.lineWidth = 3
          break
        default:
          ctx.fillStyle = "#f1f5f9" // slate-100
          ctx.strokeStyle = "#64748b" // slate-500
          ctx.lineWidth = 2
      }

      // Draw vertex circle
      ctx.beginPath()
      ctx.arc(vertex.x, vertex.y, 20, 0, 2 * Math.PI)
      ctx.fill()
      ctx.stroke()

      // Draw vertex ID
      ctx.fillStyle = "#334155" // slate-700
      ctx.font = "14px Arial"
      ctx.textAlign = "center"
      ctx.textBaseline = "middle"
      ctx.fillText(vertex.id, vertex.x, vertex.y)
    })
  }

  // Handle canvas mouse events for vertex selection and dragging
  const handleCanvasMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Check if a vertex was clicked
    const clickedVertex = vertices.find((v) => {
      const dx = v.x - x
      const dy = v.y - y
      return Math.sqrt(dx * dx + dy * dy) <= 20 // 20 is the vertex radius
    })

    if (clickedVertex) {
      setDraggedVertex(clickedVertex.id)
      setIsDragging(true)

      // If we're in an operation that requires vertex selection
      if (operation === "removeVertex") {
        setVertexIdInput(clickedVertex.id)
      } else if (operation === "addEdge") {
        if (!fromVertexInput) {
          setFromVertexInput(clickedVertex.id)
        } else {
          setToVertexInput(clickedVertex.id)
        }
      } else if (operation === "removeEdge") {
        if (!fromVertexInput) {
          setFromVertexInput(clickedVertex.id)
        } else {
          setToVertexInput(clickedVertex.id)
        }
      } else if (operation === "bfs" || operation === "dfs") {
        setStartVertexInput(clickedVertex.id)
      } else {
        // Toggle selection
        setSelectedVertex(selectedVertex === clickedVertex.id ? null : clickedVertex.id)
      }
    } else {
      // If clicked on empty space and we're adding a vertex
      if (operation === "addVertex" && vertexIdInput.trim() !== "") {
        // Directly call addVertex with coordinates
        addVertex(vertexIdInput, x, y)
      }
      setSelectedVertex(null)
    }
  }

  const handleCanvasMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDragging || !draggedVertex) return

    const canvas = canvasRef.current
    if (!canvas) return

    const rect = canvas.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top

    // Update vertex position
    setVertices((prevVertices) =>
      prevVertices.map((v) =>
        v.id === draggedVertex
          ? {
              ...v,
              x,
              y,
            }
          : v,
      ),
    )
  }

  const handleCanvasMouseUp = () => {
    setIsDragging(false)
    setDraggedVertex(null)
  }

  // Graph operations
  const addVertex = (id: string, x?: number, y?: number) => {
    if (id.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a vertex ID",
        variant: "destructive",
      })
      return
    }

    // Check if vertex already exists
    if (vertices.some((v) => v.id === id)) {
      toast({
        title: "Error",
        description: `Vertex "${id}" already exists`,
        variant: "destructive",
      })
      return
    }

    setOperation("addVertex")
    setHighlightedLine(0)

    // Highlight code execution
    const executeWithDelay = async () => {
      setHighlightedLine(2)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setHighlightedLine(6)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Add the vertex
      const canvasWidth = canvasRef.current?.width || 600
      const canvasHeight = canvasRef.current?.height || 400

      // If x and y are not provided, place the vertex at a random position
      const newVertex: Vertex = {
        id,
        x: x !== undefined ? x : Math.random() * (canvasWidth - 100) + 50,
        y: y !== undefined ? y : Math.random() * (canvasHeight - 100) + 50,
        state: "highlighted",
      }

      setVertices((prev) => [...prev, newVertex])
      await new Promise((resolve) => setTimeout(resolve, 500))

      setHighlightedLine(11)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Reset vertex state
      setVertices((prevVertices) => prevVertices.map((v) => (v.id === id ? { ...v, state: "default" } : v)))

      setOperation(null)
      setHighlightedLine(null)
      setVertexIdInput("")
      setMessage(`Added vertex "${id}"`)
    }

    executeWithDelay()
  }

  const removeVertex = (id: string) => {
    if (id.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a vertex ID",
        variant: "destructive",
      })
      return
    }

    // Check if vertex exists
    if (!vertices.some((v) => v.id === id)) {
      toast({
        title: "Error",
        description: `Vertex "${id}" does not exist`,
        variant: "destructive",
      })
      return
    }

    setOperation("removeVertex")
    setHighlightedLine(0)

    // Highlight code execution
    const executeWithDelay = async () => {
      setHighlightedLine(2)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Highlight the vertex to be removed
      setVertices((prevVertices) => prevVertices.map((v) => (v.id === id ? { ...v, state: "highlighted" } : v)))
      await new Promise((resolve) => setTimeout(resolve, 500))

      setHighlightedLine(6)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Highlight edges to be removed
      const edgesToRemove = edges.filter((e) => e.from === id || e.to === id)
      setEdges((prevEdges) => prevEdges.map((e) => (e.from === id || e.to === id ? { ...e, state: "highlighted" } : e)))
      await new Promise((resolve) => setTimeout(resolve, 500))

      setHighlightedLine(10)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove the vertex and its edges
      setVertices((prevVertices) => prevVertices.filter((v) => v.id !== id))
      setEdges((prevEdges) => prevEdges.filter((e) => e.from !== id && e.to !== id))
      await new Promise((resolve) => setTimeout(resolve, 500))

      setHighlightedLine(13)
      await new Promise((resolve) => setTimeout(resolve, 500))

      setOperation(null)
      setHighlightedLine(null)
      setVertexIdInput("")
      setMessage(`Removed vertex "${id}" and its edges`)
    }

    executeWithDelay()
  }

  const addEdge = (from: string, to: string) => {
    if (from.trim() === "" || to.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter both source and destination vertex IDs",
        variant: "destructive",
      })
      return
    }

    // Check if both vertices exist
    if (!vertices.some((v) => v.id === from)) {
      toast({
        title: "Error",
        description: `Source vertex "${from}" does not exist`,
        variant: "destructive",
      })
      return
    }

    if (!vertices.some((v) => v.id === to)) {
      toast({
        title: "Error",
        description: `Destination vertex "${to}" does not exist`,
        variant: "destructive",
      })
      return
    }

    // Check if edge already exists
    if (edges.some((e) => e.from === from && e.to === to)) {
      toast({
        title: "Error",
        description: `Edge from "${from}" to "${to}" already exists`,
        variant: "destructive",
      })
      return
    }

    setOperation("addEdge")
    setHighlightedLine(0)

    // Highlight code execution
    const executeWithDelay = async () => {
      setHighlightedLine(2)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Highlight the vertices
      setVertices((prevVertices) =>
        prevVertices.map((v) => (v.id === from || v.id === to ? { ...v, state: "highlighted" } : v)),
      )
      await new Promise((resolve) => setTimeout(resolve, 500))

      setHighlightedLine(6)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Add the edge
      const newEdge: Edge = {
        from,
        to,
        state: "highlighted",
      }
      setEdges([...edges, newEdge])
      await new Promise((resolve) => setTimeout(resolve, 500))

      // If undirected, add the reverse edge
      if (!isDirected) {
        setHighlightedLine(9)
        await new Promise((resolve) => setTimeout(resolve, 500))

        const reverseEdge: Edge = {
          from: to,
          to: from,
          state: "highlighted",
        }
        setEdges((prevEdges) => [...prevEdges, reverseEdge])
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      setHighlightedLine(13)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Reset states
      setVertices((prevVertices) =>
        prevVertices.map((v) => (v.id === from || v.id === to ? { ...v, state: "default" } : v)),
      )
      setEdges((prevEdges) =>
        prevEdges.map((e) =>
          (e.from === from && e.to === to) || (e.from === to && e.to === from) ? { ...e, state: "default" } : e,
        ),
      )

      setOperation(null)
      setHighlightedLine(null)
      setFromVertexInput("")
      setToVertexInput("")
      setMessage(`Added edge from "${from}" to "${to}"`)
    }

    executeWithDelay()
  }

  const removeEdge = (from: string, to: string) => {
    if (from.trim() === "" || to.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter both source and destination vertex IDs",
        variant: "destructive",
      })
      return
    }

    // Check if both vertices exist
    if (!vertices.some((v) => v.id === from)) {
      toast({
        title: "Error",
        description: `Source vertex "${from}" does not exist`,
        variant: "destructive",
      })
      return
    }

    if (!vertices.some((v) => v.id === to)) {
      toast({
        title: "Error",
        description: `Destination vertex "${to}" does not exist`,
        variant: "destructive",
      })
      return
    }

    // Check if edge exists
    if (!edges.some((e) => e.from === from && e.to === to)) {
      toast({
        title: "Error",
        description: `Edge from "${from}" to "${to}" does not exist`,
        variant: "destructive",
      })
      return
    }

    setOperation("removeEdge")
    setHighlightedLine(0)

    // Highlight code execution
    const executeWithDelay = async () => {
      setHighlightedLine(2)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Highlight the vertices
      setVertices((prevVertices) =>
        prevVertices.map((v) => (v.id === from || v.id === to ? { ...v, state: "highlighted" } : v)),
      )
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Highlight the edge to be removed
      setEdges((prevEdges) =>
        prevEdges.map((e) => (e.from === from && e.to === to ? { ...e, state: "highlighted" } : e)),
      )
      await new Promise((resolve) => setTimeout(resolve, 500))

      setHighlightedLine(6)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Remove the edge
      setEdges((prevEdges) => prevEdges.filter((e) => !(e.from === from && e.to === to)))
      await new Promise((resolve) => setTimeout(resolve, 500))

      // If undirected, remove the reverse edge
      if (!isDirected) {
        setHighlightedLine(9)
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Highlight the reverse edge
        setEdges((prevEdges) =>
          prevEdges.map((e) => (e.from === to && e.to === from ? { ...e, state: "highlighted" } : e)),
        )
        await new Promise((resolve) => setTimeout(resolve, 500))

        setEdges((prevEdges) => prevEdges.filter((e) => !(e.from === to && e.to === from)))
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      setHighlightedLine(13)
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Reset states
      setVertices((prevVertices) =>
        prevVertices.map((v) => (v.id === from || v.id === to ? { ...v, state: "default" } : v)),
      )

      setOperation(null)
      setHighlightedLine(null)
      setFromVertexInput("")
      setToVertexInput("")
      setMessage(`Removed edge from "${from}" to "${to}"`)
    }

    executeWithDelay()
  }

  // Build adjacency list from vertices and edges
  const buildAdjacencyList = () => {
    const adjacencyList: Record<string, string[]> = {}

    // Initialize empty arrays for each vertex
    vertices.forEach((vertex) => {
      adjacencyList[vertex.id] = []
    })

    // Add edges to adjacency list
    edges.forEach((edge) => {
      adjacencyList[edge.from].push(edge.to)
    })

    return adjacencyList
  }

  // Traversal algorithms
  const runBFS = async (startVertex: string) => {
    if (startVertex.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a start vertex",
        variant: "destructive",
      })
      return
    }

    // Check if start vertex exists
    if (!vertices.some((v) => v.id === startVertex)) {
      toast({
        title: "Error",
        description: `Start vertex "${startVertex}" does not exist`,
        variant: "destructive",
      })
      return
    }

    setOperation("bfs")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Reset all states
    setVertices((prevVertices) => prevVertices.map((v) => ({ ...v, state: "default" })))
    setEdges((prevEdges) => prevEdges.map((e) => ({ ...e, state: "default" })))
    setTraversalResult([])

    // Create a queue for BFS
    setHighlightedLine(2)
    const queue: string[] = [startVertex]
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a set to store visited vertices
    setHighlightedLine(4)
    const visited = new Set<string>([startVertex])
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create an array to store the traversal order
    setHighlightedLine(6)
    const result: string[] = [startVertex]
    setTraversalResult([startVertex])
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mark start vertex as visited
    setVertices((prevVertices) => prevVertices.map((v) => (v.id === startVertex ? { ...v, state: "visited" } : v)))
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Build adjacency list
    const adjacencyList = buildAdjacencyList()

    // Loop until queue is empty
    setHighlightedLine(9)
    while (queue.length > 0) {
      // Dequeue a vertex from queue
      setHighlightedLine(11)
      const currentVertex = queue.shift()!
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mark current vertex
      setVertices((prevVertices) => prevVertices.map((v) => (v.id === currentVertex ? { ...v, state: "current" } : v)))
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Get all adjacent vertices
      setHighlightedLine(15)
      for (const neighbor of adjacencyList[currentVertex]) {
        // Highlight the edge
        setEdges((prevEdges) =>
          prevEdges.map((e) => (e.from === currentVertex && e.to === neighbor ? { ...e, state: "highlighted" } : e)),
        )
        await new Promise((resolve) => setTimeout(resolve, 500))

        setHighlightedLine(16)
        if (!visited.has(neighbor)) {
          setHighlightedLine(17)
          visited.add(neighbor)
          await new Promise((resolve) => setTimeout(resolve, 500))

          // Mark neighbor as queued
          setVertices((prevVertices) => prevVertices.map((v) => (v.id === neighbor ? { ...v, state: "queued" } : v)))
          await new Promise((resolve) => setTimeout(resolve, 500))

          setHighlightedLine(18)
          queue.push(neighbor)
          await new Promise((resolve) => setTimeout(resolve, 300))

          setHighlightedLine(19)
          result.push(neighbor)
          setTraversalResult([...result])
          await new Promise((resolve) => setTimeout(resolve, 300))

          // Mark edge as traversed
          setEdges((prevEdges) =>
            prevEdges.map((e) => (e.from === currentVertex && e.to === neighbor ? { ...e, state: "traversed" } : e)),
          )
        } else {
          // Reset edge highlight if already visited
          setEdges((prevEdges) =>
            prevEdges.map((e) => (e.from === currentVertex && e.to === neighbor ? { ...e, state: "default" } : e)),
          )
        }
        await new Promise((resolve) => setTimeout(resolve, 300))
      }

      // Mark current vertex as visited (no longer current)
      setVertices((prevVertices) => prevVertices.map((v) => (v.id === currentVertex ? { ...v, state: "visited" } : v)))
      await new Promise((resolve) => setTimeout(resolve, 500))
    }

    setHighlightedLine(24)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOperation(null)
    setHighlightedLine(null)
    setStartVertexInput("")
    setMessage(`BFS traversal from "${startVertex}": ${result.join(" → ")}`)
  }

  const runDFS = async (startVertex: string) => {
    if (startVertex.trim() === "") {
      toast({
        title: "Error",
        description: "Please enter a start vertex",
        variant: "destructive",
      })
      return
    }

    // Check if start vertex exists
    if (!vertices.some((v) => v.id === startVertex)) {
      toast({
        title: "Error",
        description: `Start vertex "${startVertex}" does not exist`,
        variant: "destructive",
      })
      return
    }

    setOperation("dfs")
    setHighlightedLine(0)
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Reset all states
    setVertices((prevVertices) => prevVertices.map((v) => ({ ...v, state: "default" })))
    setEdges((prevEdges) => prevEdges.map((e) => ({ ...e, state: "default" })))
    setTraversalResult([])

    // Create a stack for DFS
    setHighlightedLine(2)
    const stack: string[] = [startVertex]
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create a set to store visited vertices
    setHighlightedLine(4)
    const visited = new Set<string>()
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Create an array to store the traversal order
    setHighlightedLine(6)
    const result: string[] = []
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Mark start vertex as stacked
    setVertices((prevVertices) => prevVertices.map((v) => (v.id === startVertex ? { ...v, state: "stacked" } : v)))
    await new Promise((resolve) => setTimeout(resolve, 500))

    // Build adjacency list
    const adjacencyList = buildAdjacencyList()

    // Loop until stack is empty
    setHighlightedLine(9)
    while (stack.length > 0) {
      // Pop a vertex from stack
      setHighlightedLine(11)
      const currentVertex = stack.pop()!
      await new Promise((resolve) => setTimeout(resolve, 500))

      // Mark current vertex
      setVertices((prevVertices) => prevVertices.map((v) => (v.id === currentVertex ? { ...v, state: "current" } : v)))
      await new Promise((resolve) => setTimeout(resolve, 500))

      // If the vertex is not visited yet
      setHighlightedLine(14)
      if (!visited.has(currentVertex)) {
        // Mark it as visited and add to result
        setHighlightedLine(16)
        visited.add(currentVertex)
        await new Promise((resolve) => setTimeout(resolve, 500))

        setHighlightedLine(17)
        result.push(currentVertex)
        setTraversalResult([...result])
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Mark vertex as visited
        setVertices((prevVertices) =>
          prevVertices.map((v) => (v.id === currentVertex ? { ...v, state: "visited" } : v)),
        )
        await new Promise((resolve) => setTimeout(resolve, 500))

        // Get all adjacent vertices of the popped vertex
        setHighlightedLine(20)
        const neighbors = [...adjacencyList[currentVertex]].reverse()
        await new Promise((resolve) => setTimeout(resolve, 500))

        setHighlightedLine(21)
        for (const neighbor of neighbors) {
          // Highlight the edge
          setEdges((prevEdges) =>
            prevEdges.map((e) => (e.from === currentVertex && e.to === neighbor ? { ...e, state: "highlighted" } : e)),
          )
          await new Promise((resolve) => setTimeout(resolve, 500))

          setHighlightedLine(22)
          if (!visited.has(neighbor)) {
            setHighlightedLine(23)
            stack.push(neighbor)
            await new Promise((resolve) => setTimeout(resolve, 300))

            // Mark neighbor as stacked
            setVertices((prevVertices) => prevVertices.map((v) => (v.id === neighbor ? { ...v, state: "stacked" } : v)))
            await new Promise((resolve) => setTimeout(resolve, 300))

            // Mark edge as traversed
            setEdges((prevEdges) =>
              prevEdges.map((e) => (e.from === currentVertex && e.to === neighbor ? { ...e, state: "traversed" } : e)),
            )
          } else {
            // Reset edge highlight if already visited
            setEdges((prevEdges) =>
              prevEdges.map((e) => (e.from === currentVertex && e.to === neighbor ? { ...e, state: "default" } : e)),
            )
          }
          await new Promise((resolve) => setTimeout(resolve, 300))
        }
      } else {
        // If already visited, just mark it as visited again
        setVertices((prevVertices) =>
          prevVertices.map((v) => (v.id === currentVertex ? { ...v, state: "visited" } : v)),
        )
        await new Promise((resolve) => setTimeout(resolve, 300))
      }
    }

    setHighlightedLine(30)
    await new Promise((resolve) => setTimeout(resolve, 500))

    setOperation(null)
    setHighlightedLine(null)
    setStartVertexInput("")
    setMessage(`DFS traversal from "${startVertex}": ${result.join(" → ")}`)
  }

  // Generate a sample graph
  const generateSampleGraph = () => {
    // Reset current graph
    setVertices([])
    setEdges([])
    setTraversalResult([])
    setMessage("")

    // Create vertices
    const sampleVertices: Vertex[] = [
      { id: "A", x: 100, y: 100, state: "default" },
      { id: "B", x: 250, y: 50, state: "default" },
      { id: "C", x: 400, y: 100, state: "default" },
      { id: "D", x: 100, y: 250, state: "default" },
      { id: "E", x: 250, y: 300, state: "default" },
      { id: "F", x: 400, y: 250, state: "default" },
    ]

    // Create edges
    const sampleEdges: Edge[] = [
      { from: "A", to: "B", state: "default" },
      { from: "A", to: "D", state: "default" },
      { from: "B", to: "C", state: "default" },
      { from: "B", to: "E", state: "default" },
      { from: "C", to: "F", state: "default" },
      { from: "D", to: "E", state: "default" },
      { from: "E", to: "F", state: "default" },
    ]

    // If undirected, add reverse edges
    if (!isDirected) {
      sampleEdges.push(
        { from: "B", to: "A", state: "default" },
        { from: "D", to: "A", state: "default" },
        { from: "C", to: "B", state: "default" },
        { from: "E", to: "B", state: "default" },
        { from: "F", to: "C", state: "default" },
        { from: "E", to: "D", state: "default" },
        { from: "F", to: "E", state: "default" },
      )
    }

    setVertices(sampleVertices)
    setEdges(sampleEdges)
    setMessage("Generated a sample graph")
  }

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="flex items-center gap-2">
          <Switch
            id="directed"
            checked={isDirected}
            onCheckedChange={(checked) => {
              setIsDirected(checked)
              // Update edges if changing between directed and undirected
              if (edges.length > 0) {
                if (checked) {
                  // Remove duplicate edges when switching to directed
                  const uniqueEdges = new Set<string>()
                  setEdges((prevEdges) => {
                    return prevEdges.filter((edge) => {
                      const edgeKey = `${edge.from}-${edge.to}`
                      if (uniqueEdges.has(edgeKey)) {
                        return false
                      }
                      uniqueEdges.add(edgeKey)
                      return true
                    })
                  })
                } else {
                  // Add reverse edges when switching to undirected
                  const newEdges: Edge[] = []
                  edges.forEach((edge) => {
                    if (!edges.some((e) => e.from === edge.to && e.to === edge.from)) {
                      newEdges.push({ from: edge.to, to: edge.from, state: "default" })
                    }
                  })
                  setEdges([...edges, ...newEdges])
                }
              }
            }}
          />
          <Label htmlFor="directed">Directed Graph</Label>
        </div>
        <Button onClick={generateSampleGraph} variant="outline">
          Generate Sample Graph
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-4">
          <div className="space-y-2">
            <h3 className="text-lg font-medium">Graph Modifications</h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Vertex ID"
                value={vertexIdInput}
                onChange={(e) => setVertexIdInput(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={() => {
                  if (vertexIdInput.trim() === "") {
                    toast({
                      title: "Error",
                      description: "Please enter a vertex ID",
                      variant: "destructive",
                    })
                    return
                  }

                  // Check if vertex already exists
                  if (vertices.some((v) => v.id === vertexIdInput)) {
                    toast({
                      title: "Error",
                      description: `Vertex "${vertexIdInput}" already exists`,
                      variant: "destructive",
                    })
                    return
                  }

                  setOperation("addVertex")
                  // Add the vertex at a random position if not clicking on canvas
                  const canvasWidth = canvasRef.current?.width || 600
                  const canvasHeight = canvasRef.current?.height || 400
                  addVertex(
                    vertexIdInput,
                    Math.random() * (canvasWidth - 100) + 50,
                    Math.random() * (canvasHeight - 100) + 50,
                  )
                }}
                disabled={operation !== null && operation !== "addVertex"}
              >
                Add Vertex
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Vertex ID"
                value={vertexIdInput}
                onChange={(e) => setVertexIdInput(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={() => removeVertex(vertexIdInput)}
                disabled={operation !== null && operation !== "removeVertex"}
              >
                Remove Vertex
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="From Vertex"
                value={fromVertexInput}
                onChange={(e) => setFromVertexInput(e.target.value)}
                className="w-full"
              />
              <Input
                type="text"
                placeholder="To Vertex"
                value={toVertexInput}
                onChange={(e) => setToVertexInput(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={() => addEdge(fromVertexInput, toVertexInput)}
                disabled={operation !== null && operation !== "addEdge"}
              >
                Add Edge
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="From Vertex"
                value={fromVertexInput}
                onChange={(e) => setFromVertexInput(e.target.value)}
                className="w-full"
              />
              <Input
                type="text"
                placeholder="To Vertex"
                value={toVertexInput}
                onChange={(e) => setToVertexInput(e.target.value)}
                className="w-full"
              />
              <Button
                onClick={() => removeEdge(fromVertexInput, toVertexInput)}
                disabled={operation !== null && operation !== "removeEdge"}
              >
                Remove Edge
              </Button>
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-lg font-medium">Traversal Algorithms</h3>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Start Vertex"
                value={startVertexInput}
                onChange={(e) => setStartVertexInput(e.target.value)}
                className="w-full"
              />
              <Button onClick={() => runBFS(startVertexInput)} disabled={operation !== null && operation !== "bfs"}>
                Run BFS
              </Button>
            </div>
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Start Vertex"
                value={startVertexInput}
                onChange={(e) => setStartVertexInput(e.target.value)}
                className="w-full"
              />
              <Button onClick={() => runDFS(startVertexInput)} disabled={operation !== null && operation !== "dfs"}>
                Run DFS
              </Button>
            </div>
          </div>

          {traversalResult.length > 0 && (
            <div className="p-2 bg-muted rounded-md text-sm">
              <strong>Traversal Result:</strong> {traversalResult.join(" → ")}
            </div>
          )}

          {message && <div className="p-2 bg-muted rounded-md text-sm">{message}</div>}

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
                <span className="text-sm">Visited</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-purple-100 border border-purple-500 rounded-sm"></div>
                <span className="text-sm">Current</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-blue-100 border border-blue-500 rounded-sm"></div>
                <span className="text-sm">Queued (BFS)</span>
              </div>
              <div className="flex items-center gap-1">
                <div className="w-4 h-4 bg-pink-100 border border-pink-500 rounded-sm"></div>
                <span className="text-sm">Stacked (DFS)</span>
              </div>
            </div>
          </div>
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">
              {operation === "addVertex"
                ? "Add Vertex"
                : operation === "removeVertex"
                  ? "Remove Vertex"
                  : operation === "addEdge"
                    ? "Add Edge"
                    : operation === "removeEdge"
                      ? "Remove Edge"
                      : operation === "bfs"
                        ? "Breadth-First Search"
                        : operation === "dfs"
                          ? "Depth-First Search"
                          : "Graph Operations"}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-auto h-64 font-mono text-sm">
              {(operation === "addVertex"
                ? addVertexCode
                : operation === "removeVertex"
                  ? removeVertexCode
                  : operation === "addEdge"
                    ? addEdgeCode
                    : operation === "removeEdge"
                      ? removeEdgeCode
                      : operation === "bfs"
                        ? bfsCode
                        : operation === "dfs"
                          ? dfsCode
                          : bfsCode
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
        <canvas
          ref={canvasRef}
          className="w-full h-full"
          onMouseDown={handleCanvasMouseDown}
          onMouseMove={handleCanvasMouseMove}
          onMouseUp={handleCanvasMouseUp}
          onMouseLeave={handleCanvasMouseUp}
        />
        {vertices.length === 0 ? (
          <div className="flex items-center justify-center h-full text-muted-foreground">
            Graph is empty. Add vertices and edges to visualize.
          </div>
        ) : null}
      </div>
    </div>
  )
}
