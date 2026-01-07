export interface Song {
    _id: string;
    title: string;
    artist: string;
    album?: string;
    coverUrl: string;
    fileUrl: string;
    duration?: number;
    genres?: string[];
    likes?: number;
    plays?: number;
    size?: number;
    createdAt?: string;
    updatedAt?: string;
    uploadedBy?: string;
    fileKey?: string;
}