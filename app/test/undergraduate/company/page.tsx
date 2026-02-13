"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Building2, BookOpen, ArrowLeft } from "lucide-react";
import { useRouter } from "next/navigation";
import { createTest } from "@/lib/backendCalls/createTest";
import { EducationLevel, ICompanySpecificTestDetails } from "@/lib/type";
import { useState, useEffect } from "react";
import { ErrorMessageDialog } from "@/components/test/error-message";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/lib/stores/auth-store";
import { getCompanyList } from "@/lib/backendCalls/company";
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

  const [companies, setCompanies] = useState<ICompanySpecificTestDetails[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedCompany, setSelectedCompany] = useState<ICompanySpecificTestDetails | null>(null);
  const [syllabusCompany, setSyllabusCompany] = useState<ICompanySpecificTestDetails | null>(null);

  useEffect(() => {
    const fetchCompanies = async () => {
      try {
        const data = await getCompanyList();
        // Fallback for demo if data is empty or undefined (since backend might not be ready)
        if (!data || data.length === 0) {
             // throw new Error("No companies found"); // Uncomment to strict check
             // For now, let's allow it to be empty and show empty state
             setCompanies([]);
        } else {
             setCompanies(data);
        }
      } catch (error) {
        console.error("Error fetching companies:", error);
        toast({
          title: "Error",
          description: "Failed to load company list.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCompanies();
  }, [toast]);

  const handleStartTest = async () => {
    if (!selectedCompany) return;

    if (!isAuthenticated) {
      toast({
        title: "Authentication Required",
        description: "Please sign in to take a company test",
        variant: "destructive",
      });
      router.push("/sign-in");
      return;
    }

    try {
      const response = await createTest({
        educationLevel: EducationLevel.Undergraduate,
        company: selectedCompany.companyName,
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
        <div className="container pt-8 pb-0 max-w-4xl mx-auto">
           <Button variant="ghost" onClick={() => setSelectedCompany(null)} className="gap-2 pl-0 hover:bg-transparent hover:text-primary">
            <ArrowLeft className="w-4 h-4" /> Back to Companies
          </Button>
        </div>
        <div className="-mt-8"> {/* Negative margin to pull TestInfoDisplay up if needed, or just let it flow */}
            <TestInfoDisplay
                title={`${selectedCompany.companyName} Mock Test`}
                description={`Comprehensive assessment tailored for ${selectedCompany.companyName} recruitment process.`}
                duration={selectedCompany.time}
                questionCount={selectedCompany.numberOfQuestions}
                onStart={handleStartTest}
                requirements={[
                "Valid ID proof",
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

        {loading ? (
          <div className="flex justify-center py-12">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
          </div>
        ) : companies.length === 0 ? (
             <div className="text-center py-12 text-muted-foreground">
                No company tests available at the moment.
             </div>
        ) : (
          <motion.div
            variants={container}
            initial="hidden"
            animate="show"
            className="grid gap-6 md:grid-cols-2"
          >
            {companies.map((company) => (
              <motion.div
                key={company.companyName}
                variants={item}
              >
                <Card className="h-full flex flex-col card-highlight glass-effect cursor-pointer hover:shadow-lg transition-all duration-300" onClick={() => setSelectedCompany(company)}>
                  <CardHeader>
                    <div className="flex items-center gap-4">
                      <div className="p-2 rounded-lg bg-gradient-ginger">
                        <Building2 className="w-6 h-6 text-white" />
                      </div>
                      <div>
                        <CardTitle>{company.companyName}</CardTitle>
                        <CardDescription>
                          {company.numberOfQuestions} Questions • {company.time} Minutes
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent className="flex-grow">
                    {/* Add any additional info here if needed */}
                  </CardContent>
                  <CardFooter>
                    <Button
                      variant="outline"
                      className="w-full gap-2 z-10"
                      onClick={(e) => {
                        e.stopPropagation();
                        setSyllabusCompany(company);
                      }}
                    >
                      <BookOpen className="w-4 h-4" />
                      View Syllabus
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>

      <Dialog open={!!syllabusCompany} onOpenChange={(open) => !open && setSyllabusCompany(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>{syllabusCompany?.companyName} Syllabus</DialogTitle>
            <DialogDescription>
              Topics covered in this assessment
            </DialogDescription>
          </DialogHeader>
          <ScrollArea className="h-[300px] w-full rounded-md border p-4">
            {syllabusCompany?.topicList && syllabusCompany.topicList.length > 0 ? (
              <ul className="list-disc list-inside space-y-2">
                {syllabusCompany.topicList.map((topic, index) => (
                  <li key={index} className="text-sm text-muted-foreground">
                    {topic}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="text-sm text-muted-foreground text-center py-4">
                No syllabus information available.
              </p>
            )}
          </ScrollArea>
        </DialogContent>
      </Dialog>
    </div>
  );
}
