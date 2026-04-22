// src/hooks/queries/index.ts
// ===== Songs ===== 
export {
  useAllSongs,
  useAllSongsWithPagination,
  useSongById,
  useSongRecommendations,
  usePendingSongs,
  songKeys,
  type SongListPayload,
} from './useSongs';

// ===== Auth =====
export {
  useCurrentUser,
  useIsAuthenticated,
  authKeys,
} from './useAuth';

// ===== Playlists =====
export {
  useMyPlaylists,
  usePublicPlaylists,
  usePlaylistById,
  playlistKeys,
  type PlaylistsResponse,
} from './usePlaylists';

// ===== History =====
export {
  useListenPosition,
  useListenHistory,
  historyKeys,
} from './useHistory';

// ===== Admin =====
export {
  useUsers,
  useUserDetail,
  adminKeys,
  type UsersListResponse,
} from './useAdmin';

// ===== Chatbot =====
export {
  useChatbotInfo,
  useChatbotTest,
  chatbotKeys,
  type ChatbotInfo,
  type ChatbotTest,
} from './useChatbot';
