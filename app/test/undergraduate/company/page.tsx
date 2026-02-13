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
import { getCompanyTestDetails } from "@/lib/backendCalls/getCompanyTestDetails";
import { EducationLevel, ICompanySpecificTestDetails } from "@/lib/type";
import { useState } from "react";
import { ErrorMessageDialog } from "@/components/test/error-message";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/lib/stores/auth-store";
import { TestInfoDisplay } from "@/components/test/test-info-display";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { ScrollArea } from "@/components/ui/scroll-area";

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
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStore();

  const [selectedCompany, setSelectedCompany] = useState<ICompanySpecificTestDetails | null>(null);
  const [selectedCompanyId, setSelectedCompanyId] = useState<string | null>(null);
  const [syllabusCompany, setSyllabusCompany] = useState<ICompanySpecificTestDetails | null>(null);
  const [loading, setLoading] = useState(false);

  // Helper to fetch details
  const fetchDetails = async (companyId: string) => {
    try {
      setLoading(true);
      const details = await getCompanyTestDetails(companyId);
      return details;
    } catch (error) {
      console.error("Error fetching company details:", error);
      toast({
        title: "Error",
        description: "Failed to load test details. Please try again.",
        variant: "destructive",
      });
      return null;
    } finally {
      setLoading(false);
    }
  };

  const handleCompanyClick = async (companyId: string) => {
    const details = await fetchDetails(companyId);
    if (details) {
      setSelectedCompany(details);
      setSelectedCompanyId(companyId);
    }
  };

  const handleSyllabusClick = async (companyId: string) => {
    const details = await fetchDetails(companyId);
    if (details) {
      setSyllabusCompany(details);
    }
  };

  const handleStartTest = async () => {
    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to take a company test",
        variant: "destructive",
      });
      router.push("/sign-in");
      return;
    }

    if (!selectedCompanyId) return;

    try {
      const response = await createTest({
        educationLevel: EducationLevel.Undergraduate,
        company: selectedCompanyId,
      }) as any;
      if (!response.testId) {
        throw new Error("Failed to create test");
      }
      router.push(`/test/${response.testId}`);
    } catch (error) {
      console.error("Error creating test:", error);
      setShowError(true);
      toast({
        title: "Error",
        description: "Failed to create test. Please try again.",
        variant: "destructive",
      });
    }
  };

  if (selectedCompany) {
    return (
      <>
        <ErrorMessageDialog
          open={showError}
          onClose={() => setShowError(false)}
        />
        <div className="container py-8">
           <Button variant="ghost" onClick={() => {
             setSelectedCompany(null);
             setSelectedCompanyId(null);
           }} className="mb-4">
            ← Back to Companies
           </Button>
           <TestInfoDisplay
            title={`${selectedCompany.companyName} Test`}
            description="Company specific test pattern and syllabus."
            duration={selectedCompany.time}
            questionCount={selectedCompany.numberOfQuestions}
            onStart={handleStartTest}
            requirements={[
              "Working webcam and microphone",
              "Stable internet connection",
              "Quiet environment",
            ]}
          />
        </div>
      </>
    );
  }

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
            >
              <Card
                className="cursor-pointer hover:shadow-lg transition-all duration-300 card-highlight glass-effect"
                onClick={() => handleCompanyClick(company.id)}
              >
                <CardHeader>
                  <div className="flex items-center gap-4">
                    <div className="p-2 rounded-lg bg-gradient-ginger">
                      <Building2 className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <CardTitle>{company.name}</CardTitle>
                      <CardDescription>{company.description}</CardDescription>
                    </div>
                  </div>
                  <Button
                    variant="secondary"
                    size="sm"
                    className="mt-4 w-full"
                    onClick={(e) => {
                      e.stopPropagation();
                      handleSyllabusClick(company.id);
                    }}
                    disabled={loading}
                  >
                    View Syllabus
                  </Button>
                </CardHeader>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>

      <Dialog open={!!syllabusCompany} onOpenChange={(open) => !open && setSyllabusCompany(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{syllabusCompany?.companyName} Syllabus</DialogTitle>
            <DialogDescription>
              Topics covered in this assessment
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[400px] pr-4">
            <div className="grid gap-4 py-4">
              {syllabusCompany?.topicList?.length ? (
                 <ul className="list-disc list-inside space-y-2">
                    {syllabusCompany.topicList.map((topic, index) => (
                      <li key={index} className="text-muted-foreground">{topic}</li>
                    ))}
                 </ul>
              ) : (
                <p className="text-muted-foreground">No specific syllabus information available.</p>
              )}
            </div>
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
