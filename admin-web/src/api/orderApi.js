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
  getOrderDetail: (id) => {
    return handleResponse(axiosClient.get(`/order/${id}`));
  },
  updateProduct: (id, body) => {
    return handleResponse(axiosClient.put(`/product/${id}`, body));
  },
  deleteProduct: (id) => {
    return handleResponse(axiosClient.delete(`/product/${id}`));
  },
};

export default orderApi;
