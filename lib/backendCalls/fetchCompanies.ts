import axios from "axios";
import { BACKEND_URL } from "../constant";
import { Company } from "../type";

export const fetchCompanies = async (): Promise<Company[]> => {
  try {
    // Assuming the endpoint is /test/company based on conventions in createTest.ts
    const response = await axios.get(`${BACKEND_URL}/test/company`, {
      withCredentials: true,
    });

    // Handle different possible response structures
    if (Array.isArray(response.data)) {
      return response.data;
    } else if (response.data && Array.isArray(response.data.data)) {
      return response.data.data;
    } else if (response.data && response.data.companies && Array.isArray(response.data.companies)) {
        return response.data.companies;
    }

    console.warn("Unexpected response format for companies:", response.data);
    return [];
  } catch (error) {
    console.error("Failed to fetch companies:", error);
    // Return empty array instead of throwing to prevent page crash, or throw to show error dialog
    // Allowing the caller to handle the error is better.
    throw error;
  }
};
