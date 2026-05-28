import axios from "axios";

const API = axios.create({
  baseURL: "https://research-paper-tracker-c01m.onrender.com/api",
});

export default API;