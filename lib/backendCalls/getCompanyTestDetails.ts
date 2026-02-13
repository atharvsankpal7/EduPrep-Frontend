import axios from "axios";
import { BACKEND_URL } from "../constant";
import { ICompanySpecificTestDetails } from "../type";

export const getCompanyTestDetails = async (company: string): Promise<ICompanySpecificTestDetails> => {
  try {
    const response = await axios.get(`${BACKEND_URL}/test/undergraduate/companySpecific/details`, {
      params: { company },
      withCredentials: true,
    });
    return response.data;
  } catch (error) {
    console.error("Failed to fetch company test details:", error);
    throw new Error("Failed to fetch company test details");
  }
};
