import React from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { ScrollArea } from "@/components/ui/scroll-area";

const BTECH_PROGRAMS = [
  { id: 1, name: 'Mechanical Engineering', code: '628361210', intake: 120, year: 1999 },
  { id: 2, name: 'Computer Science & Engineering', code: '628324210', intake: 180, year: 2001 },
  { id: 3, name: 'Electrical Engineering', code: '628329310', intake: 120, year: 2004 },
  { id: 4, name: 'Civil Engineering', code: '628319110', intake: 60, year: 2010 },
  { id: 5, name: 'Aeronautical Engineering', code: '628300210', intake: 60, year: 2013 },
  { id: 6, name: 'Food Technology', code: '628350310', intake: 30, year: 2019 },
  { id: 7, name: 'Artificial Intelligence and Data Science', code: '628326310', intake: 60, year: 2021 },
  { id: 8, name: 'Computer Science & Engg. (Internet of Things and Cyber Security Including Block Chain Technology.)', code: '628392010', intake: 60, year: 2021 },
];

const OTHER_PROGRAMS = [
  { id: 1, name: 'Bachelor of Business Administration (BBA)', code: '', intake: 60, year: 2024 },
  { id: 2, name: 'Bachelor of Computer Application (BCA)', code: '', intake: 60, year: 2024 },
];

function ProgramTable({ title, data }: { title: string; data: typeof BTECH_PROGRAMS }) {
  return (
    <Card className="mb-8">
      <CardHeader className="bg-primary">
        <CardTitle className="text-white">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[100px]">Sr. No</TableHead>
              <TableHead className="w-[300px]">Programs</TableHead>
              <TableHead>Program Code</TableHead>
              <TableHead>Intake</TableHead>
              <TableHead>Year</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {data.map((program) => (
              <TableRow key={program.id}>
                <TableCell>{program.id}</TableCell>
                <TableCell>{program.name}</TableCell>
                <TableCell>{program.code || '-'}</TableCell>
                <TableCell>{program.intake}</TableCell>
                <TableCell>{program.year}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
}

export default function Programs() {
  return (
    <div className="container py-8">
      <ScrollArea className="h-full">
        <h1 className="text-3xl font-bold text-primary text-center mb-8">
          Academic Programs
        </h1>
        <ProgramTable title="B.Tech Programs" data={BTECH_PROGRAMS} />
        <ProgramTable title="Other Programs" data={OTHER_PROGRAMS} />
      </ScrollArea>
    </div>
  );
}