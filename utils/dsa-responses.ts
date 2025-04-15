// Common DSA algorithm and data structure explanations

export const dsaResponses: Record<string, string> = {
  // Sorting Algorithms
  "bubble sort": `Bubble Sort is a simple sorting algorithm that repeatedly steps through the list, compares adjacent elements, and swaps them if they are in the wrong order.

**How it works:**
1. Start at the beginning of the array
2. Compare adjacent elements, if they're in the wrong order, swap them
3. Continue to the end of the array
4. Repeat the process until no more swaps are needed

**Time Complexity:**
- Best Case: O(n) when the array is already sorted
- Average Case: O(n²)
- Worst Case: O(n²)

**Space Complexity:** O(1) - it's an in-place sorting algorithm

**Use Cases:**
- Educational purposes
- Small datasets
- When simplicity is more important than efficiency`,

  "insertion sort": `Insertion Sort is a simple sorting algorithm that builds the final sorted array one item at a time.

**How it works:**
1. Start with the second element
2. Compare it with the previous elements
3. If the previous elements are greater, move them up
4. Insert the current element in its correct position
5. Repeat for all elements

**Time Complexity:**
- Best Case: O(n) when the array is already sorted
- Average Case: O(n²)
- Worst Case: O(n²)

**Space Complexity:** O(1) - it's an in-place sorting algorithm

**Use Cases:**
- Small datasets
- Nearly sorted arrays
- Online algorithms (can sort as data arrives)`,

  "selection sort": `Selection Sort is a simple sorting algorithm that divides the input list into two parts: a sorted sublist and an unsorted sublist.

**How it works:**
1. Find the minimum element in the unsorted sublist
2. Swap it with the leftmost element of the unsorted sublist
3. Move the boundary between the sublists one element to the right
4. Repeat until the entire list is sorted

**Time Complexity:**
- Best Case: O(n²)
- Average Case: O(n²)
- Worst Case: O(n²)

**Space Complexity:** O(1) - it's an in-place sorting algorithm

**Use Cases:**
- Small datasets
- When memory is limited
- When the cost of swapping elements is high`,

  "merge sort": `Merge Sort is an efficient, stable, comparison-based, divide and conquer algorithm.

**How it works:**
1. Divide the unsorted list into n sublists, each containing one element
2. Repeatedly merge sublists to produce new sorted sublists
3. Continue until there is only one sublist remaining

**Time Complexity:**
- Best Case: O(n log n)
- Average Case: O(n log n)
- Worst Case: O(n log n)

**Space Complexity:** O(n) - requires additional space for merging

**Use Cases:**
- Large datasets
- External sorting
- When stable sorting is needed
- Linked lists (can be implemented with O(1) extra space)`,

  "quick sort": `Quick Sort is an efficient, in-place sorting algorithm that uses a divide-and-conquer strategy.

**How it works:**
1. Choose a 'pivot' element from the array
2. Partition the array: elements less than pivot go left, greater go right
3. Recursively apply the above steps to the sub-arrays
4. Combine the sorted sub-arrays

**Time Complexity:**
- Best Case: O(n log n)
- Average Case: O(n log n)
- Worst Case: O(n²) when poorly pivoted

**Space Complexity:** O(log n) for the recursive call stack

**Use Cases:**
- Large datasets
- When average-case performance matters more than worst-case
- Internal sorting (when all data fits in memory)`,

  // Data Structures
  array: `An Array is a collection of elements stored at contiguous memory locations.

**Key Characteristics:**
- Fixed size (in most languages)
- Elements are accessed using indices
- Homogeneous (same type of elements)

**Common Operations:**
- Access: O(1)
- Search: O(n) for linear search, O(log n) for binary search (if sorted)
- Insertion/Deletion: O(n) (need to shift elements)

**Use Cases:**
- When you need constant-time access to elements
- When the size is known in advance
- As a building block for more complex data structures`,

  "linked list": `A Linked List is a linear data structure where elements are stored in nodes, and each node points to the next node.

**Types:**
- Singly Linked List: Each node points to the next node
- Doubly Linked List: Each node points to both next and previous nodes
- Circular Linked List: Last node points back to the first node

**Common Operations:**
- Access: O(n)
- Search: O(n)
- Insertion/Deletion at beginning: O(1)
- Insertion/Deletion at end: O(n) for singly, O(1) for doubly with tail pointer
- Insertion/Deletion in middle: O(n) to find position, O(1) to change links

**Use Cases:**
- When frequent insertions and deletions are needed
- When the size is unknown in advance
- Implementing stacks, queues, and hash tables`,

  stack: `A Stack is a linear data structure that follows the Last In First Out (LIFO) principle.

**Key Operations:**
- Push: Add an element to the top - O(1)
- Pop: Remove the top element - O(1)
- Peek/Top: View the top element without removing it - O(1)
- isEmpty: Check if the stack is empty - O(1)

**Implementations:**
- Using arrays
- Using linked lists

**Use Cases:**
- Function call management (call stack)
- Expression evaluation and syntax parsing
- Undo mechanisms in applications
- Backtracking algorithms`,

  queue: `A Queue is a linear data structure that follows the First In First Out (FIFO) principle.

**Key Operations:**
- Enqueue: Add an element to the rear - O(1)
- Dequeue: Remove an element from the front - O(1)
- Front: Get the front element without removing it - O(1)
- isEmpty: Check if the queue is empty - O(1)

**Implementations:**
- Using arrays (circular queue)
- Using linked lists

**Use Cases:**
- Task scheduling
- Resource sharing among multiple consumers
- Breadth-first search algorithm
- Print queue management`,

  tree: `A Tree is a hierarchical data structure consisting of nodes connected by edges.

**Key Terms:**
- Root: The topmost node
- Parent/Child: Relationship between connected nodes
- Leaf: A node with no children
- Height: Length of the longest path from root to leaf
- Depth: Length of the path from root to the node

**Types:**
- Binary Tree: Each node has at most two children
- Binary Search Tree: Left child < Parent < Right child
- AVL Tree: Self-balancing binary search tree
- B-Tree: Generalized binary search tree with multiple children

**Common Operations (for BST):**
- Search: O(log n) average, O(n) worst
- Insertion: O(log n) average, O(n) worst
- Deletion: O(log n) average, O(n) worst

**Use Cases:**
- Hierarchical data representation
- Database indexing
- Expression evaluation
- Network routing algorithms`,

  "binary search tree": `A Binary Search Tree (BST) is a binary tree where each node has at most two children, and for each node, all elements in the left subtree are less than the node, and all elements in the right subtree are greater.

**Key Properties:**
- Left child < Parent < Right child
- Inorder traversal gives sorted output
- No duplicate nodes (in standard BST)

**Common Operations:**
- Search: O(log n) average, O(n) worst
- Insertion: O(log n) average, O(n) worst
- Deletion: O(log n) average, O(n) worst

**Use Cases:**
- Searching and sorting
- Priority queues
- To implement sets and maps in many languages`,

  "hash table": `A Hash Table (or Hash Map) is a data structure that implements an associative array abstract data type, a structure that can map keys to values.

**Key Components:**
- Hash Function: Converts keys into array indices
- Collision Resolution: Handling when different keys hash to the same index
  - Chaining: Using linked lists at each index
  - Open Addressing: Finding another slot (linear probing, quadratic probing, etc.)

**Common Operations:**
- Search: O(1) average, O(n) worst
- Insertion: O(1) average, O(n) worst
- Deletion: O(1) average, O(n) worst

**Use Cases:**
- Database indexing
- Caches
- Symbol tables in compilers
- Implementing sets and dictionaries`,

  graph: `A Graph is a non-linear data structure consisting of nodes (vertices) and edges that connect these nodes.

**Types:**
- Directed vs Undirected
- Weighted vs Unweighted
- Cyclic vs Acyclic

**Representations:**
- Adjacency Matrix: 2D array where matrix[i][j] represents edge from i to j
- Adjacency List: Array of linked lists where each list contains the neighbors of a vertex

**Common Algorithms:**
- Breadth-First Search (BFS): O(V+E)
- Depth-First Search (DFS): O(V+E)
- Dijkstra's Algorithm: O(V²) or O(E + V log V) with min-heap
- Bellman-Ford Algorithm: O(VE)

**Use Cases:**
- Social networks
- Web page linking
- Maps and navigation
- Network routing`,

  heap: `A Heap is a specialized tree-based data structure that satisfies the heap property.

**Types:**
- Min Heap: Parent nodes are less than or equal to their children
- Max Heap: Parent nodes are greater than or equal to their children

**Key Operations:**
- Insert: O(log n)
- Extract Min/Max: O(log n)
- Peek: O(1)
- Heapify: O(n)

**Implementations:**
- Binary Heap (using arrays)
- Fibonacci Heap
- Binomial Heap

**Use Cases:**
- Priority queues
- Heap sort algorithm
- Graph algorithms (Dijkstra's, Prim's)
- Finding kth smallest/largest element`,

  // Common Algorithms
  "binary search": `Binary Search is an efficient algorithm for finding a target value within a sorted array.

**How it works:**
1. Compare the target value with the middle element of the array
2. If they match, return the middle index
3. If the target is less, search the left half
4. If the target is greater, search the right half
5. Repeat until the target is found or the subarray is empty

**Time Complexity:**
- Best Case: O(1) when the middle element is the target
- Average Case: O(log n)
- Worst Case: O(log n)

**Space Complexity:**
- Iterative: O(1)
- Recursive: O(log n) due to the call stack

**Use Cases:**
- Searching in sorted arrays
- Database searching
- Finding insertion points in sorted arrays`,

  "depth first search": `Depth-First Search (DFS) is an algorithm for traversing or searching tree or graph data structures.

**How it works:**
1. Start at a source node
2. Explore as far as possible along each branch before backtracking
3. Mark nodes as visited to avoid cycles
4. Use a stack (or recursion) to keep track of nodes to visit

**Time Complexity:** O(V + E) where V is vertices and E is edges

**Space Complexity:** O(V) in the worst case

**Use Cases:**
- Topological sorting
- Finding connected components
- Maze generation and solving
- Cycle detection in graphs`,

  "breadth first search": `Breadth-First Search (BFS) is an algorithm for traversing or searching tree or graph data structures.

**How it works:**
1. Start at a source node
2. Explore all neighbors at the current depth before moving to nodes at the next depth level
3. Use a queue to keep track of nodes to visit
4. Mark nodes as visited to avoid cycles

**Time Complexity:** O(V + E) where V is vertices and E is edges

**Space Complexity:** O(V) in the worst case

**Use Cases:**
- Finding shortest paths in unweighted graphs
- Level-order traversal of trees
- Finding connected components
- Testing bipartiteness`,

  dijkstra: `Dijkstra's Algorithm is a greedy algorithm that finds the shortest path between nodes in a graph.

**How it works:**
1. Initialize distances: 0 for source node, infinity for all others
2. Mark all nodes as unvisited
3. For the current node, consider all unvisited neighbors
4. Calculate their tentative distances through the current node
5. If the calculated distance is less than the known distance, update it
6. Mark the current node as visited
7. Select the unvisited node with the smallest tentative distance as the new current node
8. Repeat until destination is reached or all reachable nodes are visited

**Time Complexity:**
- O(V²) with array implementation
- O(E + V log V) with binary heap implementation

**Space Complexity:** O(V)

**Use Cases:**
- GPS navigation systems
- Network routing protocols
- Flight scheduling
- Robot path planning`,

  "dynamic programming": `Dynamic Programming is a method for solving complex problems by breaking them down into simpler subproblems.

**Key Characteristics:**
- Overlapping Subproblems: Same subproblems are solved multiple times
- Optimal Substructure: Optimal solution can be constructed from optimal solutions of subproblems

**Approaches:**
- Top-down (Memoization): Recursive approach with caching
- Bottom-up (Tabulation): Iterative approach building from smallest subproblems

**Common Problems:**
- Fibonacci sequence
- Knapsack problem
- Longest Common Subsequence
- Shortest path algorithms

**Use Cases:**
- Resource allocation
- Sequence alignment in bioinformatics
- Text justification
- Portfolio optimization`,

  // General DSA concepts
  "time complexity": `Time Complexity is a measure of the amount of time an algorithm takes to run as a function of the input size.

**Common Notations:**
- O(1): Constant time - execution time doesn't change with input size
- O(log n): Logarithmic time - execution time increases logarithmically with input size
- O(n): Linear time - execution time increases linearly with input size
- O(n log n): Log-linear time - common in efficient sorting algorithms
- O(n²): Quadratic time - common in nested loops
- O(2^n): Exponential time - often found in brute force algorithms

**Analyzing Time Complexity:**
1. Focus on dominant terms
2. Ignore constants
3. Consider worst-case scenario (unless specified otherwise)

**Examples:**
- Array access: O(1)
- Binary search: O(log n)
- Linear search: O(n)
- Merge sort: O(n log n)
- Bubble sort: O(n²)
- Generating all subsets: O(2^n)`,

  "space complexity": `Space Complexity is a measure of the amount of memory an algorithm uses as a function of the input size.

**Common Notations:**
- O(1): Constant space - memory usage doesn't change with input size
- O(log n): Logarithmic space - memory usage increases logarithmically with input size
- O(n): Linear space - memory usage increases linearly with input size
- O(n²): Quadratic space - memory usage increases quadratically with input size

**Components of Space Complexity:**
- Input space: Memory needed to store the input
- Auxiliary space: Extra memory needed by the algorithm (excluding input)
- Total space: Input space + Auxiliary space

**Examples:**
- In-place sorting algorithms (like insertion sort): O(1) auxiliary space
- Merge sort: O(n) auxiliary space
- Recursive algorithms: Often O(depth of recursion) for the call stack
- Creating a matrix: O(n²) space`,

  // Add more DSA topics as needed
  // Additional DSA Responses
"floyd warshall": `Floyd-Warshall is an algorithm for finding shortest paths between all pairs of vertices in a weighted graph.

**How it works:**
1. Initialize a distance matrix with weights of direct edges
2. For each vertex k, update the distance between every pair (i, j)
   - dist[i][j] = min(dist[i][j], dist[i][k] + dist[k][j])

**Time Complexity:** O(V³)
**Space Complexity:** O(V²)

**Use Cases:**
- All-pairs shortest path
- Detecting negative weight cycles
- Routing protocols`,

"kruskal": `Kruskal's Algorithm is a greedy algorithm to find the Minimum Spanning Tree (MST) of a graph.

**How it works:**
1. Sort all edges in non-decreasing order of weight
2. Pick the smallest edge and check if it forms a cycle using Union-Find
3. If it doesn't, include it in the MST
4. Repeat until MST has V-1 edges

**Time Complexity:** O(E log E)
**Space Complexity:** O(V)

**Use Cases:**
- Network design
- Clustering algorithms`,

"prim": `Prim's Algorithm is a greedy algorithm that finds the Minimum Spanning Tree (MST) for a connected weighted graph.

**How it works:**
1. Start with any node and add the smallest edge that connects to an unvisited node
2. Repeat until all nodes are included

**Time Complexity:**
- With priority queue: O(E log V)
**Space Complexity:** O(V)

**Use Cases:**
- Designing least cost network
- Minimum cost to connect cities`,

"topological sort": `Topological Sort is an ordering of vertices in a Directed Acyclic Graph (DAG) such that for every directed edge u → v, u comes before v.

**How it works:**
1. Perform DFS and push nodes to stack after visiting all neighbors
2. Or use Kahn’s algorithm with in-degrees and a queue

**Time Complexity:** O(V + E)
**Space Complexity:** O(V)

**Use Cases:**
- Task scheduling
- Build systems (compilation order)
- Course prerequisite resolution`,

"sliding window": `Sliding Window is an optimization technique to reduce nested loops to a single loop in problems involving arrays or strings.

**How it works:**
1. Maintain a window of elements that satisfy a condition
2. Slide the window by moving the left or right pointer
3. Update the result accordingly

**Time Complexity:** O(n) in most optimized cases

**Use Cases:**
- Longest substring without repeating characters
- Maximum sum of k consecutive elements
- Count anagrams in a string`,

"two pointers": `The Two Pointers technique uses two indices to solve problems on arrays or strings efficiently.

**How it works:**
- One pointer starts at the beginning, the other at the end
- Move pointers based on a condition to converge

**Time Complexity:** O(n)

**Use Cases:**
- Finding pairs with a given sum in a sorted array
- Reversing a string or array
- Removing duplicates from a sorted array`,

"kadane's algorithm": `Kadane's Algorithm is used to find the maximum subarray sum in a one-dimensional array.

**How it works:**
1. Initialize max_so_far and max_ending_here to first element
2. Iterate through the array:
   - max_ending_here = max(current_element, max_ending_here + current_element)
   - max_so_far = max(max_so_far, max_ending_here)

**Time Complexity:** O(n)
**Space Complexity:** O(1)

**Use Cases:**
- Stock market profit problems
- Subarray problems
- Finding contiguous segments with maximum total`,

"prefix sum": `Prefix Sum is a technique to preprocess cumulative sums of an array for efficient range queries.

**How it works:**
1. Create a prefix array where prefix[i] = prefix[i - 1] + arr[i]
2. To get sum of subarray from i to j: prefix[j] - prefix[i - 1]

**Time Complexity:**
- Preprocessing: O(n)
- Query: O(1)

**Use Cases:**
- Range sum queries
- Counting subarrays
- Efficient sum checks`,

"trie": `A Trie (prefix tree) is a tree-based data structure used to efficiently store and retrieve keys in a dataset of strings.

**Key Properties:**
- Each node represents a character
- Words end at leaf or special end marker

**Time Complexity:**
- Insert/Search/Delete: O(L) where L is length of the word

**Use Cases:**
- Auto-complete systems
- Spell checking
- IP routing
- Word games`,

"backtracking": `Backtracking is an algorithmic paradigm for solving constraint satisfaction problems by exploring all potential options and abandoning those that fail.

**How it works:**
1. Try all possible options for the current step
2. If a step leads to a solution, continue
3. If not, backtrack and try the next option

**Time Complexity:** Depends on branching factor and depth
**Space Complexity:** O(depth) for recursion

**Use Cases:**
- Sudoku solver
- N-Queens problem
- Combinatorial problems (permutations, subsets)`,

"union find": `Union-Find (Disjoint Set Union) is a data structure to keep track of disjoint sets and quickly merge and check connectivity.

**Operations:**
- find(x): Returns root of x
- union(x, y): Merges sets containing x and y

**Optimizations:**
- Path Compression
- Union by Rank

**Time Complexity:** O(α(n)) ≈ O(1) with optimizations

**Use Cases:**
- Cycle detection in graphs
- Kruskal's MST
- Network connectivity
- Grouping problems`,


}

// Function to find the best matching response
export function findBestResponse(query: string): string | null {
  query = query.toLowerCase()

  // Direct match
  if (dsaResponses[query]) {
    return dsaResponses[query]
  }

  // Check for keywords in the query
  for (const [key, response] of Object.entries(dsaResponses)) {
    if (query.includes(key)) {
      return response
    }
  }

  // No match found
  return null
}

// Function to generate a generic response when no match is found
export function generateGenericResponse(query: string): string {
  const responses = [
    `I don't have specific information about "${query}" in my local database. As a DSA assistant, I can help with common algorithms and data structures like sorting algorithms, trees, graphs, and complexity analysis. Could you ask about one of these topics instead?`,

    `I'm currently operating with limited capabilities due to API restrictions. I don't have detailed information about "${query}" in my local database. I can help with common DSA topics liketrees, sorting algorithms, graph and heap. Would you like to know about any of these?`,

    `I don't have specific information about "${query}" at the moment. I can provide explanations about fundamental DSA concepts like time complexity, space complexity, common data structures (arrays, linked lists, trees, graphs), and algorithms (sorting, searching, dynamic programming). Would you like to learn about any of these instead?`,
  ]

  return responses[Math.floor(Math.random() * responses.length)]
}
