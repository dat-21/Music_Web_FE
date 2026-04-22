export interface ApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data?: T;
}

export interface UserDTO {
  id: string;
  username: string;
  email: string;
  role: 'user' | 'moderator' | 'admin';
  avatarUrl?: string;
  isVerified: boolean;
}

export const API_ENDPOINTS = {
  base: {
    api: '/api',
  },
  auth: {
    login: '/api/auth/login',
    logout: '/api/auth/logout',
    register: '/api/auth/register',
    me: '/api/auth/me',
  },
  songs: {
    list: '/api/music/songs',
    detail: (id: string) => `/api/music/songs/${id}`,
    upload: '/api/music/songs',
    update: (id: string) => `/api/music/songs/${id}`,
    approve: (id: string) => `/api/music/songs/${id}/approve`,
    pending: '/api/music/pending-songs',
    recommendations: '/api/music/recommendations',
  },
  playlist: {
    mine: '/api/music/my-playlists',
    list: '/api/music/playlists',
    create: '/api/music/playlists',
    detail: (id: string) => `/api/music/playlists/${id}`,
    addSong: (id: string) => `/api/music/playlists/${id}/songs`,
    removeSong: (id: string, songId: string) => `/api/music/playlists/${id}/songs/${songId}`,
  },
  admin: {
    users: '/api/music/users',
    userDetail: (id: string) => `/api/music/users/${id}`,
  },
  chatbot: {
    send: '/api/ai-chatbot/message',
    test: '/api/ai-chatbot/test',
    info: '/api/ai-chatbot/info',
  },
  history: {
    save: '/api/history/position',
    position: '/api/history/position',
    positionBySong: (songId: string) => `/api/history/position/${songId}`,
    list: '/api/history',
    remove: (songId: string) => `/api/history/${songId}`,
    clear: '/api/history/clear/all',
  },
} as const;