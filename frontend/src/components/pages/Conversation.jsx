import React from 'react';
import { Link } from 'react-router-dom';

const ConversationHistory = () => {
  const getSessions = () => {
    const sessions = [];
    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key.startsWith('chatHistory_')) {
        const sessionId = key.split('_')[1];
        const messages = JSON.parse(localStorage.getItem(key));
        const lastMessage = messages[messages.length - 1];
        sessions.push({
          id: sessionId,
          lastMessageTime: new Date(lastMessage.timestamp).toLocaleString(),
          messageCount: messages.length,
        });
      }
    }
    return sessions.sort((a, b) => b.id - a.id);
  };

  const sessions = getSessions();

  return (
    <div className="min-h-screen bg-gray-100">
      <div className="max-w-4xl mx-auto py-8">
        <h1 className="text-3xl font-bold mb-6">Conversation History</h1>
        {sessions.length === 0 ? (
          <p>No conversation history found.</p>
        ) : (
          <ul className="space-y-4">
            {sessions.map((session) => (
              <li key={session.id} className="bg-white rounded-lg shadow-md p-4">
                <Link to={`/chat/${session.id}`} className="block hover:bg-gray-50">
                  <div className="flex justify-between items-center">
                    <span className="font-semibold">Session {session.id}</span>
                    <span className="text-sm text-gray-500">{session.lastMessageTime}</span>
                  </div>
                  <div className="text-sm text-gray-600 mt-2">
                    {session.messageCount} messages
                  </div>
                </Link>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
};

export default ConversationHistory;

