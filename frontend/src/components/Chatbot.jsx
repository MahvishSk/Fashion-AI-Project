import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import "../styles/Chatbot.css";
import logo from "../assets/logo1.png";

const MAX_CHATS = 9;

const Chatbot = () => {
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [outfitLoading, setOutfitLoading] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [favourites, setFavourites] = useState({});
  const [isPublic, setIsPublic] = useState(true);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const currentChat = chats.find((c) => c.id === currentChatId);
  const messages = currentChat ? currentChat.messages : [];

  // ─────────────────────────────────────────
  // FETCH USER PROFILE
  // ─────────────────────────────────────────
  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const user = auth.currentUser;
        if (!user) {
          navigate("/login");
          return;
        }

        const response = await fetch(
          `http://localhost:5000/get-profile/${user.uid}`,
        );
        const data = await response.json();

        if (data.success) {
          setUserProfile(data.profile);

          const greeting = {
            sender: "bot",
            type: "text",
            content: `Hi ${data.profile.fullName || "there"}! 👋✨\n\nI'm your personal AI Fashion Stylist.\n\nI already know your style profile!\nJust tell me — what's the occasion today?\n\nTry:\n• Wedding\n• Party\n• Office look\n• Casual college outfit\n• Date night`,
          };

          const saved = localStorage.getItem("styleu_chats");
          const previous = saved ? JSON.parse(saved) : [];
          const lastChat = previous[0];
          const lastHasMessages =
            lastChat && lastChat.messages && lastChat.messages.length > 1;

          if (lastHasMessages) {
            const newChat = {
              id: Date.now().toString(),
              title: "New Chat",
              messages: [greeting],
              conversationHistory: [],
            };
            const allChats = [newChat, ...previous].slice(0, MAX_CHATS);
            setChats(allChats);
            setCurrentChatId(newChat.id);
          } else if (previous.length > 0) {
            previous[0] = {
              ...previous[0],
              messages: [greeting],
              conversationHistory: [],
            };
            setChats(previous);
            setCurrentChatId(previous[0].id);
          } else {
            const newChat = {
              id: Date.now().toString(),
              title: "New Chat",
              messages: [greeting],
              conversationHistory: [],
            };
            setChats([newChat]);
            setCurrentChatId(newChat.id);
          }
        } else {
          createNewChatWithDefaultGreeting();
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        createNewChatWithDefaultGreeting();
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  const createNewChatWithDefaultGreeting = () => {
    const defaultGreeting = {
      sender: "bot",
      type: "text",
      content:
        "Hi! I am your personal AI Fashion Stylist 👗✨\nWhat kind of outfit are you looking for today?\n\nTry asking:\n• Party outfit\n• Office outfit\n• Casual college look\n• Wedding guest outfit",
    };

    const saved = localStorage.getItem("styleu_chats");
    const previous = saved ? JSON.parse(saved) : [];
    const lastChat = previous[0];
    const lastHasMessages =
      lastChat && lastChat.messages && lastChat.messages.length > 1;

    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [defaultGreeting],
      conversationHistory: [],
    };
    const allChats = lastHasMessages
      ? [newChat, ...previous].slice(0, MAX_CHATS)
      : [newChat, ...previous.slice(1)].slice(0, MAX_CHATS);

    setChats(allChats);
    setCurrentChatId(newChat.id);
  };

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  useEffect(() => {
    if (chats.length > 0) {
      const saved = localStorage.getItem("styleu_chats");
      const previous = saved ? JSON.parse(saved) : [];
      const merged = [...chats];
      previous.forEach((oldChat) => {
        if (!merged.find((c) => c.id === oldChat.id)) merged.push(oldChat);
      });
      localStorage.setItem(
        "styleu_chats",
        JSON.stringify(merged.slice(0, MAX_CHATS)),
      );
    }
  }, [chats]);

  const createNewChat = () => {
    const greeting = userProfile
      ? {
          sender: "bot",
          type: "text",
          content: `Hi ${userProfile.fullName || "there"}! 👋✨\n\nWhat occasion are we styling for today?`,
        }
      : {
          sender: "bot",
          type: "text",
          content: "Hi! What outfit are you looking for today? 👗✨",
        };

    const newChat = {
      id: Date.now().toString(),
      title: "New Chat",
      messages: [greeting],
      conversationHistory: [],
    };
    setChats((prev) => {
      let updated = [newChat, ...prev];
      if (updated.length > MAX_CHATS) updated = updated.slice(0, MAX_CHATS);
      return updated;
    });
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (chatId) => {
    const updated = chats.filter((chat) => chat.id !== chatId);
    setChats(updated);
    if (chatId === currentChatId) {
      if (updated.length > 0) setCurrentChatId(updated[0].id);
      else createNewChat();
    }
  };

  const updateMessages = (newMessages) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: newMessages } : chat,
      ),
    );
  };

  const updateConversationHistory = (history) => {
    setChats((prev) =>
      prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, conversationHistory: history }
          : chat,
      ),
    );
  };

  const toggleFavourite = async (imageUrl, outfitId) => {
    try {
      const user = auth.currentUser;
      if (!user) return;
      const favKey = outfitId || imageUrl.slice(-20);
      const favDocRef = doc(db, "users", user.uid, "favourites", favKey);
      if (favourites[favKey]) {
        await deleteDoc(favDocRef);
        setFavourites((prev) => {
          const u = { ...prev };
          delete u[favKey];
          return u;
        });
        alert("💔 Removed from favourites");
      } else {
        await setDoc(favDocRef, {
          imageUrl,
          outfitId: favKey,
          savedAt: serverTimestamp(),
          gender: userProfile?.gender || "",
          bodyType: userProfile?.bodyType || "",
          skinTone: userProfile?.skinTone || "",
        });
        setFavourites((prev) => ({ ...prev, [favKey]: true }));
        alert("❤️ Saved to favourites!");
      }
    } catch (error) {
      console.error("Error saving favourite:", error);
      alert("⚠️ Could not save favourite. Try again.");
    }
  };

  const downloadOutfit = async (imageUrl) => {
    try {
      const response = await fetch(imageUrl);
      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");
      link.href = url;
      link.download = `StyleU_Outfit_${Date.now()}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      window.open(imageUrl, "_blank");
    }
  };

  // ─────────────────────────────────────────
  // SEND MESSAGE
  // ─────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage = { sender: "user", type: "text", content: input };
    let updatedMessages = [...messages, userMessage];

    if (messages.length === 1) {
      const title = input.trim().substring(0, 30);
      setChats((prev) =>
        prev.map((chat) =>
          chat.id === currentChatId ? { ...chat, title } : chat,
        ),
      );
    }

    updateMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const currentHistory = currentChat?.conversationHistory || [];

      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: input,
          profile: userProfile || {
            fullName: "there",
            gender: "female",
            bodyType: "average",
            skinTone: "medium",
            height: "",
            age: "",
          },
          conversationHistory: currentHistory,
          isPublic,
        }),
      });

      const data = await response.json();

      if (data.type === "outfit") {
        setLoading(false);
        setOutfitLoading(true);

        const imageMessage = {
          sender: "bot",
          type: "image",
          imageUrl: data.outfit.imageUrl,
          outfitId: data.outfit.id,
          source: data.source || "ai-generated",
          showShareToggle: true, // ← flag to show checkbox below this image
        };

        updatedMessages = [...updatedMessages, imageMessage];
        updateConversationHistory([]);
        setOutfitLoading(false);
      } else if (data.type === "message") {
        updatedMessages = [
          ...updatedMessages,
          { sender: "bot", type: "text", content: data.reply },
        ];
        updateConversationHistory([
          ...currentHistory,
          { role: "user", content: input },
          { role: "assistant", content: data.reply },
        ]);
      }

      updateMessages(updatedMessages);
    } catch (error) {
      console.error("Chat error:", error);
      updateMessages([
        ...updatedMessages,
        {
          sender: "bot",
          type: "text",
          content: "⚠️ Something went wrong. Please try again.",
        },
      ]);
    } finally {
      setLoading(false);
      setOutfitLoading(false);
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  if (profileLoading) {
    return (
      <div className="app-container loading-screen">
        <p>✨ Loading your style profile...</p>
      </div>
    );
  }

  return (
    <div className="app-container">
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
              className={`chat-item ${chat.id === currentChatId ? "active" : ""}`}
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
              {msg.type === "text" && <p className="msg-text">{msg.content}</p>}

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

                  {/* ── SHARE CHECKBOX RIGHT BELOW IMAGE ── */}
                  {msg.showShareToggle && (
                    <div className="share-toggle">
                      <label className="share-label">
                        <input
                          type="checkbox"
                          checked={isPublic}
                          onChange={(e) => setIsPublic(e.target.checked)}
                          className="share-checkbox"
                        />
                        <span>🌟 Share this look to Trending Community</span>
                      </label>
                    </div>
                  )}

                  <div className="outfit-actions">
                    <button
                      className={`action-btn favourite-btn ${favourites[msg.outfitId || msg.imageUrl?.slice(-20)] ? "active" : ""}`}
                      onClick={() =>
                        toggleFavourite(msg.imageUrl, msg.outfitId)
                      }
                    >
                      {favourites[msg.outfitId || msg.imageUrl?.slice(-20)]
                        ? "❤️"
                        : "🤍"}{" "}
                      Save
                    </button>
                    <button
                      className="action-btn download-btn"
                      onClick={() => downloadOutfit(msg.imageUrl)}
                    >
                      ⬇️ Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {/* Typing indicator for normal messages */}
          {loading && (
            <div className="message bot loading-message">
              <p>💬 Typing...</p>
            </div>
          )}

          {/* Outfit generation loader */}
          {outfitLoading && (
            <div className="message bot loading-message">
              <p>✨ Styling your look...</p>
            </div>
          )}

          <div ref={messagesEndRef} />
        </div>

        {selectedImage && (
          <div className="image-modal" onClick={() => setSelectedImage(null)}>
            <img src={selectedImage} alt="Full View" />
          </div>
        )}

        <div className="input-container">
          <div className="input-wrapper">
            <textarea
              ref={textareaRef}
              rows="1"
              placeholder="Tell me the occasion — wedding, party, office..."
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = e.target.scrollHeight + "px";
              }}
              onKeyDown={handleKeyDown}
              className="chat-textarea"
            />
            <button onClick={handleSend} disabled={loading || outfitLoading}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;
