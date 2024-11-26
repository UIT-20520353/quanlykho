import axiosClient, { handleResponse } from "./axiosClient";

const importApi = {
  getAllImportRecords: (params) => {
    return handleResponse(
      axiosClient.get("/import", {
        params,
      })
    );
  },
  createImportRecord: (body) => {
    return handleResponse(axiosClient.post("/import", body));
  },
  getImportById: (id) => {
    return handleResponse(axiosClient.get(`/import/${id}`));
  },
  updateImportRecord: (id, body) => {
    return handleResponse(axiosClient.put(`/update-detail/${id}`, body));
  },
  deleteImportRecord: (id) => {
    return handleResponse(axiosClient.delete(`/import/${id}`));
  },
};

export default importApi;
