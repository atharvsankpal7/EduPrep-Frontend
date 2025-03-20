import React from "react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";
import Image from "next/image";

export default function About() {
  return (
    <ScrollArea className="h-full w-full">
      <div className="container mx-auto p-4">
        <div className="relative w-full h-[200px]">
          <Image
            src="https://www.adcet.ac.in/images/slider/slider-2.jpg"
            alt="ADCET Header"
            fill
            className="object-contain"
          />
        </div>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary">About ADCET</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              The Annasaheb Dange College of Engineering and Technology (ADCET),
              Ashta is one of the iconoic public institutions of higher
              technical education in Western Maharashtra, distinguished by its
              compassion to produce engineers with competence for improving the
              human condition and building the nation. Established in 1999,
              ADCET, Ashta is an Empowered Autonomous institute affiliated to
              Shivaji University, Kolhapur, Maharashtra and approved by AICTE,
              New Delhi. The institute is NAAC accredited with &quot;A++&quot; grade, ISO
              9001:2015 certified and runs programmes accredited by NBA, New
              Delhi. ADCET&apos;s campus is spread over 25 acres in the heart of
              the city of Ashta, Sangli, where 3000 undergraduate students build
              their lifelong friendships and connections while enjoying their
              educational journey.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary">Vision</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              To be a Leader in producing professionally competent engineers.
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6">
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary">Mission</h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              We, Annasaheb Dange College of Engineering & Technology, Ashta,
              are committed to achieve our vision by:
              <br />
              <br />
              • Imparting effective outcome based education
              <br />
              • Preparing students through skill oriented courses to excel in
              their profession with ethical values
              <br />
              • Promoting research to benefit the society
              <br />• Strengthening relationship with all the stakeholders
            </p>
          </CardContent>
        </Card>

        <Card className="mt-6 mb-6">
          <CardHeader>
            <h2 className="text-2xl font-bold text-primary">
              Salient Features
            </h2>
          </CardHeader>
          <CardContent>
            <p className="text-muted-foreground">
              • An Empowered Autonomous Institute
              <br />
              • NBA Accredited Programs
              <br />
              • NAAC &apos;A++&apos; GRADE Institute
              <br />
              • Accredited by TCS, Mumbai
              <br />
              • Modern state-of-art laboratories
              <br />
              • 500 Mbps leased line internet connectivity
              <br />
              • Excellent Hostel Facility
              <br />• Well qualified & experienced faculty members
            </p>
          </CardContent>
        </Card>
      </div>
    </ScrollArea>
  );
}
