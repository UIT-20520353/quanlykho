import axiosClient, { handleResponse } from "./axiosClient";

const productApi = {
  getAllProduct: (params) => {
    return handleResponse(
      axiosClient.get("/product", {
        params,
      })
    );
  },
  createProduct: (body) => {
    return handleResponse(axiosClient.post("/product", body));
  },
  getUserDetail: (id) => {
    return handleResponse(axiosClient.get(`/user/${id}`));
  },
  updateUser: (id, body) => {
    return handleResponse(axiosClient.put(`/user/${id}`, body));
  },
};

export default productApi;
