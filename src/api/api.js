// API endpoints and configurations

const baseUrl =
  "https://0d2361e5-306a-4b1e-ba82-f7fefaa0a6aa.mock.pstmn.io/api";

const api = {
  uploadFile: {
    url: `${baseUrl}/upload`,
    config: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  },
  getSystemFields: { url: `${baseUrl}/fields`, config: { method: "GET" } },
  sendMapping: { url: `${baseUrl}/mapping` },
  confirm: {
    url: `${baseUrl}/confirm`,
    config: {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    },
  },
};

export default api;
