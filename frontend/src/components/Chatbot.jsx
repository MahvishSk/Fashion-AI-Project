import React, { useState, useEffect, useRef } from "react";
import "../styles/Chatbot.css";
import logo from "../assets/logo1.png";
const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      type: "text",
      content: "Hi! Ask me for outfit ideas 👗✨",
    },
  ]);

  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      type: "text",
      content: input,
    };

    const botReply = {
      sender: "bot",
      type: "text",
      content: "Generating your fashion suggestion...",
    };

    setMessages((prev) => [...prev, userMessage, botReply]);
    setInput("");

    // Reset textarea height
    if (textareaRef.current) {
      textareaRef.current.style.height = "auto";
    }
  };

  // Auto scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <div className="app-container">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="sidebar-header">
            <img
                src={logo}
                alt="StyleU Logo"
                className="sidebar-logo"
                />
                <h2 className="brand-name">StyleU</h2>
              </div>

        <button className="new-chat-btn">+ New Chat</button>

        <input
          className="search-bar"
          type="text"
          placeholder="Search chats..."
        />

        <div className="chat-history"></div>

        <button className="back-btn"> ← Home </button>
      </div>

      {/* Chat Section */}
      <div className="chat-section">

        <div className="main-title">
          StyleU – Your Personal AI Fashion Stylish
        </div>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.type === "text" && <p>{msg.content}</p>}
              {msg.type === "image" && (
                <img src={msg.content} alt="Generated Outfit" />
              )}
            </div>
          ))}
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
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSend();
                }
              }}
              className="chat-textarea"
            />
            <button onClick={handleSend}>➤</button>
          </div>
        </div>

      </div>
    </div>
  );
};

export default Chatbot;