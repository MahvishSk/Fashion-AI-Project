import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Chatbot.css";
import logo from "../assets/logo1.png";

const Chatbot = () => {
  const navigate = useNavigate();
  
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      type: "text",
      content: "Hi! I am your personal AI Fashion Stylist 👗✨\nWhat kind of outfit are you looking for today?",
    },
  ]);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      type: "text",
      content: input,
    };

    setMessages((prev) => [...prev, userMessage]);
    const currentInput = input; // Store input before clearing
    setInput("");
    setLoading(true);

    try {
      // Replace with your actual backend API
      const response = await fetch("http://localhost:5000/recommend-outfit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender: "female",
          bodyType: "curvy",
          skinTone: "fair",
          occasion: currentInput,
        }),
      });

      const data = await response.json();

      const botMessage = {
        sender: "bot",
        type: "image",
        imageUrl: data.outfit?.imageUrl || "https://via.placeholder.com/250",
        stylingTips: data.outfit?.stylingTips || ["Styling tips unavailable"],
      };

      setMessages((prev) => [...prev, botMessage]);
    } catch (error) {
      console.error("Error:", error);
      
      // Error message
      setMessages((prev) => [
        ...prev,
        { sender: "bot", type: "text", content: "Sorry, I couldn't fetch an outfit right now. Please try again!" },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Handle Enter key
  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="StyleU Logo" className="sidebar-logo" />
          <h2 className="brand-name">StyleU</h2>
        </div>

        <button className="new-chat-btn" onClick={() => setMessages([{ sender: "bot", type: "text", content: "Hi! Ask me for outfit ideas 👗✨" }])}>
          + New Chat
        </button>

        <input className="search-bar" type="text" placeholder="Search chats..." />

        <div className="chat-history"></div>

        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>
      </div>

      {/* Chat Section */}
      <div className="chat-section">
        <div className="main-title">
          StyleU – Your Personal AI Fashion Stylist
        </div>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender === "user" ? "user" : "bot"}`}>
              {msg.type === "text" && <p>{msg.content}</p>}

              {msg.type === "image" && (
                <div className="bot-image-container">
                  <img src={msg.imageUrl} alt="Outfit" className="bot-image" />
                  {msg.stylingTips?.map((tip, i) => (
                    <p key={i} className="styling-tip">• {tip}</p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message bot loading-message">
              <p>Generating your outfit... 💃</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* Chat Input */}
        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              rows="1"
              placeholder="Ask for a college look, party outfit, casual wear..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={handleKeyDown}
              className="chat-textarea"
            />
            <button onClick={handleSend} disabled={loading}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;