import axios from "axios";

export const axiosClient = axios.create({
  timeout: 300000,
  headers: {
    "Content-Type": "application/json",
  },
});
