import axios from "axios";
import commonConstants from "@/app/constant";

const instance = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  headers: {
    "Content-Type": "application/json",
  },
});

instance.interceptors.request.use((config) => {
  const value = localStorage.getItem(commonConstants.LOCAL_STORAGE_KEY);
  config.headers.Authorization = `Bearer ${
    value ? JSON.parse(value).accessToken : ""
  }`;
  return config;
});

instance.interceptors.response.use(
  (value) => {
    return {
      ok: true,
      body: value.data,
      status: value.status,
      total: value.headers["x-total-count"],
    };
  },
  (error) => {
    const { data, status } = error.response;

    if (data.status === 401) {
      localStorage.removeItem(commonConstants.LOCAL_STORAGE_KEY);
    }

    return Promise.reject({
      ok: false,
      errors: data,
      status,
    });
  }
);

export const handleResponse = (response) => {
  return response.then((res) => res).catch((res) => res);
};

export default instance;
