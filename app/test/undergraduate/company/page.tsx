"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Building2, ArrowLeft } from "lucide-react";
import { EducationLevel } from "@/types/global/interface/test.apiInterface";
import { useState } from "react";
import { ErrorMessageDialog } from "@/components/test-engine/pre-test/error-message-dialog";
import { TestInfoDisplay } from "@/components/test-engine/pre-test/test-info-display";
import { useCreateAndNavigate } from "@/app/test/junior-college/use-create-and-navigate";

const companies = [
  {
    id: "microsoft",
    name: "Microsoft",
    description: "Technical and aptitude assessment pattern",
    duration: 60,
    questionCount: 30,
  },
  {
    id: "google",
    name: "Google",
    description: "Coding and problem-solving focused",
    duration: 60,
    questionCount: 30,
  },
  {
    id: "amazon",
    name: "Amazon",
    description: "Leadership principles and coding rounds",
    duration: 60,
    questionCount: 30,
  },
  {
    id: "accenture",
    name: "Accenture",
    description: "Aptitude and technical assessment",
    duration: 60,
    questionCount: 30,
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
  const [selectedCompany, setSelectedCompany] = useState<typeof companies[0] | null>(null);
  const { createAndNavigate, isPending, hasError, clearError } =
    useCreateAndNavigate();

  const handleStartTest = (companyId: string) => {
    createAndNavigate({
      educationLevel: EducationLevel.Undergraduate,
      company: companyId,
    });
  };

  if (selectedCompany) {
    return (
      <>
        <ErrorMessageDialog open={hasError} onClose={clearError} />
        <div className="container pt-8 pb-0">
          <div className="max-w-4xl mx-auto">
            <Button
              variant="ghost"
              onClick={() => setSelectedCompany(null)}
              className="mb-4 pl-0 hover:pl-2 transition-all"
            >
              <ArrowLeft className="mr-2 h-4 w-4" /> Back to Companies
            </Button>
          </div>
        </div>
        <TestInfoDisplay
          title={`${selectedCompany.name} Assessment`}
          description={selectedCompany.description}
          duration={selectedCompany.duration}
          questionCount={selectedCompany.questionCount}
          onStart={() => handleStartTest(selectedCompany.id)}
          startButtonLabel={isPending ? "Creating Test..." : "Start Test"}
          isStartDisabled={isPending}
          requirements={[
            "Stable internet connection",
            "Latest browser version",
            "Working webcam (if required)",
            "Quiet environment"
          ]}
        />
      </>
    );
  }

  return (
    <div className="container py-8">
      <ErrorMessageDialog open={hasError} onClose={clearError} />

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
              onClick={() => setSelectedCompany(company)}
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
