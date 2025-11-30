import axios from "./axiosConfig";

export const loginApi = (username: string, password: string) =>
  axios.post("/auth/login", { username, password });

export const logoutApi = () =>
  axios.post("/auth/logout");

export const getCurrentUserApi = () =>
  axios.get("/auth/me");
