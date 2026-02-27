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
    setInput("");
    setLoading(true);

    try {
      const response = await fetch("http://localhost:5000/recommend-outfit", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          gender: "female",
          bodyType: "curvy",
          skinTone: "fair",
          occasion: input,
        }),
      });

      const data = await response.json();

      const imageMessage = {
        sender: "bot",
        type: "image",
        imageUrl: data.outfit.imageUrl,
        stylingTips: data.outfit.stylingTips,
      };

      setMessages((prev) => [...prev, imageMessage]);
      setLoading(false);
    } catch (error) {
      console.error("Error:", error);
      setLoading(false);
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
          <img src={logo} alt="StyleU Logo" className="sidebar-logo" />
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
          StyleU – Your Personal AI Fashion Stylist
        </div>

        <div className="messages-container">
          {messages.map((msg, index) => (
            <div
              key={index}
              className={`message ${msg.sender === "user" ? "user" : "bot"}`}
            >
              {msg.type === "text" && <p>{msg.content}</p>}

              {msg.type === "image" && (
                <div>
                  <img src={msg.imageUrl} alt="Outfit" width="250" />
                  {msg.stylingTips?.map((tip, i) => (
                    <p key={i}>• {tip}</p>
                  ))}
                </div>
              )}
            </div>
          ))}

          {loading && (
            <div className="message bot">
              <p>Generating your outfit... Please wait.</p>
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