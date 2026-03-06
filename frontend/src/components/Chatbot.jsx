import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Chatbot.css";
import logo from "../assets/logo1.png";

const MAX_CHATS = 9;

const defaultBotMessage = {
  sender: "bot",
  type: "text",
  content:
    "Hi! I am your personal AI Fashion Stylist 👗✨\nWhat kind of outfit are you looking for today?",
};

const Chatbot = () => {
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);

  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const currentChat = chats.find((chat) => chat.id === currentChatId);
  const messages = currentChat ? currentChat.messages : [];

  /* GENERATE CHAT TITLE */
  const generateTitle = (text) => {
    let title = text.trim();

    title = title.replace(/[^a-zA-Z0-9 ]/g, "");

    if (title.length > 30) {
      title = title.substring(0, 30);
    }

    title =
      title.charAt(0).toUpperCase() +
      title.slice(1);

    return title;
  };

  /* LOAD CHATS */
  useEffect(() => {
    const saved = localStorage.getItem("styleu_chats");

    if (saved) {
      const parsed = JSON.parse(saved);

      if (parsed.length > 0) {
        setChats(parsed);
        setCurrentChatId(parsed[0].id);
      } else {
        createNewChat();
      }
    } else {
      createNewChat();
    }
  }, []);

  /* SAVE CHATS */
  useEffect(() => {
    if (chats.length > 0) {
      localStorage.setItem("styleu_chats", JSON.stringify(chats));
    }
  }, [chats]);

  /* AUTO SCROLL */
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  /* CREATE NEW CHAT */
  const createNewChat = () => {
    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [defaultBotMessage],
    };

    setChats((prev) => {
      let updated = [newChat, ...prev];

      if (updated.length > MAX_CHATS) {
        updated = updated.slice(0, MAX_CHATS);
      }

      return updated;
    });

    setCurrentChatId(newChat.id);
  };

  /* DELETE CHAT */
  const deleteChat = (chatId) => {
    const updated = chats.filter((chat) => chat.id !== chatId);

    setChats(updated);

    if (chatId === currentChatId) {
      if (updated.length > 0) {
        setCurrentChatId(updated[0].id);
      } else {
        createNewChat();
      }
    }
  };

  /* UPDATE MESSAGES */
  const updateMessages = (newMessages) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: newMessages } : chat
      )
    );
  };

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      type: "text",
      content: input,
    };

    let updatedMessages = [...messages, userMessage];

    /* AUTO CHAT TITLE */
    if (messages.length === 1) {
      const title = generateTitle(input);

      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId ? { ...chat, title } : chat
        )
      );
    }

    updateMessages(updatedMessages);

    const currentInput = input;

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
          occasion: currentInput.trim(),
        }),
      });

      const data = await response.json();

      let imageUrl = null;
      let stylingTips = [];

      if (data.outfit) {
        imageUrl = data.outfit.imageUrl;
        stylingTips = data.outfit.stylingTips || [];
      } else if (data.outfits && data.outfits.length > 0) {
        imageUrl = data.outfits[0].imageUrl;
        stylingTips = data.outfits[0].stylingTips || [];
      } else if (data.imageUrl) {
        imageUrl = data.imageUrl;
        stylingTips = data.stylingTips || [];
      }

      if (!imageUrl) throw new Error("Image missing");

      const imageMessage = {
        sender: "bot",
        type: "image",
        imageUrl,
        source: data.source || "ai-generated",
      };

      updatedMessages = [...updatedMessages, imageMessage];

      if (stylingTips.length > 0) {
        const tipsMessage = {
          sender: "bot",
          type: "text",
          content: "✨ Styling Tips:\n\n• " + stylingTips.join("\n• "),
        };

        updatedMessages.push(tipsMessage);
      }

      updateMessages(updatedMessages);
    } catch (error) {
      updateMessages([
        ...updatedMessages,
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

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="app-container">
      {/* SIDEBAR */}
      <div className="sidebar">
        <div className="sidebar-header">
          <img src={logo} alt="StyleU Logo" className="sidebar-logo" />
          <h2 className="brand-name">StyleU</h2>
        </div>

        <button className="new-chat-btn" onClick={createNewChat}>
          + New Chat
        </button>

        <div className="chat-history">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${
                chat.id === currentChatId ? "active" : ""
              }`}
            >
              <span onClick={() => setCurrentChatId(chat.id)}>
                {chat.title}
              </span>

              <button
                className="delete-chat"
                onClick={() => deleteChat(chat.id)}
              >
                🗑
              </button>
            </div>
          ))}
        </div>

        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>
      </div>

      {/* CHAT AREA */}
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
              {msg.type === "text" && (
                <p style={{ whiteSpace: "pre-line" }}>{msg.content}</p>
              )}

              {msg.type === "image" && (
                <div className="outfit-card">
                  <div className="outfit-image-wrapper">
                    <img
                      src={msg.imageUrl}
                      alt="Outfit"
                      className="outfit-image"
                      onClick={() => setSelectedImage(msg.imageUrl)}
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
            <div className="message bot loading-message">
              <p>Generating your outfit... 💃</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {/* IMAGE MODAL */}
        {selectedImage && (
          <div className="image-modal" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Full View" />
          </div>
        )}

        {/* INPUT */}
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