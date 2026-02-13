import axios from "axios";
import { BACKEND_URL } from "../constant";
import { ICompanySpecificTestDetails } from "../type";

const backend_url = (BACKEND_URL || "http://localhost:5000/api/v1") + "/test/undergraduate/companySpecific";

export const getCompanyList = async (): Promise<ICompanySpecificTestDetails[]> => {
  try {
    const response = await axios.get<ICompanySpecificTestDetails[]>(backend_url, {
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch company list:", error);
    throw new Error("Failed to fetch company list");
  }
};
