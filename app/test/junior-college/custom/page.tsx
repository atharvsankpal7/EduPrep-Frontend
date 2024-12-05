"use client"
import { CustomizedTest } from "@/components/custom-practice/customized-test";
import { juniorCollegeSubjects } from "@/lib/data/junior-college-subjects";
import React from "react";

interface Props {}

const custom = () => {
  return (
    <div className="container py-8">
      <div className="max-w-6xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">
            Junior College Test Preparation
          </h1>
          <p className="text-muted-foreground">
            Select subjects and topics to create your personalized practice test
          </p>
        </div>

        <CustomizedTest
          onBack={() => window.history.back()}
          subjects={juniorCollegeSubjects}
        />
      </div>
    </div>
  );
};

export default custom;
