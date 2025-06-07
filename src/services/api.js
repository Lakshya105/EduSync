import axios from "axios";

// Create an Axios instance with the correct baseURL
const API = axios.create({
  baseURL: "https://edusyncback-eebwe4egcdawfhbf.westindia-01.azurewebsites.net/api"
});

// Attach token to every request if it exists
API.interceptors.request.use(
  config => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

export default API;
