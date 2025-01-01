"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createTest } from "@/lib/backendCalls/createTest";
import { EducationLevel } from "@/lib/type";
import { useState } from "react";
import { ErrorMessageDialog } from "@/components/test/error-message";

const companies = [
  {
    id: "microsoft",
    name: "Microsoft",
    description: "Technical and aptitude assessment pattern",
  },
  {
    id: "google",
    name: "Google",
    description: "Coding and problem-solving focused",
  },
  {
    id: "amazon",
    name: "Amazon",
    description: "Leadership principles and coding rounds",
  },
  {
    id: "accenture",
    name: "Accenture",
    description: "Aptitude and technical assessment",
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

export default function CompanyTestPage() {
  const router = useRouter();
  const [showError, setShowError] = useState(false);

  const handleStartTest = async (company: string) => {
    try {
      const response = await createTest({
        educationLevel: EducationLevel.Undergraduate,
        company,
      }) as any;
      if (!response.testId) {
        throw new Error("Failed to create test");
      }
      router.push(`/test/${response.testId}`);
    } catch (error) {
      setShowError(true);
    }
  };

  return (
    <div className="container py-8">
      <ErrorMessageDialog
        open={showError}
        onClose={() => setShowError(false)}
      />

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Company-Specific Tests</h1>
          <p className="text-muted-foreground">
            Select a company to practice their specific test pattern
          </p>
        </div>

        <motion.div
          variants={container}
          initial="hidden"
          animate="show"
          className="grid gap-6 md:grid-cols-2"
        >
          {companies.map((company) => (
            <motion.div
              key={company.id}
              variants={item}
              onClick={() => handleStartTest(company.id)}
            >
              <Card className="cursor-pointer hover:shadow-lg transition-all duration-300 card-highlight glass-effect">
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-gradient-ginger">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div>
                      <CardTitle>{company.name}</CardTitle>
                      <CardDescription>{company.description}</CardDescription>
                    </div>
                  </div>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}
