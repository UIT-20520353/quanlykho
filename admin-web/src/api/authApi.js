import axiosClient, { handleResponse } from "./axiosClient";

const authApi = {
  login: (body) => {
    return handleResponse(axiosClient.post("/auth/login", body));
  },
  register: (body) => {
    return handleResponse(axiosClient.post("/auth/register", body));
  },
};

export default authApi;
