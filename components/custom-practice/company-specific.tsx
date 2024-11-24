"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { ChevronLeft, Building2, Play } from "lucide-react";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";

const companies = [
  {
    id: "microsoft",
    name: "Microsoft",
    description: "Technical and aptitude assessment pattern",
    logo: Building2,
  },
  {
    id: "google",
    name: "Google",
    description: "Coding and problem-solving focused",
    logo: Building2,
  },
  {
    id: "amazon",
    name: "Amazon",
    description: "Leadership principles and coding rounds",
    logo: Building2,
  },
  // Add more companies as needed
];

interface CompanySpecificProps {
  onBack: () => void;
}

export function CompanySpecific({ onBack }: CompanySpecificProps) {
  const [selectedCompany, setSelectedCompany] = useState<string | null>(null);

  const startTest = () => {
    // Implement test start logic
    console.log("Starting test for company:", selectedCompany);
  };

  return (
    <div className="space-y-6">
      <Button variant="ghost" onClick={onBack} className="gap-2">
        <ChevronLeft className="w-4 h-4" /> Back
      </Button>

      <div className="grid gap-6 md:grid-cols-3">
        {companies.map((company) => (
          <Card
            key={company.id}
            className={`cursor-pointer transition-all duration-300 ${
              selectedCompany === company.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedCompany(company.id)}
          >
            <CardHeader>
              <div className="flex items-center gap-4">
                <div className="p-2 rounded-lg bg-gradient-blue">
                  <company.logo className="w-6 h-6 text-white" />
                </div>
                <div>
                  <CardTitle className="text-lg">{company.name}</CardTitle>
                  <CardDescription>{company.description}</CardDescription>
                </div>
              </div>
            </CardHeader>
          </Card>
        ))}
      </div>

      {selectedCompany && (
        <div className="flex justify-end">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button className="gap-2">
                <Play className="w-4 h-4" /> Start Company Test
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Start Company Specific Test?</AlertDialogTitle>
                <AlertDialogDescription>
                  This test is designed to match {companies.find(c => c.id === selectedCompany)?.name}'s assessment pattern.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={startTest}>Start Test</AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
        </div>
      )}
    </div>
  );
}