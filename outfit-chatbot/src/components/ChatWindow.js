// src/components/ChatWindow.js
import React, { useState, useEffect } from 'react';
import Message from './Message';
import ChatInput from './ChatInput';

function ChatWindow() {
  const [messages, setMessages] = useState([]);
  const [loading, setLoading] = useState(false);

  // 👋 Initial greeting
  useEffect(() => {
    setMessages([
      {
        sender: 'bot',
        text: '👋 Hi! I’m your Outfit Recommendation Assistant.\nType anything to get outfit suggestions.\n\nType /image to try image-based suggestions (coming soon).'
      }
    ]);
  }, []);

  const handleUserMessage = async (msg) => {
    // Show user message
    setMessages(prev => [...prev, { sender: 'user', text: msg }]);

    // 🖼️ IMAGE COMMAND
    if (msg.trim().toLowerCase().startsWith('/image')) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: '🛠️ Image-based outfit suggestions are coming soon!'
      }]);
      return; // ❗ Do NOT call backend
    }

    // 👗 NORMAL OUTFIT FLOW
    setLoading(true);

    try {
      const response = await fetch('http://localhost:5000/recommend-outfit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },

        // TEMP: static data (replace later with conversation flow)
        body: JSON.stringify({
          gender: 'female',
          bodyType: 'athletic',
          skinTone: 'fair',
          occasion: 'party'
        }),
      });

      const data = await response.json();

      if (data.success && data.outfits.length > 0) {
        const reply = data.outfits
          .map((o, i) => `✨ Outfit ${i + 1}: ${o.name}\n📝 ${o.description}`)
          .join('\n\n');

        setMessages(prev => [...prev, { sender: 'bot', text: reply }]);
      } else {
        setMessages(prev => [...prev, {
          sender: 'bot',
          text: data.message || 'No outfits found.'
        }]);
      }
    } catch (error) {
      setMessages(prev => [...prev, {
        sender: 'bot',
        text: '❌ Error connecting to server.'
      }]);
    }

    setLoading(false);
  };

  return (
    <div className="chat-window">
      <div className="messages-list">
        {messages.map((m, i) => (
          <Message key={i} message={m} />
        ))}
        {loading && <div className="message bot">Bot is typing...</div>}
      </div>

      <ChatInput onSend={handleUserMessage} />
    </div>
  );
}

export default ChatWindow;
