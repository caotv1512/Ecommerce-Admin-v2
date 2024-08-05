import axiosClient from "./axiosClient";

export const getCategoryApi = async () => {
  return await axiosClient.get("/category");
};