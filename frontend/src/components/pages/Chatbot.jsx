import React, { useState, useRef, useEffect } from 'react';
import axios from 'axios';
import { Send } from 'lucide-react';

function Chatbot() {
    const [message, setMessage] = useState('');
    const [chatHistory, setChatHistory] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken') || '');
    const [refreshToken, setRefreshToken] = useState(localStorage.getItem('refreshToken') || '');
    const chatContainerRef = useRef(null);

    // Auto-scroll chat history
    useEffect(() => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
        }
    }, [chatHistory]);

    // Function to handle token refresh
    const refreshAccessToken = async () => {
        try {
            const response = await axios.post('http://localhost:8001/api/token/refresh/', {
                refresh: refreshToken,
            });
            setAccessToken(response.data.access);
            localStorage.setItem('accessToken', response.data.access);
            return response.data.access;
        } catch (error) {
            console.error('Error refreshing token:', error);
            alert('Session expired. Please log in again.');
            localStorage.removeItem('accessToken');
            localStorage.removeItem('refreshToken');
            window.location.href = '/login'; // Redirect to login page
        }
    };

    // Handle sending messages
    const handleSendMessage = async (e) => {
        e.preventDefault();

        if (!message.trim()) {
            return; // Prevent sending empty messages
        }

        if (!accessToken) {
            return;
        }

        setIsLoading(true);

        try {
            // API request to send a message and receive the bot's response
            const res = await axios.post(
                'http://localhost:8001/api/chat-history/',  // Make sure this matches your backend endpoint
                { message },
                {
                    headers: { Authorization: `Bearer ${accessToken}` }, // Attach access token
                }
            );
             console.log(res)
            // After receiving the response, update the chat history with the bot's response
            setChatHistory([
                ...chatHistory,
                { message, response: 'Bot reply placeholder. Update backend to send actual response.' },
            ]);
            setMessage(''); // Clear input field
        } catch (error) {
            console.error('Error sending message:', error);

            // Handle unauthorized error (401) - Token may have expired
            if (error.response && error.response.status === 401) {
                console.log('Access token expired. Refreshing...');
                const newAccessToken = await refreshAccessToken(); // Refresh the token
                if (newAccessToken) {
                    // Retry the message sending after refreshing the token
                    handleSendMessage(e);
                }
            } else {
                alert('An error occurred while sending your message. Please try again.');
            }
        } finally {
            setIsLoading(false);
        }
    };

    return (
        <div className="flex flex-col h-screen bg-gray-100">
            <div className="bg-indigo-600 text-white p-4 text-xl font-bold shadow-md">
                E-Shop Bot
            </div>
            <div className="flex-1 overflow-hidden flex flex-col p-4">
                <div
                    ref={chatContainerRef}
                    className="flex-1 overflow-y-auto mb-4 space-y-4"
                >
                    {chatHistory.map((chat, index) => (
                        <div key={index} className="flex flex-col space-y-2">
                            <div className="flex justify-end">
                                <div className="bg-indigo-500 text-white p-3 rounded-lg max-w-xs">
                                    {chat.message}
                                </div>
                            </div>
                            <div className="flex justify-start">
                                <div className="bg-white text-gray-800 p-3 rounded-lg max-w-xs shadow">
                                    {chat.response}
                                </div>
                            </div>
                        </div>
                    ))}
                    {isLoading && (
                        <div className="flex justify-start">
                            <div className="bg-gray-200 text-gray-500 p-3 rounded-lg">
                                Bot is typing...
                            </div>
                        </div>
                    )}
                </div>
                <form onSubmit={handleSendMessage} className="flex space-x-2">
                    <input
                        type="text"
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        placeholder="Ask something..."
                        className="flex-1 p-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                    />
                    <button
                        type="submit"
                        disabled={isLoading}
                        className="bg-indigo-600 text-white p-2 rounded-lg hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 disabled:opacity-50"
                    >
                        <Send size={24} />
                    </button>
                </form>
            </div>
        </div>
    );
}

export default Chatbot;
