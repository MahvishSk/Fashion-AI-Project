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
  const [selectedImage, setSelectedImage] = useState(null);

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
          occasion: input.trim(),
        }),
      });

      const data = await response.json();
      console.log("Backend Response:", data);

      if (!data) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            type: "text",
            content: "⚠️ Empty response from server.",
          },
        ]);
        return;
      }

      const imageUrl = data?.outfit?.imageUrl || data?.imageUrl || null;

      const stylingTips = data?.outfit?.stylingTips || data?.stylingTips || [];

      if (!imageUrl) {
        setMessages((prev) => [
          ...prev,
          {
            sender: "bot",
            type: "text",
            content: "⚠️ Image could not be generated. Please try again.",
          },
        ]);
        return;
      }

      const imageMessage = {
        sender: "bot",
        type: "image",
        imageUrl,
        source: data.source || "ai-generated",
      };

      setMessages((prev) => [...prev, imageMessage]);

      if (stylingTips.length > 0) {
        const tipsMessage = {
          sender: "bot",
          type: "text",
          content: "✨ Styling Tips:\n\n• " + stylingTips.join("\n• "),
        };

        setMessages((prev) => [...prev, tipsMessage]);
      }
    } catch (error) {
      console.error("Error:", error);

      setMessages((prev) => [
        ...prev,
        {
          sender: "bot",
          type: "text",
          content:
            "⚠️ Something went wrong while generating your outfit. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
    }
  };

  // Auto scroll
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
                <div className="outfit-card">
                  <div className="outfit-image-wrapper">
                    <img
                      src={msg.imageUrl}
                      alt="Outfit"
                      className="outfit-image"
                      onClick={() => setSelectedImage(msg.imageUrl)}
                      style={{ cursor: "pointer" }}
                    />
                    <div className={`source-badge ${msg.source}`}>
                      {msg.source === "ai-generated"
                        ? "🔥 AI Generated"
                        : "⚡ From Database"}
                    </div>
                  </div>
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

        {/* Image Fullscreen Modal */}
        {selectedImage && (
          <div className="image-modal" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Full View" />
          </div>
        )}

        {/* Input */}
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
