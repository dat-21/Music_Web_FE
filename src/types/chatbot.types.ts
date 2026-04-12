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