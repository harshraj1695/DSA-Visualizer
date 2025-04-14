"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import { ArrowRight, Clock, HardDrive } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import SortingVisualizer from "@/components/sorting-visualizer"
import StackVisualizer from "@/components/stack-visualizer"
import QueueVisualizer from "@/components/queue-visualizer"
import TreeVisualizer from "@/components/tree-visualizer"
import LinkedListVisualizer from "@/components/linked-list-visualizer"
import GraphVisualizer from "@/components/graph-visualizer"
import HeapVisualizer from "@/components/heap-visualizer"
import AIAssistant from "@/components/ai-assistant"

export default function Home() {
  const [activeTab, setActiveTab] = useState<string | null>(null)
  const [showLanding, setShowLanding] = useState(true)

  // Data structures and algorithms information
  const dsaInfo = [
    {
      id: "sorting",
      title: "Sorting Algorithms",
      description: "Algorithms that put elements in a certain order, typically in numerical or lexicographical order.",
      icon: "📊",
      algorithms: [
        { name: "Bubble Sort", timeComplexity: "O(n²)", spaceComplexity: "O(1)" },
        { name: "Selection Sort", timeComplexity: "O(n²)", spaceComplexity: "O(1)" },
        { name: "Insertion Sort", timeComplexity: "O(n²)", spaceComplexity: "O(1)" },
        { name: "Merge Sort", timeComplexity: "O(n log n)", spaceComplexity: "O(n)" },
        { name: "Quick Sort", timeComplexity: "O(n log n)", spaceComplexity: "O(log n)" },
        { name: "Heap Sort", timeComplexity: "O(n log n)", spaceComplexity: "O(1)" },
      ],
    },
    {
      id: "stack",
      title: "Stack",
      description: "A linear data structure that follows the Last-In-First-Out (LIFO) principle.",
      icon: "📚",
      operations: [
        { name: "Push", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
        { name: "Pop", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
        { name: "Peek", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
      ],
    },
    {
      id: "queue",
      title: "Queue",
      description: "A linear data structure that follows the First-In-First-Out (FIFO) principle.",
      icon: "🔄",
      operations: [
        { name: "Enqueue", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
        { name: "Dequeue", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
        { name: "Peek", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
      ],
    },
    {
      id: "linkedlist",
      title: "Linked List",
      description: "A linear data structure where elements are stored in nodes, each pointing to the next node.",
      icon: "🔗",
      operations: [
        { name: "Insert (beginning)", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
        { name: "Insert (end)", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
        { name: "Delete", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
        { name: "Search", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
      ],
    },
    {
      id: "tree",
      title: "Tree Structures",
      description: "Hierarchical data structures with a root value and subtrees of children with a parent node.",
      icon: "🌳",
      types: [
        { name: "Binary Search Tree", operations: "Insert, Delete, Search", timeComplexity: "O(log n) to O(n)" },
        { name: "Binary Tree", operations: "Insert, Traversal", timeComplexity: "O(n)" },
      ],
    },
    {
      id: "graph",
      title: "Graph",
      description: "A non-linear data structure consisting of nodes and edges connecting these nodes.",
      icon: "🕸️",
      algorithms: [
        { name: "BFS", timeComplexity: "O(V + E)", spaceComplexity: "O(V)" },
        { name: "DFS", timeComplexity: "O(V + E)", spaceComplexity: "O(V)" },
      ],
    },
    {
      id: "heap",
      title: "Heap",
      description: "A specialized tree-based data structure that satisfies the heap property.",
      icon: "🔺",
      operations: [
        { name: "Insert", timeComplexity: "O(log n)", spaceComplexity: "O(1)" },
        { name: "Delete", timeComplexity: "O(log n)", spaceComplexity: "O(1)" },
        { name: "Heapify", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
        { name: "Heap Sort", timeComplexity: "O(n log n)", spaceComplexity: "O(1)" },
      ],
    },
  ]

  // Add a new entry for doubly linked list in the dsaInfo array after the linkedlist entry

  // Find the linkedlist entry in dsaInfo array
  const linkedListIndex = dsaInfo.findIndex((item) => item.id === "linkedlist")

  // Add the new doubly linked list entry after the linkedlist entry
  dsaInfo.splice(linkedListIndex + 1, 0, {
    id: "doublylinkedlist",
    title: "Doubly Linked List",
    description:
      "A linear data structure where each node contains data and pointers to both the next and previous nodes.",
    icon: "🔄",
    operations: [
      { name: "Insert (beginning)", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
      { name: "Insert (end)", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
      { name: "Delete (any position)", timeComplexity: "O(1)", spaceComplexity: "O(1)" },
      { name: "Search", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
      { name: "Reverse", timeComplexity: "O(n)", spaceComplexity: "O(1)" },
    ],
  })

  const handleVisualize = (tabId: string) => {
    setActiveTab(tabId)
    setShowLanding(false)
  }

  const handleBackToLanding = () => {
    setActiveTab(null)
    setShowLanding(true)
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-indigo-50 to-white dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto py-8 px-4">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="text-center mb-12"
        >
          <h1 className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent mb-4">
            Data Structures & Algorithms Visualizer
          </h1>
          <p className="text-gray-600 dark:text-gray-400 max-w-2xl mx-auto text-lg">
            Interactive visualizations to help you understand complex algorithms and data structures
          </p>
        </motion.div>

        {showLanding ? (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            {dsaInfo.map((item, index) => (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 + index * 0.1 }}
              >
                <Card className="h-full flex flex-col hover:shadow-lg transition-shadow duration-300">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div className="text-3xl">{item.icon}</div>
                      <Badge variant="outline" className="text-xs">
                        Data Structure
                      </Badge>
                    </div>
                    <CardTitle className="text-xl mt-2">{item.title}</CardTitle>
                    <CardDescription>{item.description}</CardDescription>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {item.algorithms && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Algorithms:</h4>
                        <ul className="space-y-1">
                          {item.algorithms.map((algo) => (
                            <li key={algo.name} className="text-sm">
                              <div className="flex justify-between">
                                <span>{algo.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {algo.timeComplexity}
                                  </span>
                                  <span className="flex items-center text-xs text-muted-foreground">
                                    <HardDrive className="h-3 w-3 mr-1" />
                                    {algo.spaceComplexity}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.operations && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Operations:</h4>
                        <ul className="space-y-1">
                          {item.operations.map((op) => (
                            <li key={op.name} className="text-sm">
                              <div className="flex justify-between">
                                <span>{op.name}</span>
                                <div className="flex items-center gap-2">
                                  <span className="flex items-center text-xs text-muted-foreground">
                                    <Clock className="h-3 w-3 mr-1" />
                                    {op.timeComplexity}
                                  </span>
                                  <span className="flex items-center text-xs text-muted-foreground">
                                    <HardDrive className="h-3 w-3 mr-1" />
                                    {op.spaceComplexity}
                                  </span>
                                </div>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}

                    {item.types && (
                      <div className="space-y-2">
                        <h4 className="text-sm font-medium text-muted-foreground">Types:</h4>
                        <ul className="space-y-1">
                          {item.types.map((type) => (
                            <li key={type.name} className="text-sm">
                              <div className="flex flex-col">
                                <span className="font-medium">{type.name}</span>
                                <span className="text-xs text-muted-foreground">{type.operations}</span>
                                <span className="text-xs text-muted-foreground flex items-center">
                                  <Clock className="h-3 w-3 mr-1" />
                                  {type.timeComplexity}
                                </span>
                              </div>
                            </li>
                          ))}
                        </ul>
                      </div>
                    )}
                  </CardContent>
                  <CardFooter>
                    <Button className="w-full" onClick={() => handleVisualize(item.id)} variant="default">
                      Visualize <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <div className="mb-8">
            <div className="flex justify-between items-center mb-6">
              <Button variant="outline" onClick={handleBackToLanding}>
                ← Back to Learning Portal
              </Button>
              <div className="text-xl font-bold">{dsaInfo.find((item) => item.id === activeTab)?.title}</div>
              <div className="w-[100px]"></div> {/* Spacer for alignment */}
            </div>

            <Tabs value={activeTab || "sorting"} onValueChange={setActiveTab} className="w-full">
              <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 bg-indigo-50 dark:bg-gray-800 rounded-xl p-1">
                <TabsTrigger
                  value="sorting"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Sorting
                </TabsTrigger>
                <TabsTrigger
                  value="stack"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Stack
                </TabsTrigger>
                <TabsTrigger
                  value="queue"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Queue
                </TabsTrigger>
                <TabsTrigger
                  value="linkedlist"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Linked List
                </TabsTrigger>
                {/* Add a new TabsTrigger for doubly linked list in the Tabs component */}
                {/* Find the TabsList component and add a new TabsTrigger after the linkedlist TabsTrigger */}
                <TabsTrigger
                  value="doublylinkedlist"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Doubly Linked List
                </TabsTrigger>
                <TabsTrigger value="tree" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                  Tree
                </TabsTrigger>
                <TabsTrigger
                  value="graph"
                  className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
                >
                  Graph
                </TabsTrigger>
                <TabsTrigger value="heap" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                  Heap
                </TabsTrigger>
              </TabsList>

              <div className="mt-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6">
                <TabsContent value="sorting" className="mt-0">
                  <SortingVisualizer />
                </TabsContent>
                <TabsContent value="stack" className="mt-0">
                  <StackVisualizer />
                </TabsContent>
                <TabsContent value="queue" className="mt-0">
                  <QueueVisualizer />
                </TabsContent>
                <TabsContent value="linkedlist" className="mt-0">
                  <LinkedListVisualizer />
                </TabsContent>
                {/* Add a new TabsContent for doubly linked list */}
                {/* Find the TabsContent components and add a new one after the linkedlist TabsContent */}
                <TabsContent value="doublylinkedlist" className="mt-0">
                  <LinkedListVisualizer isDoublyLinked={true} />
                </TabsContent>
                <TabsContent value="tree" className="mt-0">
                  <TreeVisualizer />
                </TabsContent>
                <TabsContent value="graph" className="mt-0">
                  <GraphVisualizer />
                </TabsContent>
                <TabsContent value="heap" className="mt-0">
                  <HeapVisualizer />
                </TabsContent>
              </div>
            </Tabs>
          </div>
        )}

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="text-center text-sm text-gray-500 dark:text-gray-400 mt-12"
        >
          <p>Created for educational purposes. Need help? Click the assistant button in the bottom right.</p>
        </motion.div>
      </div>

      <AIAssistant />
    </div>
  )
}
