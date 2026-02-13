"use client";

import { motion } from "framer-motion";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardFooter,
} from "@/components/ui/card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Building2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { createTest } from "@/lib/backendCalls/createTest";
import { fetchCompanies } from "@/lib/backendCalls/fetchCompanies";
import { EducationLevel, Company } from "@/lib/type";
import { useState, useEffect } from "react";
import { ErrorMessageDialog } from "@/components/test/error-message";
import { useToast } from "@/components/ui/use-toast";
import { useAuthStore } from "@/lib/stores/auth-store";

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
  const [companies, setCompanies] = useState<Company[]>([]);
  const [loading, setLoading] = useState(true);
  const [showError, setShowError] = useState(false);
  const [selectedCompany, setSelectedCompany] = useState<Company | null>(null);
  const { toast } = useToast();
  const { isAuthenticated } = useAuthStore();

  useEffect(() => {
    const loadCompanies = async () => {
      try {
        const data = await fetchCompanies();
        setCompanies(data);
      } catch (error) {
        console.error("Failed to load companies:", error);
        toast({
          title: "Error",
          description: "Failed to load companies. Please try again.",
          variant: "destructive",
        });
      } finally {
        setLoading(false);
      }
    };

    loadCompanies();
  }, [toast]);

  const handleStartTest = async (companyId: string) => {
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
        company: companyId,
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

  return (
    <div className="container py-8">
      <ErrorMessageDialog
        open={showError}
        onClose={() => setShowError(false)}
      />

      <Dialog open={!!selectedCompany} onOpenChange={(open) => !open && setSelectedCompany(null)}>
        <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{selectedCompany?.name} Syllabus</DialogTitle>
            <DialogDescription>
              Overview of topics covered in the assessment.
            </DialogDescription>
          </DialogHeader>
          <div className="mt-4 whitespace-pre-wrap">
            {selectedCompany?.syllabus ? (
              selectedCompany.syllabus.startsWith("http") ? (
                <a
                  href={selectedCompany.syllabus}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-blue-500 hover:underline"
                >
                  Click here to view syllabus
                </a>
              ) : (
                <p>{selectedCompany.syllabus}</p>
              )
            ) : (
              <p className="text-muted-foreground">No syllabus information available.</p>
            )}
          </div>
        </DialogContent>
      </Dialog>

      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Company-Specific Tests</h1>
          <p className="text-muted-foreground">
            Select a company to practice their specific test pattern
          </p>
        </div>

        {loading ? (
           <div className="flex justify-center items-center h-64">
             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
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
                key={company._id || (company as any).id}
                variants={item}
                className="cursor-pointer"
                onClick={() => handleStartTest(company._id || (company as any).id)}
              >
                <Card className="hover:shadow-lg transition-all duration-300 card-highlight glass-effect h-full flex flex-col justify-between">
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
                  <CardFooter className="pt-0">
                    <Button
                        variant="outline"
                        size="sm"
                        className="w-full mt-auto"
                        onClick={(e) => {
                            e.stopPropagation();
                            setSelectedCompany(company);
                        }}
                    >
                        View Syllabus
                    </Button>
                  </CardFooter>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}

        {!loading && companies.length === 0 && (
            <div className="text-center py-12 text-muted-foreground">
                No companies found.
            </div>
        )}
      </div>
    </div>
  );
}
