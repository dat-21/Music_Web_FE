import axios from 'axios';
import { env } from '@/config/env';
import { withApiError } from '../utils/apiError.utils';
import { API_ENDPOINTS } from '../contracts';
import type { ChatbotResponse } from '@/types';

const normalizedBaseUrl = env.API_URL.replace(/\/+$/, '').replace(/\/api$/, '');

const http = axios.create({
  baseURL: normalizedBaseUrl,
  withCredentials: true,
});


class ChatbotService {
  async sendMessage(
    message: string,
    languageCode: string = 'vi',
    filterLevel: number = 0.0,
  ): Promise<ChatbotResponse> {
    return withApiError(async () => {
      const res = await http.post<ChatbotResponse>(
        API_ENDPOINTS.chatbot.send,
        { message, languageCode, filterLevel },
      );
      return res.data;
    }, 'Không thể gửi tin nhắn');
  }

  async testConnection(): Promise<boolean> {
    try {
      const res = await http.get(API_ENDPOINTS.chatbot.test);
      return res.data.success;
    } catch {
      return false;
    }
  }
}

export default new ChatbotService();