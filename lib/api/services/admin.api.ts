import api from "@/lib/api/axios";

export interface Student {
  _id: string;
  email: string;
  fullName: string;
  role: string;
  city?: string;
  contactNumber?: string;
  createdAt: string;
  updatedAt: string;
}

export interface PaginationInfo {
  total: number;
  page: number;
  limit: number;
  pages: number;
}

type StudentsApiResponse = {
  data: {
    students: Student[];
    pagination: PaginationInfo;
  };
};

export type FetchStudentsParams = {
  page: number;
  limit: number;
  city?: string;
  startDate?: Date;
  endDate?: Date;
  search?: string;
};

export const fetchAdminStudents = async ({
  page,
  limit,
  city,
  startDate,
  endDate,
  search,
}: FetchStudentsParams): Promise<StudentsApiResponse["data"]> => {
  const queryParams = new URLSearchParams({
    page: page.toString(),
    limit: limit.toString(),
  });

  if (city && city !== "all") {
    queryParams.append("city", city);
  }
  if (startDate) {
    queryParams.append("startDate", startDate.toISOString());
  }
  if (endDate) {
    queryParams.append("endDate", endDate.toISOString());
  }
  if (search) {
    queryParams.append("search", search);
  }

  const response = await api.get<StudentsApiResponse>(
    `/admin/students?${queryParams.toString()}`
  );

  return response.data.data;
};
