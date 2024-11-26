import axiosClient, { handleResponse } from "./axiosClient";

const orderApi = {
  getAllOrders: (params) => {
    return handleResponse(
      axiosClient.get("/order", {
        params,
      })
    );
  },
  createOrder: (body) => {
    return handleResponse(axiosClient.post("/order", body));
  },
  getProductDetail: (id) => {
    return handleResponse(axiosClient.get(`/product/${id}`));
  },
  updateProduct: (id, body) => {
    return handleResponse(axiosClient.put(`/product/${id}`, body));
  },
  deleteProduct: (id) => {
    return handleResponse(axiosClient.delete(`/product/${id}`));
  },
};

export default orderApi;
