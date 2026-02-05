import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export interface ChatMessage {
  userMessage: string;
  botResponse: string;
  languageCode: string;
  timestamp: Date;
}

export interface ChatbotResponse {
  success: boolean;
  data?: {
    userMessage: string;
    botResponse: string;
    languageCode: string;
    metadata: {
      responseId: number;
      resultCode: number;
    };
  };
  message?: string;
}

class ChatbotService {
  /**
   * Gửi tin nhắn đến chatbot
   */
  async sendMessage(
    message: string,
    languageCode: string = 'vi',
    filterLevel: number = 0.0
  ): Promise<ChatbotResponse> {
    try {
      const response = await axios.post<ChatbotResponse>(
        `${API_BASE_URL}/api/chatbot/message`,
        {
          message,
          languageCode,
          filterLevel
        }
      );
      return response.data;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    } catch (error: any) {
      if (axios.isAxiosError(error) && error.response) {
        return error.response.data;
      }
      throw new Error('Failed to send message to chatbot');
    }
  }

  /**
   * Kiểm tra kết nối với chatbot API
   */
  async testConnection(): Promise<boolean> {
    try {
      const response = await axios.get(`${API_BASE_URL}/api/chatbot/test`);
      return response.data.success;
    } catch (error) {
      console.error('Chatbot connection test failed:', error);
      return false;
    }
  }
}

export default new ChatbotService();
