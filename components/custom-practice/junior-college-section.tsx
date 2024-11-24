"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { Checkbox } from "@/components/ui/checkbox";
import { ChevronLeft, Dices } from "lucide-react";

const subjects = {
  physics: {
    name: "Physics",
    years: {
      "11th": [
        "Physical World and Measurement",
        "Kinematics",
        "Laws of Motion",
        "Work, Energy and Power",
        "Motion of System of Particles and Rigid Body",
        "Gravitation",
        "Properties of Bulk Matter",
        "Thermodynamics",
        "Behaviour of Perfect Gas and Kinetic Theory",
        "Oscillations and Waves"
      ],
      "12th": [
        "Electrostatics",
        "Current Electricity",
        "Magnetic Effects of Current and Magnetism",
        "Electromagnetic Induction and Alternating Currents",
        "Electromagnetic Waves",
        "Optics",
        "Dual Nature of Matter and Radiation",
        "Atoms and Nuclei",
        "Electronic Devices"
      ]
    }
  },
  chemistry: {
    name: "Chemistry",
    years: {
      "11th": [
        "Some Basic Concepts of Chemistry",
        "Structure of Atom",
        "Classification of Elements and Periodicity",
        "Chemical Bonding and Molecular Structure",
        "States of Matter",
        "Thermodynamics",
        "Equilibrium",
        "Redox Reactions",
        "Hydrogen",
        "s-Block Elements",
        "p-Block Elements",
        "Organic Chemistry: Basic Principles"
      ],
      "12th": [
        "Solid State",
        "Solutions",
        "Electrochemistry",
        "Chemical Kinetics",
        "Surface Chemistry",
        "General Principles of Isolation of Elements",
        "p-Block Elements",
        "d and f Block Elements",
        "Coordination Compounds",
        "Organic Compounds"
      ]
    }
  },
  mathematics: {
    name: "Mathematics",
    years: {
      "11th": [
        "Sets and Functions",
        "Trigonometric Functions",
        "Principle of Mathematical Induction",
        "Complex Numbers and Quadratic Equations",
        "Linear Inequalities",
        "Permutations and Combinations",
        "Binomial Theorem",
        "Sequences and Series",
        "Straight Lines",
        "Conic Sections",
        "Introduction to Three Dimensional Geometry",
        "Limits and Derivatives",
        "Mathematical Reasoning",
        "Statistics",
        "Probability"
      ],
      "12th": [
        "Relations and Functions",
        "Inverse Trigonometric Functions",
        "Matrices",
        "Determinants",
        "Continuity and Differentiability",
        "Applications of Derivatives",
        "Integrals",
        "Applications of Integrals",
        "Differential Equations",
        "Vector Algebra",
        "Three Dimensional Geometry",
        "Linear Programming"
      ]
    }
  },
  biology: {
    name: "Biology",
    years: {
      "11th": [
        "Diversity in Living World",
        "Structural Organisation in Animals and Plants",
        "Cell Structure and Function",
        "Plant Physiology",
        "Human Physiology"
      ],
      "12th": [
        "Reproduction",
        "Genetics and Evolution",
        "Biology and Human Welfare",
        "Biotechnology and Its Applications",
        "Ecology and Environment"
      ]
    }
  }
};

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 }
};

export function JuniorCollegeSection() {
  const [selectedTopics, setSelectedTopics] = useState<string[]>([]);

  const handleTopicToggle = (topic: string) => {
    setSelectedTopics(prev =>
      prev.includes(topic)
        ? prev.filter(t => t !== topic)
        : [...prev, topic]
    );
  };

  const handleSelectAll = () => {
    const allTopics = Object.values(subjects).flatMap(subject =>
      Object.values(subject.years).flatMap(topics => topics)
    );
    setSelectedTopics(allTopics);
  };

  const startRandomTest = () => {
    console.log("Starting random test with selected topics:", selectedTopics);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={handleSelectAll}>
          Select All
        </Button>
        <Button onClick={startRandomTest} className="gap-2">
          <Dices className="w-4 h-4" /> Start Random Test
        </Button>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid gap-6 md:grid-cols-2"
      >
        {Object.entries(subjects).map(([subjectKey, subject]) => (
          <motion.div key={subjectKey} variants={item}>
            <Card className="h-full">
              <CardHeader>
                <CardTitle>{subject.name}</CardTitle>
              </CardHeader>
              <CardContent>
                <Accordion type="multiple" className="w-full">
                  {Object.entries(subject.years).map(([year, topics]) => (
                    <AccordionItem value={`${subjectKey}-${year}`} key={`${subjectKey}-${year}`}>
                      <AccordionTrigger>{year} Standard</AccordionTrigger>
                      <AccordionContent>
                        <div className="grid gap-2">
                          {topics.map((topic) => (
                            <div key={topic} className="flex items-center gap-2">
                              <Checkbox
                                id={topic}
                                checked={selectedTopics.includes(topic)}
                                onCheckedChange={() => handleTopicToggle(topic)}
                              />
                              <label
                                htmlFor={topic}
                                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                              >
                                {topic}
                              </label>
                            </div>
                          ))}
                        </div>
                      </AccordionContent>
                    </AccordionItem>
                  ))}
                </Accordion>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
}