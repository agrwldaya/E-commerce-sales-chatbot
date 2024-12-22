import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Navbar from '../Navbar';
 

const ChatInterface = () => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [sessionId, setSessionId] = useState('');
  const { sessionId: paramSessionId } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (paramSessionId) {
      setSessionId(paramSessionId);
      const storedMessages = localStorage.getItem(`chatHistory_${paramSessionId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    } else {
      // Generate a new session ID if one doesn't exist
      const storedSessionId = localStorage.getItem('chatSessionId');
      if (!storedSessionId) {
        const newSessionId = Date.now().toString();
        localStorage.setItem('chatSessionId', newSessionId);
        setSessionId(newSessionId);
      } else {
        setSessionId(storedSessionId);
      }

      // Load conversation history
      const storedMessages = localStorage.getItem(`chatHistory_${sessionId}`);
      if (storedMessages) {
        setMessages(JSON.parse(storedMessages));
      }
    }
  }, [paramSessionId, sessionId]);

  useEffect(() => {
    // Save conversation history
    if (messages.length > 0) {
      localStorage.setItem(`chatHistory_${sessionId}`, JSON.stringify(messages));
    }
  }, [messages, sessionId]);

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim()) {
      const newMessage = {
        id: Date.now(),
        text: input.trim(),
        sender: 'user',
        timestamp: new Date().toISOString(),
      };
      const updatedMessages = [...messages, newMessage];
      setMessages(updatedMessages);
      setInput('');
      logInteraction(newMessage);

      // Simulate bot response
      setTimeout(() => {
        const botResponse = {
          id: Date.now() + 1,
          text: "Thank you for your message. How can I assist you with your shopping today?",
          sender: 'bot',
          timestamp: new Date().toISOString(),
        };
        const updatedMessagesWithBot = [...updatedMessages, botResponse];
        setMessages(updatedMessagesWithBot);
        logInteraction(botResponse);
      }, 1000);
    }
  };

  const resetConversation = () => {
    setMessages([]);
    localStorage.removeItem(`chatHistory_${sessionId}`);
    logInteraction({ type: 'reset', timestamp: new Date().toISOString() });
    navigate('/chat');
  };

  const logInteraction = (interaction) => {
    const log = {
      sessionId,
      ...interaction,
    };
    console.log('Interaction logged:', log);
    // In a real application, you would send this log to your backend or analytics service
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col">
       
      <div className="flex-1 max-w-4xl w-full mx-auto mt-8 bg-white rounded-lg shadow-md flex flex-col">
        <div className="p-4 border-b flex justify-between items-center">
          <h2 className="text-xl font-semibold">Chat Session: {sessionId}</h2>
          <button
            onClick={resetConversation}
            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600 transition-colors"
          >
            Reset Conversation
          </button>
        </div>
        <div className="flex-1 p-4 overflow-y-auto">
          {messages.map((message) => (
            <div
              key={message.id}
              className={`mb-4 ${
                message.sender === 'user' ? 'text-right' : 'text-left'
              }`}
            >
              <div
                className={`inline-block p-2 rounded-lg ${
                  message.sender === 'user'
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-800'
                }`}
              >
                {message.text}
              </div>
              <div className="text-xs text-gray-500 mt-1">
                {new Date(message.timestamp).toLocaleString()}
              </div>
            </div>
          ))}
        </div>
        <form onSubmit={handleSendMessage} className="p-4 border-t">
          <div className="flex space-x-2">
            <input
              type="text"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Type your message..."
              className="flex-1 border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
            <button
              type="submit"
              className="px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Send
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default ChatInterface;

