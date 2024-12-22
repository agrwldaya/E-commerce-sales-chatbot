import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/pages/Login';
import Register from './components/pages/Register';
import ChatInterface from './components/pages/ChatInterFace';
import ConversationHistory from './components/pages/Conversation';
import Navbar from './components/Navbar';
import Chatbot from './components/pages/Chatbot';
 

const App = () => {
  return (
    <Router>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/chat" element={<ChatInterface />} />
        <Route path="/chat/:sessionId" element={<ChatInterface/>} />
        <Route path="/history" element={<ConversationHistory />} />
        <Route path="/chatbot" element={<Chatbot />} />
      </Routes>
    </Router>
  );
};

export default App;

