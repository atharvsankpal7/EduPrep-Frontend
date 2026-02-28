"use client";

import { useState, useEffect } from "react";
import { format } from "date-fns";
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
import {
  fetchAdminStudents,
  PaginationInfo,
  Student,
} from "@/lib/api/services/admin.api";

import { Loader2, Search, Filter, RefreshCw, Download } from "lucide-react";

export default function StudentsPage() {
  const [students, setStudents] = useState<Student[]>([]);
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

  useEffect(() => {
    fetchStudents();
  }, [pagination.page, pagination.limit, cityFilter, startDate, endDate, searchQuery]);

  const fetchStudents = async () => {
    setLoading(true);
    try {
      const data = await fetchAdminStudents({
        page: pagination.page,
        limit: pagination.limit,
        city: cityFilter,
        startDate,
        endDate,
        search: searchQuery,
      });

      setStudents(data.students);
      setPagination(data.pagination);

      if (!cities.length) {
        const uniqueCities = Array.from(
          new Set(
            data.students
              .map((student: Student) => student.city?.toLowerCase())
              .filter(Boolean)
          )
        ) as string[];
        setCities(uniqueCities);
      }
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

  const handleDownload = async () => {
    const XLSX = await import("xlsx");
    const studentsToExport = students.map((student) => ({
      Name: student.fullName,
      Email: student.email,
      City: student.city || "N/A",
      Contact: student.contactNumber || "N/A",
      "Registration Date": format(new Date(student.createdAt), "PPP"),
    }));

    const ws = XLSX.utils.json_to_sheet(studentsToExport);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Students");
    XLSX.writeFile(wb, "students.xlsx");
  };

  const handlePageChange = (page: number) => {
    setPagination((prev) => ({ ...prev, page }));
  };

  const handleLimitChange = (value: string) => {
    setPagination((prev) => ({ ...prev, limit: parseInt(value), page: 1 }));
  };

  const handleReset = () => {
    setCityFilter("");
    setStartDate(undefined);
    setEndDate(undefined);
    setSearchQuery("");
    setPagination((prev) => ({ ...prev, page: 1 }));
  };

  return (
    <div className="container py-10">
      <Card className="mb-6 shadow-lg">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">
            Student Management
          </CardTitle>
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

            <div className="w-full md:w-[120px] space-y-2">
              <label className="text-sm font-medium">Items per page</label>
              <Select value={pagination.limit.toString()} onValueChange={handleLimitChange}>
                <SelectTrigger className="transition-all hover:border-primary">
                  <SelectValue placeholder="10" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="10">10</SelectItem>
                  <SelectItem value="25">25</SelectItem>
                  <SelectItem value="50">50</SelectItem>
                  <SelectItem value="100">100</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="flex gap-2">
              <Button
                onClick={handleReset}
                variant="outline"
                className="flex-1 md:flex-none hover:bg-secondary"
              >
                <RefreshCw className="mr-2 h-4 w-4" />
                Reset
              </Button>
              <Button
                onClick={handleDownload}
                className="flex-1 md:flex-none bg-green-600 hover:bg-green-700"
              >
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
            Showing {students.length} of {pagination.total} students
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
                      <TableHead className="font-semibold">Name</TableHead>
                      <TableHead className="font-semibold">Email</TableHead>
                      <TableHead className="font-semibold">City</TableHead>
                      <TableHead className="font-semibold">Contact</TableHead>
                      <TableHead className="font-semibold">
                        Registration Date
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {students.length > 0 ? (
                      students.map((student) => (
                        <TableRow
                          key={student.id}
                          className="hover:bg-muted/50 transition-colors"
                        >
                          <TableCell className="font-medium">
                            {student.fullName}
                          </TableCell>
                          <TableCell>{student.email}</TableCell>
                          <TableCell>{student.city || "N/A"}</TableCell>
                          <TableCell>
                            {student.contactNumber || "N/A"}
                          </TableCell>
                          <TableCell>
                            {format(new Date(student.createdAt), "PPP")}
                          </TableCell>
                        </TableRow>
                      ))
                    ) : (
                      <TableRow>
                        <TableCell colSpan={5} className="text-center py-10">
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
