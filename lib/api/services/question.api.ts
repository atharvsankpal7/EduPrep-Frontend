import api from "@/lib/api/axios";

export const uploadQuestionFile = async (file: File): Promise<number> => {
  const formData = new FormData();
  formData.append("file", file);

  const response = await api.post("/question/uploadExcel", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });

  return response.status;
};
