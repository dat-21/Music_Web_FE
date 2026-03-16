import axios from "../axiosConfig";

// ===== Song APIs =====
export const addSongApi = (formData: FormData) =>
    axios.post("/music/songs", formData, { headers: { "Content-Type": "multipart/form-data" } });

export const deleteSongApi = (songId: string) =>
    axios.delete(`/music/songs/${songId}`);