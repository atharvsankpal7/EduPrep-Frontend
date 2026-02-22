import { TSubjectList } from "@/types/global/interface/test.apiInterface";

export const undergraduateSubjects: TSubjectList[] = [
  {
    domain: "Core Subjects",
    subjects: [
      {
        subjectName: "Database Management",
        topics: [
          "SQL Fundamentals",
          "Normalization",
          "Transactions",
          "Indexing",
          "Query Optimization",
          "ACID Properties",
        ],
      },
      {
        subjectName: "Operating Systems",
        topics: [
          "Process Management",
          "Memory Management",
          "File Systems",
          "CPU Scheduling",
          "Deadlocks",
          "Virtual Memory",
        ],
      },
      {
        subjectName: "Computer Networks",
        topics: [
          "OSI Model",
          "TCP/IP",
          "Routing",
          "Network Security",
          "Protocols",
          "Socket Programming",
        ],
      },
      {
        subjectName: "Data Structures",
        topics: [
          "Arrays",
          "Linked Lists",
          "Trees",
          "Graphs",
          "Sorting",
          "Searching",
          "Dynamic Programming",
        ],
      },
    ],
  },
  {
    domain: "Aptitude",
    subjects: [
      {
        subjectName: "Arithmetic Aptitude",
        topics: [
          "Problems on Trains",
          "Time and Distance",
          "Simple Interest",
          "Compound Interest",
          "Profit and Loss",
          "Percentage",
        ],
      },
      {
        subjectName: "Data Interpretation",
        topics: ["Table Charts", "Bar Charts", "Pie Charts", "Line Charts"],
      },
    ],
  },
  {
    domain: "Verbal and Reasoning",
    subjects: [
      {
        subjectName: "Verbal Ability",
        topics: [
          "Spotting Errors",
          "Synonyms",
          "Antonyms",
          "Sentence Formation",
          "Comprehension",
        ],
      },
      {
        subjectName: "Logical Reasoning",
        topics: [
          "Number Series",
          "Analogies",
          "Logical Problems",
          "Statement and Assumption",
        ],
      },
      {
        subjectName: "Visual Reasoning",
        topics: [
          "Pattern Recognition",
          "Mirror Images",
          "Paper Folding",
          "Figure Matrix",
        ],
      },
    ],
  },
];
