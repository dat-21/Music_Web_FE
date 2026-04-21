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
export interface SongCardProps {
    song: Song;
    isActive: boolean;
    isPlaying: boolean;
    onOpen: () => void;
    onTogglePlay: (event: React.MouseEvent<HTMLButtonElement>) => void;
}
