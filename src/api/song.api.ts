import axios from "./axiosConfig";

export const getAllSongsApi = () =>
    axios.get("/music/songs");
export const getSongByIdApi = (id: string) =>
    axios.get(`/music/songs/${id}`);

