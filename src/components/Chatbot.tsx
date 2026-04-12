import { useState, useRef, useEffect } from 'react';
import chatbotService from '@/services/chatbot.service';
import type { ChatMessage } from '@/types';

export default function Chatbot() {
    const [messages, setMessages] = useState<ChatMessage[]>([]);
    const [inputMessage, setInputMessage] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const messagesEndRef = useRef<HTMLDivElement>(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const handleSendMessage = async (e: React.FormEvent) => {
        e.preventDefault();

        if (!inputMessage.trim() || isLoading) return;

        const userMessage = inputMessage.trim();
        setInputMessage('');
        setIsLoading(true);

        // Thêm tin nhắn của user vào danh sách
        const newMessage: ChatMessage = {
            userMessage,
            botResponse: '',
            languageCode: 'vi',
            timestamp: new Date()
        };

        setMessages(prev => [...prev, newMessage]);

        try {
            const response = await chatbotService.sendMessage(userMessage, 'vi');

            if (response.success && response.data) {
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        userMessage: response.data!.userMessage,
                        botResponse: response.data!.botResponse,
                        languageCode: response.data!.languageCode,
                        timestamp: new Date()
                    };
                    return updated;
                });
            } else {
                // Xử lý lỗi
                setMessages(prev => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                        ...updated[updated.length - 1],
                        botResponse: 'Xin lỗi, tôi không thể trả lời lúc này. Vui lòng thử lại sau.'
                    };
                    return updated;
                });
            }
        } catch (error) {
            console.error('Chat error:', error);
            setMessages(prev => {
                const updated = [...prev];
                updated[updated.length - 1] = {
                    ...updated[updated.length - 1],
                    botResponse: 'Đã có lỗi xảy ra. Vui lòng thử lại.'
                };
                return updated;
            });
        } finally {
            setIsLoading(false);
        }
    };

    if (!isOpen) {
        return (
            <button
                onClick={() => setIsOpen(true)}
                className="fixed bottom-6 right-6 bg-blue-600 hover:bg-blue-700 text-white rounded-full p-4 shadow-lg transition-all duration-300 z-50"
                aria-label="Open chat"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                </svg>
            </button>
        );
    }

    return (
        <div className="fixed bottom-6 right-6 w-96 h-[600px] bg-white rounded-lg shadow-2xl flex flex-col z-50 border border-gray-200">
            {/* Header */}
            <div className="bg-blue-600 text-white p-4 rounded-t-lg flex justify-between items-center">
                <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                    <h3 className="font-semibold">Trợ lý ảo SimSimi</h3>
                </div>
                <button
                    onClick={() => setIsOpen(false)}
                    className="hover:bg-blue-700 rounded-full p-1 transition-colors"
                    aria-label="Close chat"
                >
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
                {messages.length === 0 && (
                    <div className="text-center text-gray-500 mt-8">
                        <p>👋 Xin chào! Tôi có thể giúp gì cho bạn?</p>
                    </div>
                )}

                {messages.map((msg, index) => (
                    <div key={index} className="space-y-2">
                        {/* User message */}
                        <div className="flex justify-end">
                            <div className="bg-blue-600 text-white rounded-lg px-4 py-2 max-w-[80%]">
                                {msg.userMessage}
                            </div>
                        </div>

                        {/* Bot response */}
                        {msg.botResponse && (
                            <div className="flex justify-start">
                                <div className="bg-white border border-gray-200 rounded-lg px-4 py-2 max-w-[80%]">
                                    {msg.botResponse}
                                </div>
                            </div>
                        )}
                    </div>
                ))}

                {isLoading && (
                    <div className="flex justify-start">
                        <div className="bg-white border border-gray-200 rounded-lg px-4 py-2">
                            <div className="flex space-x-2">
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce"></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
                                <div className="w-2 h-2 bg-gray-400 rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
                            </div>
                        </div>
                    </div>
                )}

                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={handleSendMessage} className="p-4 border-t border-gray-200 bg-white rounded-b-lg">
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={inputMessage}
                        onChange={(e) => setInputMessage(e.target.value)}
                        placeholder="Nhập tin nhắn..."
                        className="flex-1 border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isLoading}
                    />
                    <button
                        type="submit"
                        disabled={isLoading || !inputMessage.trim()}
                        className="bg-blue-600 hover:bg-blue-700 disabled:bg-gray-300 text-white rounded-lg px-4 py-2 transition-colors"
                    >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />
                        </svg>
                    </button>
                </div>
            </form>
        </div>
    );
}
