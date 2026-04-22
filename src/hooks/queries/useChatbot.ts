// src/hooks/queries/useChatbot.ts
import { useQuery } from "@tanstack/react-query";
import { API_ENDPOINTS } from "@/contracts";
import axios from "@/api/axiosConfig";

export interface ChatbotInfo {
  name: string;
  version: string;
  status: string;
}

export interface ChatbotTest {
  success: boolean;
  message: string;
}

// Query keys tập trung
export const chatbotKeys = {
  all: ["chatbot"] as const,
  info: ["chatbot", "info"] as const,
  test: ["chatbot", "test"] as const,
};

/**
 * Lấy thông tin về chatbot
 */
export const useChatbotInfo = (enabled: boolean = true) =>
  useQuery<ChatbotInfo | undefined>({
    queryKey: chatbotKeys.info,
    queryFn: async (): Promise<ChatbotInfo | undefined> => {
      const res = await axios.get<ChatbotInfo>(
        API_ENDPOINTS.chatbot.info
      );
      return res.data;
    },
    enabled,
  });

/**
 * Test kết nối tới chatbot
 */
export const useChatbotTest = (enabled: boolean = false) =>
  useQuery<ChatbotTest | undefined>({
    queryKey: chatbotKeys.test,
    queryFn: async (): Promise<ChatbotTest | undefined> => {
      const res = await axios.get<ChatbotTest>(
        API_ENDPOINTS.chatbot.test
      );
      return res.data;
    },
    enabled,
  });
