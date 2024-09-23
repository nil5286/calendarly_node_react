// src/axios.js
import axios from "axios";

// Create an instance of Axios with custom config
const axiosInstance = axios.create({
  baseURL: "http://localhost:3200/", // Set your base API URL here
  timeout: 10000, // Set a timeout for requests
  headers: {
    "Content-Type": "application/json",
    // You can add authorization headers or other default headers here if needed
  },
});

export default axiosInstance;
