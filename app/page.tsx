"use client"

import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import SortingVisualizer from "@/components/sorting-visualizer"
import StackVisualizer from "@/components/stack-visualizer"
import QueueVisualizer from "@/components/queue-visualizer"
import TreeVisualizer from "@/components/tree-visualizer"
import LinkedListVisualizer from "@/components/linked-list-visualizer"
import GraphVisualizer from "@/components/graph-visualizer"

export default function Home() {
  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-center mb-8">Data Structures & Algorithms Visualizer</h1>

      <Tabs defaultValue="sorting" className="w-full">
        <TabsList className="grid w-full grid-cols-1 md:grid-cols-2 lg:grid-cols-6">
          <TabsTrigger value="sorting">Sorting Algorithms</TabsTrigger>
          <TabsTrigger value="stack">Stack</TabsTrigger>
          <TabsTrigger value="queue">Queue</TabsTrigger>
          <TabsTrigger value="linkedlist">Linked List</TabsTrigger>
          <TabsTrigger value="tree">Tree Structures</TabsTrigger>
          <TabsTrigger value="graph">Graph</TabsTrigger>
        </TabsList>
        <TabsContent value="sorting" className="mt-6">
          <SortingVisualizer />
        </TabsContent>
        <TabsContent value="stack" className="mt-6">
          <StackVisualizer />
        </TabsContent>
        <TabsContent value="queue" className="mt-6">
          <QueueVisualizer />
        </TabsContent>
        <TabsContent value="linkedlist" className="mt-6">
          <LinkedListVisualizer />
        </TabsContent>
        <TabsContent value="tree" className="mt-6">
          <TreeVisualizer />
        </TabsContent>
        <TabsContent value="graph" className="mt-6">
          <GraphVisualizer />
        </TabsContent>
      </Tabs>
    </div>
  )
}

