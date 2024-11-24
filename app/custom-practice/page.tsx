"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { GraduationCap, Building2, Settings, ChevronRight } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { UndergraduateSection } from "@/components/custom-practice/undergraduate-section";
import { JuniorCollegeSection } from "@/components/custom-practice/junior-college-section";

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

export default function CustomPracticePage() {
  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Custom Practice Test</h1>
          <p className="text-muted-foreground">
            Choose your education level and customize your practice test
          </p>
        </div>

        <Tabs defaultValue="undergraduate" className="space-y-8">
          <TabsList className="grid w-full grid-cols-2 lg:w-[400px]">
            <TabsTrigger value="undergraduate">Undergraduate</TabsTrigger>
            <TabsTrigger value="junior-college">Junior College</TabsTrigger>
          </TabsList>

          <TabsContent value="undergraduate">
            <UndergraduateSection />
          </TabsContent>

          <TabsContent value="junior-college">
            <JuniorCollegeSection />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}