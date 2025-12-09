import axios from "../axiosConfig";

export const addSongApi = (formData: FormData) =>
    axios.post("/music/songs", formData, { headers: { "Content-Type": "multipart/form-data" } });