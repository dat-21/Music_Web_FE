import { useCallback, useRef, useEffect } from 'react';
import { useAuthStore } from '../store';
import { updateListenPosition, getListenPosition } from '../api/history.api';

interface UseListenHistoryOptions {
  // Khoảng thời gian giữa các lần sync (ms)
  syncInterval?: number;
  // Thời gian debounce khi pause (ms)
  debounceTime?: number;
}

interface UseListenHistoryReturn {
  // Lấy vị trí đã lưu của bài hát
  fetchSavedPosition: (songId: string) => Promise<number>;
  // Lưu vị trí hiện tại
  savePosition: (songId: string, position: number) => void;
  // Bắt đầu sync định kỳ
  startPeriodicSync: (songId: string, getPosition: () => number) => void;
  // Dừng sync định kỳ
  stopPeriodicSync: () => void;
  // Lưu ngay lập tức (khi pause, đổi bài, thoát)
  saveImmediately: (songId: string, position: number) => Promise<void>;
}

/**
 * Hook quản lý việc lưu/load lịch sử nghe nhạc
 * - Có debounce để không spam API
 * - Chỉ hoạt động khi user đã đăng nhập
 */
export const useListenHistory = (
  options: UseListenHistoryOptions = {}
): UseListenHistoryReturn => {
  const { syncInterval = 10000, debounceTime = 1000 } = options;
  
  const { isAuthenticated } = useAuthStore();
  
  // Refs để theo dõi state
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastSavedPositionRef = useRef<number>(0);
  const lastSavedTimeRef = useRef<number>(0);
  const isSavingRef = useRef<boolean>(false);

  // Cleanup khi unmount
  useEffect(() => {
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current);
      }
      if (debounceRef.current) {
        clearTimeout(debounceRef.current);
      }
    };
  }, []);

  // Lấy vị trí đã lưu từ backend
  const fetchSavedPosition = useCallback(async (songId: string): Promise<number> => {
    if (!isAuthenticated || !songId) {
      return 0;
    }

    try {
      const data = await getListenPosition(songId);
      return data.position || 0;
    } catch (error) {
      console.error('Error fetching saved position:', error);
      return 0;
    }
  }, [isAuthenticated]);

  // Lưu vị trí với debounce
  const savePosition = useCallback((songId: string, position: number) => {
    if (!isAuthenticated || !songId) return;

    // Debounce: clear timeout cũ nếu có
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    debounceRef.current = setTimeout(async () => {
      // Kiểm tra nếu position thay đổi đáng kể (> 2 giây)
      const positionDiff = Math.abs(position - lastSavedPositionRef.current);
      const timeDiff = Date.now() - lastSavedTimeRef.current;

      // Chỉ save nếu position thay đổi > 2s hoặc đã > 5s từ lần save cuối
      if (positionDiff < 2 && timeDiff < 5000) {
        return;
      }

      if (isSavingRef.current) return;
      isSavingRef.current = true;

      try {
        await updateListenPosition(songId, Math.floor(position));
        lastSavedPositionRef.current = position;
        lastSavedTimeRef.current = Date.now();
      } catch (error) {
        console.error('Error saving listen position:', error);
      } finally {
        isSavingRef.current = false;
      }
    }, debounceTime);
  }, [isAuthenticated, debounceTime]);

  // Bắt đầu sync định kỳ
  const startPeriodicSync = useCallback((
    songId: string,
    getPosition: () => number
  ) => {
    if (!isAuthenticated || !songId) return;

    // Clear interval cũ nếu có
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
    }

    // Tạo interval mới
    intervalRef.current = setInterval(() => {
      const currentPosition = getPosition();
      
      // Kiểm tra nếu đang phát (position đang thay đổi)
      if (currentPosition > 0) {
        savePosition(songId, currentPosition);
      }
    }, syncInterval);
  }, [isAuthenticated, syncInterval, savePosition]);

  // Dừng sync định kỳ
  const stopPeriodicSync = useCallback(() => {
    if (intervalRef.current) {
      clearInterval(intervalRef.current);
      intervalRef.current = null;
    }
  }, []);

  // Lưu ngay lập tức (bypass debounce)
  const saveImmediately = useCallback(async (
    songId: string,
    position: number
  ): Promise<void> => {
    if (!isAuthenticated || !songId) return;

    // Clear debounce pending
    if (debounceRef.current) {
      clearTimeout(debounceRef.current);
    }

    // Chỉ lưu nếu position hợp lệ
    if (position <= 0) return;

    try {
      await updateListenPosition(songId, Math.floor(position));
      lastSavedPositionRef.current = position;
      lastSavedTimeRef.current = Date.now();
    } catch (error) {
      console.error('Error saving listen position immediately:', error);
    }
  }, [isAuthenticated]);

  return {
    fetchSavedPosition,
    savePosition,
    startPeriodicSync,
    stopPeriodicSync,
    saveImmediately,
  };
};

export default useListenHistory;
