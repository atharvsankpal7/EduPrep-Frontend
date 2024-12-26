import { Question } from "@/components/test/test-interface";

export const gateQuestions: Question[] = [
  { 
    question: "What is the time complexity of QuickSort in the worst case?",
    options: ["O(n log n)", "O(n²)", "O(n)", "O(log n)"],
    correctAnswer: 1 
  },
  { 
    question: "Which of the following is not a valid deadlock prevention method?",
    options: [
      "Resource preemption",
      "Mutual exclusion avoidance",
      "Hold and wait prevention",
      "Circular wait prevention"
    ],
    correctAnswer: 1 
  },
  { 
    question: "In the OSI model, which layer is responsible for routing?",
    options: ["Transport Layer", "Network Layer", "Data Link Layer", "Session Layer"],
    correctAnswer: 1 
  },
  { 
    question: "What is the purpose of normalization in database design?",
    options: [
      "To increase data redundancy",
      "To eliminate data redundancy",
      "To increase database size",
      "To decrease query performance"
    ],
    correctAnswer: 1 
  },
  { 
    question: "Which scheduling algorithm may suffer from starvation?",
    options: ["Round Robin", "First Come First Serve", "Priority Scheduling", "Shortest Job First"],
    correctAnswer: 2 
  },
  { 
    question: "What is the main advantage of B+ trees over B trees?",
    options: [
      "Better space utilization",
      "Faster insertion operations",
      "All leaf nodes are at same level",
      "Lower memory requirements"
    ],
    correctAnswer: 2 
  },

  // Additional questions to reach 65 total
  { question: "What is the time complexity of Merge Sort?", options: ["O(n²)", "O(n log n)", "O(n)", "O(log n)"], correctAnswer: 1 },
  { question: "Which protocol is used for email retrieval?", options: ["SMTP", "IMAP", "HTTP", "FTP"], correctAnswer: 1 },
  { question: "What does ACID stand for in databases?", options: ["Atomicity, Consistency, Isolation, Durability", "Accuracy, Concurrency, Integrity, Data", "Atomicity, Connectivity, Isolation, Dependability", "Automation, Configuration, Integration, Distribution"], correctAnswer: 0 },
  { question: "Which type of memory is volatile?", options: ["RAM", "ROM", "Flash Memory", "Hard Disk"], correctAnswer: 0 },
  { question: "What is the role of the Program Counter in a CPU?", options: ["Stores the address of the next instruction", "Holds the current instruction", "Performs arithmetic operations", "Manages input/output operations"], correctAnswer: 0 },
  { question: "What is the main function of a cache memory?", options: ["Stores frequently accessed data", "Acts as primary storage", "Holds backup data", "Manages virtual memory"], correctAnswer: 0 },
  { question: "Which data structure uses LIFO?", options: ["Queue", "Stack", "Linked List", "Heap"], correctAnswer: 1 },
  { question: "What is the primary purpose of DNS?", options: ["Routing packets", "Mapping domain names to IP addresses", "Securing network communications", "Maintaining session state"], correctAnswer: 1 },
  { question: "Which of the following is not a relational database?", options: ["MySQL", "MongoDB", "PostgreSQL", "SQLite"], correctAnswer: 1 },
  { question: "What is the function of an Operating System?", options: ["Resource management", "Programming support", "Database management", "Hardware design"], correctAnswer: 0 },
  { question: "What is a semaphore in operating systems?", options: ["A signal used for inter-process communication", "A process scheduling algorithm", "A memory management technique", "An error detection method"], correctAnswer: 0 },
  { question: "What is the primary function of ARP?", options: ["Address Resolution Protocol", "Access Routing Protocol", "Automatic Routing Process", "Advanced Redundancy Protocol"], correctAnswer: 0 },
  { question: "What is the output of a compiler?", options: ["Source code", "Object code", "Bytecode", "Assembly code"], correctAnswer: 1 },
  { 
    question: "Which of the following is a stable sorting algorithm?", 
    options: ["QuickSort", "MergeSort", "HeapSort", "Selection Sort"], 
    correctAnswer: 1 
  },
  { 
    question: "Which data structure is used to implement a depth-first search?", 
    options: ["Queue", "Stack", "Heap", "Graph"], 
    correctAnswer: 1 
  },
  { 
    question: "What is the time complexity of Binary Search?", 
    options: ["O(n)", "O(log n)", "O(n log n)", "O(1)"], 
    correctAnswer: 1 
  },
  { 
    question: "Which of the following is a non-relational database?", 
    options: ["MongoDB", "Oracle", "MySQL", "SQLite"], 
    correctAnswer: 0 
  },
  { 
    question: "Which of the following algorithms is used in routing?", 
    options: ["Dijkstra", "Floyd-Warshall", "Prim", "Kruskal"], 
    correctAnswer: 0 
  },
  { 
    question: "Which sorting algorithm has the best worst-case time complexity?", 
    options: ["QuickSort", "MergeSort", "HeapSort", "BubbleSort"], 
    correctAnswer: 1 
  },
  { 
    question: "Which of the following is a greedy algorithm?", 
    options: ["Dijkstra's algorithm", "MergeSort", "Binary Search", "Depth-First Search"], 
    correctAnswer: 0 
  },
  { 
    question: "Which is the main purpose of the TCP protocol?", 
    options: ["Ensure reliable communication", "Perform encryption", "Route packets", "Assign IP addresses"], 
    correctAnswer: 0 
  },
  { 
    question: "What is the primary function of a router?", 
    options: ["Forward packets between networks", "Manage traffic within a local network", "Connect the network to the internet", "Encrypt data in transit"], 
    correctAnswer: 0 
  },
  { 
    question: "Which of the following is an example of a multi-threaded programming language?", 
    options: ["C", "Java", "Assembly", "Fortran"], 
    correctAnswer: 1 
  },
  { 
    question: "Which layer in the OSI model is responsible for error detection and correction?", 
    options: ["Transport Layer", "Data Link Layer", "Network Layer", "Application Layer"], 
    correctAnswer: 1 
  },
  { 
    question: "Which of the following is a feature of NoSQL databases?", 
    options: ["Relational schema", "Schema-less data storage", "ACID properties", "SQL queries"], 
    correctAnswer: 1 
  },
  { 
    question: "In a hash table, which of the following techniques is used to resolve collisions?", 
    options: ["Open addressing", "Binary search", "Linear search", "Stacking"], 
    correctAnswer: 0 
  },
  { 
    question: "What is the main characteristic of a distributed system?", 
    options: ["Single point of failure", "Shared memory", "Multiple independent components", "Centralized control"], 
    correctAnswer: 2 
  },
  { 
    question: "Which type of memory is used for cache?", 
    options: ["RAM", "ROM", "EPROM", "SRAM"], 
    correctAnswer: 3 
  },
  { 
    question: "What does a compiler do?", 
    options: ["Translate source code into machine code", "Execute a program", "Manage memory", "Provide input/output functions"], 
    correctAnswer: 0 
  },
  { 
    question: "What is the primary function of the Link Layer in the OSI model?", 
    options: ["Path selection", "Data encoding and framing", "Error detection and correction", "End-to-end communication"], 
    correctAnswer: 1 
  },
  { 
    question: "What is the output of a linker?", 
    options: ["Object code", "Executable code", "Assembly code", "Source code"], 
    correctAnswer: 1 
  },
  { 
    question: "What is the purpose of RAID?", 
    options: ["Data redundancy and speed", "Data encryption", "Data retrieval", "Data archiving"], 
    correctAnswer: 0 
  },
  { 
    question: "Which of the following is a property of static memory allocation?", 
    options: ["Memory is allocated at runtime", "Memory allocation cannot be changed", "Memory allocation is flexible", "Memory allocation is done by garbage collector"], 
    correctAnswer: 1 
  },
  { 
    question: "Which of the following is an example of a process scheduling algorithm?", 
    options: ["Round Robin", "Merge Sort", "Dijkstra’s Algorithm", "Depth First Search"], 
    correctAnswer: 0 
  },
  { 
    question: "Which of the following is used for memory management in an operating system?", 
    options: ["Cache", "File system", "Virtual memory", "File pointer"], 
    correctAnswer: 2 
  },
  { 
    question: "Which of the following are characteristics of a stack data structure?", 
    options: ["FIFO", "LIFO", "Ordered", "Dynamic"], 
    correctAnswer: 1 
  },
  { 
    question: "Which protocol is used to assign IP addresses dynamically?", 
    options: ["DHCP", "HTTP", "FTP", "SMTP"], 
    correctAnswer: 0 
  },
  { 
    question: "Which of the following is not a search algorithm?", 
    options: ["Binary Search", "Linear Search", "Dijkstra’s Algorithm", "Interpolation Search"], 
    correctAnswer: 2 
  },
  { 
    question: "What is the main feature of a binary tree?", 
    options: ["Each node has at most two children", "Each node can have unlimited children", "Each node has only one child", "Each node is connected in a cycle"], 
    correctAnswer: 0 
  },
  { 
    question: "What is a deadlock in operating systems?", 
    options: ["A situation where resources are allocated without any process holding them", "A situation where processes are blocked due to resource contention", "A situation where processes execute without any interruption", "A situation where all processes are in the ready queue"], 
    correctAnswer: 1 
  },
  { 
    question: "What does RAID 5 offer?", 
    options: ["Data redundancy without parity", "Data redundancy with parity", "No redundancy", "Faster data retrieval speed"], 
    correctAnswer: 1 
  },
  { 
    question: "Which of the following is not a valid HTTP status code?", 
    options: ["200 OK", "400 Bad Request", "404 Not Found", "504 Server Timeout"], 
    correctAnswer: 3 
  },
  { 
    question: "Which sorting algorithm is most suitable for large datasets?", 
    options: ["Bubble Sort", "Quick Sort", "Selection Sort", "Merge Sort"], 
    correctAnswer: 3 
  },
  { 
    question: "Which algorithm is used for finding the shortest path in a weighted graph?", 
    options: ["Dijkstra’s Algorithm", "Kruskal’s Algorithm", "Prim’s Algorithm", "Bellman-Ford Algorithm"], 
    correctAnswer: 0 
  },
  { 
    question: "Which of the following is an example of a tree traversal algorithm?", 
    options: ["Binary Search", "Breadth-First Search", "Depth-First Search", "Hashing"], 
    correctAnswer: 2 
  },
  { 
    question: "Which of the following is a characteristic of a queue data structure?", 
    options: ["FIFO", "LIFO", "Dynamic", "Static"], 
    correctAnswer: 0 
  },
  { 
    question: "Which of the following algorithms has a time complexity of O(n²)?", 
    options: ["QuickSort", "MergeSort", "BubbleSort", "HeapSort"], 
    correctAnswer: 2 
  },
  { 
    question: "Which type of memory is non-volatile?", 
    options: ["RAM", "ROM", "SRAM", "Cache"], 
    correctAnswer: 1 
  },
  { 
    question: "What is the purpose of an operating system?", 
    options: ["File management", "Memory management", "Process management", "All of the above"], 
    correctAnswer: 3 
  },
  { 
    question: "Which layer of the OSI model is responsible for flow control?", 
    options: ["Network Layer", "Data Link Layer", "Transport Layer", "Application Layer"], 
    correctAnswer: 2 
  },
  { 
    question: "Which of the following is a key feature of object-oriented programming?", 
    options: ["Encapsulation", "Memory allocation", "Polymorphism", "Both A and C"], 
    correctAnswer: 3 
  },
  { 
    question: "Which algorithm is used for finding the minimum spanning tree?", 
    options: ["Kruskal’s Algorithm", "Dijkstra’s Algorithm", "Bellman-Ford Algorithm", "Prim’s Algorithm"], 
    correctAnswer: 0 
  },
  { 
    question: "Which of the following is an example of a non-blocking I/O operation?", 
    options: ["read()", "write()", "poll()", "close()"], 
    correctAnswer: 2 
  },
  { 
    question: "Which of the following is a common method for garbage collection?", 
    options: ["Reference counting", "Stack pointer", "Memory swapping", "Segmentation"], 
    correctAnswer: 0 
  },
  { 
    question: "Which of the following is used to manage the allocation of physical memory?", 
    options: ["Page table", "Heap", "Stack", "Register"], 
    correctAnswer: 0 
  }
  
];