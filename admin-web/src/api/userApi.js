import axiosClient, { handleResponse } from "./axiosClient";
import commonConstants from "@/app/constant";
const userApi = {
  getAllUser: (params) => {
    return handleResponse(
      axiosClient.get("/user", {
        params,
      })
    );
  },
  createUser: (body) => {
    return handleResponse(axiosClient.post("/user", body));
  },
  getUserDetail: (id) => {
    return handleResponse(axiosClient.get(`/user/${id}`));
  },
  updateUser: (id, body) => {
    return handleResponse(axiosClient.put(`/user/${id}`, body));
  },
};

export default userApi;
