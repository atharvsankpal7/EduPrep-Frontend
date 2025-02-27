"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { format } from "date-fns";
import * as XLSX from 'xlsx';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { DatePicker } from "@/components/ui/date-picker";
import { Pagination } from "@/components/ui/pagination";
import { useToast } from "@/components/ui/use-toast";
import { BACKEND_URL } from "@/lib/constant";
import { useAuthStore } from "@/lib/stores/auth-store";

import { Loader2, Search, Filter, RefreshCw, Download } from "lucide-react";

interface Student {
  _id: string;
  urn: number;
  email: string;
  fullName: string;
  role: string;
  city?: string;
  contactNumber?: string;
  createdAt: string;
  updatedAt: string;
}

interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

export default function StudentsPage() {

  const [allStudents, setAllStudents] = useState<Student[]>([]);
  const [filteredStudents, setFilteredStudents] = useState<Student[]>([]);
  const [pagination, setPagination] = useState<PaginationInfo>({
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  });
  const [loading, setLoading] = useState(true);
  const [cityFilter, setCityFilter] = useState("");
  const [startDate, setStartDate] = useState<Date | undefined>(undefined);
  const [endDate, setEndDate] = useState<Date | undefined>(undefined);
  const [searchQuery, setSearchQuery] = useState("");
  const [cities, setCities] = useState<string[]>([]);
  
  const { toast } = useToast();
  const router = useRouter();
  const { user, isAuthenticated } = useAuthStore();

  useEffect(() => {
    if (isAuthenticated && user?.role !== "admin") {
      router.push("/");
      toast({
        title: "Access Denied",
        description: "You don't have permission to access this page.",
        variant: "destructive",
      });
    } else if (!isAuthenticated) {
      router.push("/sign-in");
    } else {
      fetchStudents();
    }
  }, [isAuthenticated, user, router]);


  useEffect(() => {
    filterStudents();
  }, [cityFilter, startDate, endDate, searchQuery, allStudents]);

  const filterStudents = () => {
    let filtered = [...allStudents];

    if (cityFilter && cityFilter !== "all") {
      filtered = filtered.filter(
        (student) => student.city?.toLowerCase() === cityFilter.toLowerCase()
      );
    }

    if (startDate) {
      filtered = filtered.filter(
        (student) => new Date(student.createdAt) >= startDate
      );
    }

    if (endDate) {
      filtered = filtered.filter(
        (student) => new Date(student.createdAt) <= endDate
      );
    }

    if (searchQuery) {
      filtered = filtered.filter((student) =>
        student.fullName.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    setFilteredStudents(filtered);
    setPagination(prev => ({
      ...prev,
      total: filtered.length,
      pages: Math.ceil(filtered.length / prev.limit)
    }));
  };

  const fetchStudents = async () => {
    setLoading(true);
    try {



















      const response = await fetch(`${BACKEND_URL}/admin/students`, {
        method: "GET",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch students");
      }

      const data = await response.json();


      setAllStudents(data.data.students);
      setFilteredStudents(data.data.students);
      











      const uniqueCities = Array.from(
        new Set(
          data.data.students
            .map((student: Student) => student.city?.toLowerCase())
            .filter(Boolean)
        )
      ) as string[];
      setCities(uniqueCities);
    } catch (error) {
      console.error("Error fetching students:", error);
      toast({
        title: "Error",
        description: "Failed to fetch students data.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = () => {
    const studentsToExport = filteredStudents.map(student => ({
      URN: student.urn,
      Name: student.fullName,
      Email: student.email,
      City: student.city || 'N/A',
      Contact: student.contactNumber || 'N/A',
      'Registration Date': format(new Date(student.createdAt), "PPP")
    }));

    const ws = XLSX.utils.json_to_sheet(studentsToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students.xlsx");
  };

  const handlePageChange = (page: number) => {

    setPagination(prev => ({ ...prev, page }));
  };

  const handleReset = () => {
    setCityFilter("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchQuery("");

    setFilteredStudents(allStudents);
  };



  const getCurrentPageStudents = () => {
    const start = (pagination.page - 1) * pagination.limit;
    const end = start + pagination.limit;
    return filteredStudents.slice(start, end);
  };

  return (
    <div className="container py-10">

      <Card className="mb-6 shadow-lg">
        <CardHeader>


          <CardTitle className="text-2xl font-bold">Student Management</CardTitle>
          <CardDescription className="text-gray-600">
            View and manage all registered students
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col gap-4 md:flex-row md:items-end">
            <div className="flex-1 space-y-2">
              <label className="text-sm font-medium">Search</label>
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  placeholder="Search by name"

                  className="pl-8 transition-all hover:border-primary"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                />
              </div>
            </div>
            
            <div className="w-full md:w-[180px] space-y-2">
              <label className="text-sm font-medium">City</label>
              <Select value={cityFilter} onValueChange={setCityFilter}>

                <SelectTrigger className="transition-all hover:border-primary">
                  <SelectValue placeholder="All Cities" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Cities</SelectItem>
                  {cities.map((city) => (
                    <SelectItem key={city} value={city}>
                      {city}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div className="w-full md:w-[180px] space-y-2">
              <label className="text-sm font-medium">From Date</label>
              <DatePicker date={startDate} setDate={setStartDate} />
            </div>
            
            <div className="w-full md:w-[180px] space-y-2">
              <label className="text-sm font-medium">To Date</label>
              <DatePicker date={endDate} setDate={setEndDate} />
            </div>
            
            <div className="flex gap-2">





              <Button onClick={handleReset} variant="outline" className="flex-1 md:flex-none hover:bg-secondary">
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button onClick={handleDownload} className="flex-1 md:flex-none bg-green-600 hover:bg-green-700">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>


      <Card className="shadow-lg">
        <CardHeader>

          <CardTitle className="text-xl font-semibold">Students List</CardTitle>
          <CardDescription>

            Showing {getCurrentPageStudents().length} of {filteredStudents.length} students
          </CardDescription>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex justify-center items-center py-10">
              <Loader2 className="h-8 w-8 animate-spin text-primary" />
            </div>
          ) : (
            <>
              <div className="rounded-md border">
                <Table>
                  <TableHeader>







                    <TableRow className="bg-muted/50">
                      <TableHead className="font-semibold">URN</TableHead>
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">City</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">Registration Date</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>



                    {getCurrentPageStudents().length > 0 ? (
                      getCurrentPageStudents().map((student) => (
                        <TableRow key={student._id} className="hover:bg-muted/50 transition-colors">
                          <TableCell>{student.urn}</TableCell>
                          <TableCell className="font-medium">{student.fullName}</TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.city || "N/A"}</TableCell>
                          <TableCell>{student.contactNumber || "N/A"}</TableCell>
                          <TableCell>
                            {format(new Date(student.createdAt), "PPP")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={6} className="text-center py-10">
                          No students found
                        </TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>

              <div className="flex items-center justify-center space-x-2 py-4">
                <Pagination
                  currentPage={pagination.page}
                  totalPages={pagination.pages}
                  onPageChange={handlePageChange}
                />
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}