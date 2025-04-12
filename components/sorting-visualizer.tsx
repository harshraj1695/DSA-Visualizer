"use client"

import { useState, useEffect } from "react"
import { motion } from "framer-motion"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Play, Pause, RotateCcw, StepForward } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { toast } from "@/components/ui/use-toast"

type ArrayItem = {
  value: number
  state: "default" | "comparing" | "sorted" | "pivot" | "min" | "current"
}

export default function SortingVisualizer() {
  const [array, setArray] = useState<ArrayItem[]>([])
  const [algorithm, setAlgorithm] = useState<string>("bubble")
  const [isAnimating, setIsAnimating] = useState(false)
  const [animationSpeed, setAnimationSpeed] = useState(50)
  const [animationQueue, setAnimationQueue] = useState<ArrayItem[][]>([])
  const [currentStep, setCurrentStep] = useState(0)
  const [currentCode, setCurrentCode] = useState<string[]>([])
  const [highlightedLine, setHighlightedLine] = useState<number | null>(null)
  const [inputValue, setInputValue] = useState("")

  // Generate random array
  const generateArray = () => {
    const newArray: ArrayItem[] = []
    for (let i = 0; i < 10; i++) {
      newArray.push({
        value: Math.floor(Math.random() * 100) + 5,
        state: "default",
      })
    }
    setArray(newArray)
    setAnimationQueue([])
    setCurrentStep(0)
    setIsAnimating(false)
    updateCodeDisplay(algorithm)
  }

  // Parse user input array
  const parseUserArray = () => {
    try {
      const values = inputValue.split(",").map((val) => {
        const num = Number.parseInt(val.trim(), 10)
        if (isNaN(num)) {
          throw new Error(`Invalid number: ${val.trim()}`)
        }
        return num
      })

      if (values.length === 0) {
        toast({
          title: "Error",
          description: "Please enter at least one number",
          variant: "destructive",
        })
        return
      }

      const newArray: ArrayItem[] = values.map((value) => ({
        value,
        state: "default",
      }))

      setArray(newArray)
      setAnimationQueue([])
      setCurrentStep(0)
      setIsAnimating(false)
      updateCodeDisplay(algorithm)
    } catch (error) {
      toast({
        title: "Error",
        description: error.message || "Please enter valid comma-separated numbers",
        variant: "destructive",
      })
    }
  }

  // Initialize array on component mount
  useEffect(() => {
    generateArray()
  }, [])

  // Update code display when algorithm changes
  useEffect(() => {
    updateCodeDisplay(algorithm)
  }, [algorithm])

  const updateCodeDisplay = (algo: string) => {
    switch (algo) {
      case "bubble":
        setCurrentCode([
          "function bubbleSort(arr) {",
          "  for (let i = 0; i < arr.length; i++) {",
          "    for (let j = 0; j < arr.length - i - 1; j++) {",
          "      if (arr[j] > arr[j + 1]) {",
          "        // Swap elements",
          "        let temp = arr[j]",
          "        arr[j] = arr[j + 1]",
          "        arr[j + 1] = temp",
          "      }",
          "    }",
          "  }",
          "  return arr",
          "}",
        ])
        break
      case "selection":
        setCurrentCode([
          "function selectionSort(arr) {",
          "  for (let i = 0; i < arr.length; i++) {",
          "    // Find the minimum element in unsorted array",
          "    let minIdx = i;",
          "    for (let j = i + 1; j < arr.length; j++) {",
          "      if (arr[j] < arr[minIdx]) {",
          "        minIdx = j;",
          "      }",
          "    }",
          "    // Swap the found minimum element with the first element",
          "    if (minIdx !== i) {",
          "      let temp = arr[i];",
          "      arr[i] = arr[minIdx];",
          "      arr[minIdx] = temp;",
          "    }",
          "  }",
          "  return arr;",
          "}",
        ])
        break
      case "insertion":
        setCurrentCode([
          "function insertionSort(arr) {",
          "  for (let i = 1; i < arr.length; i++) {",
          "    // Store the current element to be compared",
          "    let current = arr[i];",
          "    let j = i - 1;",
          "    ",
          "    // Move elements greater than current",
          "    // to one position ahead of their current position",
          "    while (j >= 0 && arr[j] > current) {",
          "      arr[j + 1] = arr[j];",
          "      j--;",
          "    }",
          "    arr[j + 1] = current;",
          "  }",
          "  return arr;",
          "}",
        ])
        break
      case "merge":
        setCurrentCode([
          "function mergeSort(arr) {",
          "  if (arr.length <= 1) return arr;",
          "  ",
          "  // Split array into halves",
          "  const mid = Math.floor(arr.length / 2);",
          "  const left = arr.slice(0, mid);",
          "  const right = arr.slice(mid);",
          "  ",
          "  // Recursively sort both halves",
          "  return merge(mergeSort(left), mergeSort(right));",
          "}",
          "",
          "function merge(left, right) {",
          "  let result = [];",
          "  let leftIndex = 0;",
          "  let rightIndex = 0;",
          "  ",
          "  // Compare elements and merge them in sorted order",
          "  while (leftIndex < left.length && rightIndex < right.length) {",
          "    if (left[leftIndex] < right[rightIndex]) {",
          "      result.push(left[leftIndex]);",
          "      leftIndex++;",
          "    } else {",
          "      result.push(right[rightIndex]);",
          "      rightIndex++;",
          "    }",
          "  }",
          "  ",
          "  // Add remaining elements",
          "  return result",
          "    .concat(left.slice(leftIndex))",
          "    .concat(right.slice(rightIndex));",
          "}",
        ])
        break
      case "quick":
        setCurrentCode([
          "function quickSort(arr, low, high) {",
          "  if (low < high) {",
          "    // pi is partitioning index",
          "    let pi = partition(arr, low, high)",
          "",
          "    quickSort(arr, low, pi - 1)",
          "    quickSort(arr, pi + 1, high)",
          "  }",
          "}",
          "",
          "function partition(arr, low, high) {",
          "  // Pivot (Element to be placed at right position)",
          "  let pivot = arr[high]",
          "  let i = low - 1",
          "",
          "  for (let j = low; j < high; j++) {",
          "    if (arr[j] < pivot) {",
          "      i++",
          "      // Swap elements",
          "      let temp = arr[i]",
          "      arr[i] = arr[j]",
          "      arr[j] = temp",
          "    }",
          "  }",
          "",
          "  // Swap pivot element with element at i+1",
          "  let temp = arr[i + 1]",
          "  arr[i + 1] = arr[high]",
          "  arr[high] = temp",
          "",
          "  return i + 1",
          "}",
        ])
        break
      case "heap":
        setCurrentCode([
          "function heapSort(arr) {",
          "  const n = arr.length;",
          "  ",
          "  // Build max heap",
          "  for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {",
          "    heapify(arr, n, i);",
          "  }",
          "  ",
          "  // Extract elements from heap one by one",
          "  for (let i = n - 1; i > 0; i--) {",
          "    // Move current root to end",
          "    let temp = arr[0];",
          "    arr[0] = arr[i];",
          "    arr[i] = temp;",
          "    ",
          "    // Call max heapify on the reduced heap",
          "    heapify(arr, i, 0);",
          "  }",
          "  return arr;",
          "}",
          "",
          "function heapify(arr, n, i) {",
          "  let largest = i;      // Initialize largest as root",
          "  let left = 2 * i + 1; // Left child",
          "  let right = 2 * i + 2; // Right child",
          "  ",
          "  // If left child is larger than root",
          "  if (left < n && arr[left] > arr[largest]) {",
          "    largest = left;",
          "  }",
          "  ",
          "  // If right child is larger than largest so far",
          "  if (right < n && arr[right] > arr[largest]) {",
          "    largest = right;",
          "  }",
          "  ",
          "  // If largest is not root",
          "  if (largest !== i) {",
          "    let swap = arr[i];",
          "    arr[i] = arr[largest];",
          "    arr[largest] = swap;",
          "    ",
          "    // Recursively heapify the affected sub-tree",
          "    heapify(arr, n, largest);",
          "  }",
          "}",
        ])
        break
    }
    setHighlightedLine(null)
  }

  // Bubble Sort Algorithm with animation states
  const bubbleSort = () => {
    if (array.length <= 1) return { animations: [array], codeHighlights: [] }

    const animations: ArrayItem[][] = []
    const arrayCopy = JSON.parse(JSON.stringify(array))
    const codeHighlights: number[] = []

    // Reset all states to default
    for (let i = 0; i < arrayCopy.length; i++) {
      arrayCopy[i].state = "default"
    }
    animations.push(JSON.parse(JSON.stringify(arrayCopy)))

    for (let i = 0; i < arrayCopy.length; i++) {
      for (let j = 0; j < arrayCopy.length - i - 1; j++) {
        // Mark elements being compared
        arrayCopy[j].state = "comparing"
        arrayCopy[j + 1].state = "comparing"
        animations.push(JSON.parse(JSON.stringify(arrayCopy)))

        if (arrayCopy[j].value > arrayCopy[j + 1].value) {
          // Swap elements
          const temp = arrayCopy[j]
          arrayCopy[j] = arrayCopy[j + 1]
          arrayCopy[j + 1] = temp
          animations.push(JSON.parse(JSON.stringify(arrayCopy)))
        }

        // Reset comparison state
        arrayCopy[j].state = "default"
        arrayCopy[j + 1].state = "default"
        animations.push(JSON.parse(JSON.stringify(arrayCopy)))
      }

      // Mark sorted element
      arrayCopy[arrayCopy.length - i - 1].state = "sorted"
      animations.push(JSON.parse(JSON.stringify(arrayCopy)))
    }

    return { animations, codeHighlights }
  }

  // Selection Sort Algorithm with animation states
  const selectionSort = () => {
    if (array.length <= 1) return { animations: [array], codeHighlights: [] }

    const animations: ArrayItem[][] = []
    const arrayCopy = JSON.parse(JSON.stringify(array))
    const codeHighlights: number[] = []

    // Reset all states to default
    for (let i = 0; i < arrayCopy.length; i++) {
      arrayCopy[i].state = "default"
    }
    animations.push(JSON.parse(JSON.stringify(arrayCopy)))

    for (let i = 0; i < arrayCopy.length; i++) {
      // Mark current position
      arrayCopy[i].state = "current"
      animations.push(JSON.parse(JSON.stringify(arrayCopy)))

      let minIdx = i
      arrayCopy[minIdx].state = "min"
      animations.push(JSON.parse(JSON.stringify(arrayCopy)))

      for (let j = i + 1; j < arrayCopy.length; j++) {
        // Mark element being compared
        arrayCopy[j].state = "comparing"
        animations.push(JSON.parse(JSON.stringify(arrayCopy)))

        if (arrayCopy[j].value < arrayCopy[minIdx].value) {
          // Reset previous min
          if (minIdx !== i) {
            arrayCopy[minIdx].state = "default"
          }

          minIdx = j
          arrayCopy[minIdx].state = "min"
          animations.push(JSON.parse(JSON.stringify(arrayCopy)))
        }

        // Reset comparison state
        if (j !== minIdx) {
          arrayCopy[j].state = "default"
          animations.push(JSON.parse(JSON.stringify(arrayCopy)))
        }
      }

      // Swap the found minimum element with the first element
      if (minIdx !== i) {
        const temp = arrayCopy[i]
        arrayCopy[i] = arrayCopy[minIdx]
        arrayCopy[minIdx] = temp

        // Update states after swap
        arrayCopy[i].state = "current"
        arrayCopy[minIdx].state = "default"
        animations.push(JSON.parse(JSON.stringify(arrayCopy)))
      }

      // Mark as sorted
      arrayCopy[i].state = "sorted"
      animations.push(JSON.parse(JSON.stringify(arrayCopy)))
    }

    return { animations, codeHighlights }
  }

  // Insertion Sort Algorithm with animation states
  const insertionSort = () => {
    if (array.length <= 1) return { animations: [array], codeHighlights: [] }

    const animations: ArrayItem[][] = []
    const arrayCopy = JSON.parse(JSON.stringify(array))
    const codeHighlights: number[] = []

    // Reset all states to default
    for (let i = 0; i < arrayCopy.length; i++) {
      arrayCopy[i].state = "default"
    }

    // Mark first element as sorted
    arrayCopy[0].state = "sorted"
    animations.push(JSON.parse(JSON.stringify(arrayCopy)))

    for (let i = 1; i < arrayCopy.length; i++) {
      // Mark current element
      arrayCopy[i].state = "current"
      animations.push(JSON.parse(JSON.stringify(arrayCopy)))

      const current = arrayCopy[i]
      let j = i - 1

      while (j >= 0 && arrayCopy[j].value > current.value) {
        // Mark element being compared
        arrayCopy[j].state = "comparing"
        animations.push(JSON.parse(JSON.stringify(arrayCopy)))

        // Shift element to the right
        arrayCopy[j + 1] = arrayCopy[j]
        arrayCopy[j + 1].state = "default"
        j--

        animations.push(JSON.parse(JSON.stringify(arrayCopy)))

        // Reset comparison state
        if (j + 1 < arrayCopy.length) {
          arrayCopy[j + 1].state = "sorted"
        }
      }

      // Place current element at its correct position
      arrayCopy[j + 1] = current
      arrayCopy[j + 1].state = "sorted"
      animations.push(JSON.parse(JSON.stringify(arrayCopy)))
    }

    return { animations, codeHighlights }
  }

  // Merge Sort Algorithm with animation states
  const mergeSort = () => {
    if (array.length <= 1) return { animations: [array], codeHighlights: [] }

    const animations: ArrayItem[][] = []
    const arrayCopy = JSON.parse(JSON.stringify(array))
    const codeHighlights: number[] = []

    // Reset all states to default
    for (let i = 0; i < arrayCopy.length; i++) {
      arrayCopy[i].state = "default"
    }
    animations.push(JSON.parse(JSON.stringify(arrayCopy)))

    // Helper function to merge two subarrays
    const merge = (arr: ArrayItem[], start: number, mid: number, end: number) => {
      const leftSize = mid - start + 1
      const rightSize = end - mid

      // Create temporary arrays
      const leftArray: ArrayItem[] = []
      const rightArray: ArrayItem[] = []

      // Copy data to temporary arrays
      for (let i = 0; i < leftSize; i++) {
        leftArray[i] = JSON.parse(JSON.stringify(arr[start + i]))
        leftArray[i].state = "comparing"
      }

      for (let i = 0; i < rightSize; i++) {
        rightArray[i] = JSON.parse(JSON.stringify(arr[mid + 1 + i]))
        rightArray[i].state = "comparing"
      }

      // Show the subarrays being merged
      for (let i = start; i <= end; i++) {
        arr[i].state = "comparing"
      }
      animations.push(JSON.parse(JSON.stringify(arr)))

      // Merge the temporary arrays back
      let i = 0,
        j = 0,
        k = start

      while (i < leftSize && j < rightSize) {
        if (leftArray[i].value <= rightArray[j].value) {
          arr[k] = JSON.parse(JSON.stringify(leftArray[i]))
          i++
        } else {
          arr[k] = JSON.parse(JSON.stringify(rightArray[j]))
          j++
        }
        arr[k].state = "current"
        animations.push(JSON.parse(JSON.stringify(arr)))
        k++
      }

      // Copy remaining elements of leftArray if any
      while (i < leftSize) {
        arr[k] = JSON.parse(JSON.stringify(leftArray[i]))
        arr[k].state = "current"
        animations.push(JSON.parse(JSON.stringify(arr)))
        i++
        k++
      }

      // Copy remaining elements of rightArray if any
      while (j < rightSize) {
        arr[k] = JSON.parse(JSON.stringify(rightArray[j]))
        arr[k].state = "current"
        animations.push(JSON.parse(JSON.stringify(arr)))
        j++
        k++
      }

      // Mark the merged subarray as sorted
      for (let i = start; i <= end; i++) {
        arr[i].state = "sorted"
      }
      animations.push(JSON.parse(JSON.stringify(arr)))
    }

    // Helper function for merge sort
    const mergeSortHelper = (arr: ArrayItem[], start: number, end: number) => {
      if (start < end) {
        const mid = Math.floor((start + end) / 2)

        // Sort first and second halves
        mergeSortHelper(arr, start, mid)
        mergeSortHelper(arr, mid + 1, end)

        // Merge the sorted halves
        merge(arr, start, mid, end)
      } else if (start === end) {
        // Single element is already sorted
        arr[start].state = "sorted"
        animations.push(JSON.parse(JSON.stringify(arr)))
      }
    }

    mergeSortHelper(arrayCopy, 0, arrayCopy.length - 1)

    return { animations, codeHighlights }
  }

  // Quick Sort Algorithm with animation states
  const quickSort = () => {
    if (array.length <= 1) return { animations: [array], codeHighlights: [] }

    const animations: ArrayItem[][] = []
    const arrayCopy = JSON.parse(JSON.stringify(array))
    const codeHighlights: number[] = []

    // Reset all states to default
    for (let i = 0; i < arrayCopy.length; i++) {
      arrayCopy[i].state = "default"
    }
    animations.push(JSON.parse(JSON.stringify(arrayCopy)))

    const partition = (arr: ArrayItem[], low: number, high: number) => {
      // Mark pivot
      arr[high].state = "pivot"
      animations.push(JSON.parse(JSON.stringify(arr)))

      let i = low - 1

      for (let j = low; j < high; j++) {
        // Mark elements being compared
        arr[j].state = "comparing"
        animations.push(JSON.parse(JSON.stringify(arr)))

        if (arr[j].value < arr[high].value) {
          i++

          // Swap elements
          if (i !== j) {
            const temp = arr[i]
            arr[i] = arr[j]
            arr[j] = temp
            animations.push(JSON.parse(JSON.stringify(arr)))
          }
        }

        // Reset comparison state
        arr[j].state = "default"
        animations.push(JSON.parse(JSON.stringify(arr)))
      }

      // Swap pivot to its correct position
      const pivotPos = i + 1
      const temp = arr[pivotPos]
      arr[pivotPos] = arr[high]
      arr[high] = temp

      // Mark pivot as sorted
      arr[pivotPos].state = "sorted"
      arr[high].state = "default"
      animations.push(JSON.parse(JSON.stringify(arr)))

      return pivotPos
    }

    const quickSortHelper = (arr: ArrayItem[], low: number, high: number) => {
      if (low < high) {
        // Get partition index
        const pi = partition(arr, low, high)

        // Recursively sort elements before and after partition
        quickSortHelper(arr, low, pi - 1)
        quickSortHelper(arr, pi + 1, high)
      } else if (low === high && low >= 0 && high < arr.length) {
        // Single element is already sorted
        arr[low].state = "sorted"
        animations.push(JSON.parse(JSON.stringify(arr)))
      }
    }

    quickSortHelper(arrayCopy, 0, arrayCopy.length - 1)

    return { animations, codeHighlights }
  }

  // Heap Sort Algorithm with animation states
  const heapSort = () => {
    if (array.length <= 1) return { animations: [array], codeHighlights: [] }

    const animations: ArrayItem[][] = []
    const arrayCopy = JSON.parse(JSON.stringify(array))
    const codeHighlights: number[] = []

    // Reset all states to default
    for (let i = 0; i < arrayCopy.length; i++) {
      arrayCopy[i].state = "default"
    }
    animations.push(JSON.parse(JSON.stringify(arrayCopy)))

    const heapify = (arr: ArrayItem[], n: number, i: number) => {
      let largest = i
      const left = 2 * i + 1
      const right = 2 * i + 2

      // Mark current node
      arr[i].state = "current"
      animations.push(JSON.parse(JSON.stringify(arr)))

      // Compare with left child
      if (left < n) {
        arr[left].state = "comparing"
        animations.push(JSON.parse(JSON.stringify(arr)))

        if (arr[left].value > arr[largest].value) {
          // Reset previous largest
          arr[largest].state = "default"
          largest = left
          arr[largest].state = "min" // Using min state for largest
          animations.push(JSON.parse(JSON.stringify(arr)))
        } else {
          arr[left].state = "default"
          animations.push(JSON.parse(JSON.stringify(arr)))
        }
      }

      // Compare with right child
      if (right < n) {
        arr[right].state = "comparing"
        animations.push(JSON.parse(JSON.stringify(arr)))

        if (arr[right].value > arr[largest].value) {
          // Reset previous largest
          arr[largest].state = "default"
          largest = right
          arr[largest].state = "min" // Using min state for largest
          animations.push(JSON.parse(JSON.stringify(arr)))
        } else {
          arr[right].state = "default"
          animations.push(JSON.parse(JSON.stringify(arr)))
        }
      }

      // If largest is not root
      if (largest !== i) {
        // Swap
        const temp = arr[i]
        arr[i] = arr[largest]
        arr[largest] = temp

        // Update states after swap
        arr[i].state = "current"
        arr[largest].state = "default"
        animations.push(JSON.parse(JSON.stringify(arr)))

        // Recursively heapify the affected sub-tree
        heapify(arr, n, largest)
      }

      // Reset states
      arr[i].state = "default"
      animations.push(JSON.parse(JSON.stringify(arr)))
    }

    const n = arrayCopy.length

    // Build max heap
    for (let i = Math.floor(n / 2) - 1; i >= 0; i--) {
      heapify(arrayCopy, n, i)
    }

    // Extract elements from heap one by one
    for (let i = n - 1; i > 0; i--) {
      // Move current root to end
      arrayCopy[0].state = "current"
      arrayCopy[i].state = "comparing"
      animations.push(JSON.parse(JSON.stringify(arrayCopy)))

      // Swap
      const temp = arrayCopy[0]
      arrayCopy[0] = arrayCopy[i]
      arrayCopy[i] = temp

      // Mark as sorted
      arrayCopy[i].state = "sorted"
      arrayCopy[0].state = "default"
      animations.push(JSON.parse(JSON.stringify(arrayCopy)))

      // Call max heapify on the reduced heap
      heapify(arrayCopy, i, 0)
    }

    // Mark the first element as sorted
    arrayCopy[0].state = "sorted"
    animations.push(JSON.parse(JSON.stringify(arrayCopy)))

    return { animations, codeHighlights }
  }

  // Start sorting animation
  const startSorting = () => {
    let result: { animations: ArrayItem[][]; codeHighlights: number[] } = { animations: [], codeHighlights: [] }

    switch (algorithm) {
      case "bubble":
        result = bubbleSort()
        break
      case "selection":
        result = selectionSort()
        break
      case "insertion":
        result = insertionSort()
        break
      case "merge":
        result = mergeSort()
        break
      case "quick":
        result = quickSort()
        break
      case "heap":
        result = heapSort()
        break
    }

    if (result.animations.length > 0) {
      setAnimationQueue(result.animations)
      setCurrentStep(0)
      setIsAnimating(true)
    }
  }

  // Step through animation
  const stepAnimation = () => {
    if (currentStep < animationQueue.length) {
      setArray(animationQueue[currentStep])

      // Update highlighted code line based on algorithm and current step
      updateHighlightedLine()

      setCurrentStep(currentStep + 1)
    } else {
      setIsAnimating(false)
      setHighlightedLine(null)
    }
  }

  // Update highlighted code line based on algorithm and current step
  const updateHighlightedLine = () => {
    switch (algorithm) {
      case "bubble":
        const bubbleStep = currentStep % 3
        if (bubbleStep === 0)
          setHighlightedLine(3) // Comparison
        else if (bubbleStep === 1)
          setHighlightedLine(5) // Swap
        else setHighlightedLine(2) // Next iteration
        break
      case "selection":
        const selectionStep = currentStep % 4
        if (selectionStep === 0)
          setHighlightedLine(3) // Find min
        else if (selectionStep === 1)
          setHighlightedLine(6) // Compare
        else if (selectionStep === 2)
          setHighlightedLine(11) // Swap
        else setHighlightedLine(2) // Next iteration
        break
      case "insertion":
        const insertionStep = currentStep % 3
        if (insertionStep === 0)
          setHighlightedLine(3) // Current element
        else if (insertionStep === 1)
          setHighlightedLine(8) // Compare and shift
        else setHighlightedLine(12) // Place element
        break
      case "merge":
        const mergeStep = currentStep % 4
        if (mergeStep === 0)
          setHighlightedLine(4) // Split array
        else if (mergeStep === 1)
          setHighlightedLine(9) // Recursively sort
        else if (mergeStep === 2)
          setHighlightedLine(18) // Compare and merge
        else setHighlightedLine(27) // Add remaining elements
        break
      case "quick":
        const quickStep = currentStep % 4
        if (quickStep === 0)
          setHighlightedLine(11) // Choose pivot
        else if (quickStep === 1)
          setHighlightedLine(15) // Compare with pivot
        else if (quickStep === 2)
          setHighlightedLine(22) // Swap pivot
        else setHighlightedLine(3) // Partition
        break
      case "heap":
        const heapStep = currentStep % 4
        if (heapStep === 0)
          setHighlightedLine(5) // Build heap
        else if (heapStep === 1)
          setHighlightedLine(10) // Extract elements
        else if (heapStep === 2)
          setHighlightedLine(15) // Swap root to end
        else setHighlightedLine(25) // Heapify
        break
    }
  }

  // Play/pause animation
  useEffect(() => {
    let animationTimer: NodeJS.Timeout

    if (isAnimating && currentStep < animationQueue.length) {
      animationTimer = setTimeout(
        () => {
          setArray(animationQueue[currentStep])

          // Update highlighted code line
          updateHighlightedLine()

          setCurrentStep(currentStep + 1)
        },
        1000 - animationSpeed * 9,
      )
    } else if (currentStep >= animationQueue.length) {
      setIsAnimating(false)
      setHighlightedLine(null)
    }

    return () => clearTimeout(animationTimer)
  }, [isAnimating, currentStep, animationQueue, animationSpeed, algorithm])

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex gap-2">
          <Select value={algorithm} onValueChange={setAlgorithm}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select Algorithm" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bubble">Bubble Sort</SelectItem>
              <SelectItem value="selection">Selection Sort</SelectItem>
              <SelectItem value="insertion">Insertion Sort</SelectItem>
              <SelectItem value="merge">Merge Sort</SelectItem>
              <SelectItem value="quick">Quick Sort</SelectItem>
              <SelectItem value="heap">Heap Sort</SelectItem>
            </SelectContent>
          </Select>
          <Button onClick={generateArray}>Random Array</Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant="outline"
            size="icon"
            onClick={() => setIsAnimating(!isAnimating)}
            disabled={animationQueue.length === 0 || currentStep >= animationQueue.length}
          >
            {isAnimating ? <Pause className="h-4 w-4" /> : <Play className="h-4 w-4" />}
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={stepAnimation}
            disabled={animationQueue.length === 0 || currentStep >= animationQueue.length}
          >
            <StepForward className="h-4 w-4" />
          </Button>
          <Button
            variant="outline"
            size="icon"
            onClick={() => {
              setCurrentStep(0)
              setIsAnimating(false)
              setArray(array.map((item) => ({ ...item, state: "default" })))
              setHighlightedLine(null)
            }}
            disabled={animationQueue.length === 0}
          >
            <RotateCcw className="h-4 w-4" />
          </Button>
          <div className="flex items-center gap-2">
            <span className="text-sm">Speed:</span>
            <Slider
              value={[animationSpeed]}
              onValueChange={(value) => setAnimationSpeed(value[0])}
              min={1}
              max={100}
              step={1}
              className="w-24"
            />
          </div>
        </div>
      </div>

      <div className="flex flex-col gap-4">
        <div className="flex flex-col md:flex-row gap-4 items-center">
          <Input
            type="text"
            placeholder="Enter comma-separated numbers (e.g., 64, 34, 25, 12, 22, 11, 90)"
            value={inputValue}
            onChange={(e) => setInputValue(e.target.value)}
            className="flex-grow"
          />
          <Button onClick={parseUserArray}>Set Array</Button>
        </div>

        <div className="flex justify-center">
          <Button onClick={startSorting} disabled={isAnimating || array.length <= 1}>
            Start Sorting
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="border rounded-md p-4 bg-muted/20 min-h-[300px] flex flex-wrap items-center justify-center gap-4">
          {array.map((item, index) => (
            <motion.div
              key={index}
              className={`w-16 h-16 flex items-center justify-center text-lg font-medium border-2 rounded-md ${
                item.state === "comparing"
                  ? "bg-yellow-100 border-yellow-500 dark:bg-yellow-900/30"
                  : item.state === "sorted"
                    ? "bg-green-100 border-green-500 dark:bg-green-900/30"
                    : item.state === "pivot"
                      ? "bg-purple-100 border-purple-500 dark:bg-purple-900/30"
                      : item.state === "min"
                        ? "bg-blue-100 border-blue-500 dark:bg-blue-900/30"
                        : item.state === "current"
                          ? "bg-orange-100 border-orange-500 dark:bg-orange-900/30"
                          : "bg-card border-muted-foreground/20"
              }`}
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.3 }}
            >
              {item.value}
            </motion.div>
          ))}
          {array.length === 0 && (
            <div className="text-muted-foreground">No array data. Please enter values or generate a random array.</div>
          )}
        </div>

        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-lg">Algorithm Code</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-muted p-4 rounded-md overflow-auto h-64 font-mono text-sm">
              {currentCode.map((line, index) => (
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

      <div className="mt-4">
        <h3 className="font-medium mb-2">Color Legend:</h3>
        <div className="flex flex-wrap gap-4">
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-card border border-muted-foreground/20 rounded-sm"></div>
            <span className="text-sm">Default</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-yellow-100 border border-yellow-500 dark:bg-yellow-900/30 rounded-sm"></div>
            <span className="text-sm">Comparing</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-purple-100 border border-purple-500 dark:bg-purple-900/30 rounded-sm"></div>
            <span className="text-sm">Pivot</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-blue-100 border border-blue-500 dark:bg-blue-900/30 rounded-sm"></div>
            <span className="text-sm">Min/Max</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-orange-100 border border-orange-500 dark:bg-orange-900/30 rounded-sm"></div>
            <span className="text-sm">Current</span>
          </div>
          <div className="flex items-center gap-1">
            <div className="w-4 h-4 bg-green-100 border border-green-500 dark:bg-green-900/30 rounded-sm"></div>
            <span className="text-sm">Sorted</span>
          </div>
        </div>
      </div>
    </div>
  )
}
