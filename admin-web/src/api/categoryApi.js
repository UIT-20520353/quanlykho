import axiosClient, { handleResponse } from "./axiosClient";

const categoryApi = {
  getAllCategories: (params) => {
    return handleResponse(axiosClient.get("/category", { params }));
  },
  createCategory: (body) => {
    return handleResponse(axiosClient.post("/category", body));
  },
  updateCategory: (id, body) => {
    return handleResponse(axiosClient.put(`/category/${id}`, body));
  },
};

export default categoryApi;
