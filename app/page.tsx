"use client"

import { useState } from "react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { motion } from "framer-motion"
import SortingVisualizer from "@/components/sorting-visualizer"
import StackVisualizer from "@/components/stack-visualizer"
import QueueVisualizer from "@/components/queue-visualizer"
import TreeVisualizer from "@/components/tree-visualizer"
import LinkedListVisualizer from "@/components/linked-list-visualizer"
import GraphVisualizer from "@/components/graph-visualizer"
import HeapVisualizer from "@/components/heap-visualizer"
import AIAssistant from "@/components/ai-assistant"

export default function Home() {
  const [activeTab, setActiveTab] = useState("sorting")

  const tabInfo = {
    sorting: {
      title: "Sorting Algorithms",
      description: "Visualize and understand how different sorting algorithms work with step-by-step animations.",
      icon: "📊",
    },
    stack: {
      title: "Stack",
      description: "Explore the Last-In-First-Out (LIFO) data structure with push and pop operations.",
      icon: "📚",
    },
    queue: {
      title: "Queue",
      description: "Learn about the First-In-First-Out (FIFO) data structure with enqueue and dequeue operations.",
      icon: "🔄",
    },
    linkedlist: {
      title: "Linked List",
      description: "Visualize operations on singly linked lists including insertion, deletion, and traversal.",
      icon: "🔗",
    },
    tree: {
      title: "Tree Structures",
      description: "Explore binary search trees and binary trees with various traversal methods.",
      icon: "🌳",
    },
    graph: {
      title: "Graph",
      description: "Understand graph representations and algorithms like BFS and DFS.",
      icon: "🕸️",
    },
    heap: {
      title: "Heap",
      description: "Visualize min and max heaps with operations like insertion, deletion, and heapify.",
      icon: "🔺",
    },
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

        <div className="mb-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white dark:bg-gray-800 rounded-xl shadow-xl p-6 mb-8"
          >
            <div className="flex items-center mb-4">
              <div className="text-3xl mr-4">{tabInfo[activeTab as keyof typeof tabInfo].icon}</div>
              <div>
                <h2 className="text-2xl font-bold text-gray-800 dark:text-white">
                  {tabInfo[activeTab as keyof typeof tabInfo].title}
                </h2>
                <p className="text-gray-600 dark:text-gray-400">
                  {tabInfo[activeTab as keyof typeof tabInfo].description}
                </p>
              </div>
            </div>
          </motion.div>

          <Tabs defaultValue="sorting" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-2 md:grid-cols-4 lg:grid-cols-7 bg-indigo-50 dark:bg-gray-800 rounded-xl p-1">
              <TabsTrigger
                value="sorting"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                Sorting
              </TabsTrigger>
              <TabsTrigger value="stack" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                Stack
              </TabsTrigger>
              <TabsTrigger value="queue" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                Queue
              </TabsTrigger>
              <TabsTrigger
                value="linkedlist"
                className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700"
              >
                Linked List
              </TabsTrigger>
              <TabsTrigger value="tree" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
                Tree
              </TabsTrigger>
              <TabsTrigger value="graph" className="data-[state=active]:bg-white dark:data-[state=active]:bg-gray-700">
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
