"use client";

import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { GraduationCap, Building2, Settings, Lock } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

const examTypes = [
  {
    id: "gate",
    title: "GATE Exam",
    description: "Practice tests specifically designed for GATE examination",
    icon: GraduationCap,
    href: "/test/undergraduate/gate",
    disabled: true,
  },
  {
    id: "company",
    title: "Company Specific",
    description: "Tests tailored to specific company recruitment patterns",
    icon: Building2,
    href: "/test/undergraduate/company",
    disabled: true,
  },
  {
    id: "custom",
    title: "Custom Practice",
    description: "Create your own test by selecting specific topics",
    icon: Settings,
    href: "/test/undergraduate/custom",
    disabled: true,
  },
];

const container = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
    },
  },
};

const item = {
  hidden: { opacity: 0, y: 20 },
  show: { opacity: 1, y: 0 },
};

export default function UndergraduatePage() {
  return (
    <div className="container py-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Select Test Type</h1>
          <p className="text-muted-foreground">
            Choose the type of test you want to take
          </p>
        </div>

        <TooltipProvider>
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-3"
          >
            {examTypes.map((type) => (
              <Tooltip key={type.id}>
                <TooltipTrigger asChild>
                  <motion.div variants={item}>
                    <Card
                      className={`transition-all duration-300 card-highlight glass-effect ${type.disabled
                          ? "opacity-50 grayscale cursor-not-allowed"
                          : "cursor-pointer hover:shadow-lg"
                        }`}
                    >
                      <CardHeader>
                        <div className="flex items-center gap-4">
                          <div
                            className={`p-2 rounded-lg ${type.disabled
                                ? "bg-muted"
                                : type.id === "gate"
                                  ? "bg-gradient-blue"
                                  : type.id === "company"
                                    ? "bg-gradient-ginger"
                                    : "bg-gradient-cool"
                              }`}
                          >
                            <type.icon
                              className={`w-6 h-6 ${type.disabled ? "text-muted-foreground" : "text-white"
                                }`}
                            />
                          </div>
                          <div className="flex-1">
                            <CardTitle
                              className={type.disabled ? "text-muted-foreground" : ""}
                            >
                              {type.title}
                            </CardTitle>
                            <CardDescription>{type.description}</CardDescription>
                          </div>
                          {type.disabled && (
                            <Lock className="w-5 h-5 text-muted-foreground" />
                          )}
                        </div>
                      </CardHeader>
                    </Card>
                  </motion.div>
                </TooltipTrigger>
                {type.disabled && (
                  <TooltipContent side="bottom" className="text-sm font-medium">
                    <div className="flex items-center gap-2">
                      <Lock className="w-4 h-4" />
                      Commercial License Required
                    </div>
                  </TooltipContent>
                )}
              </Tooltip>
            ))}
          </motion.div>
        </TooltipProvider>
      </div>
    </div>
  );
}