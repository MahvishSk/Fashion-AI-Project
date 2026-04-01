import React, { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../firebase";
import { doc, setDoc, deleteDoc, serverTimestamp } from "firebase/firestore";
import "../styles/Chatbot.css";
import logo from "../assets/logo1.png";
import { Trash, Download } from 'lucide-react';

const MAX_CHATS = 9;

const loadChats = () => {
  try {
    const saved = localStorage.getItem("styleu_chats");
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

const saveChats = (chats) => {
  try {
    localStorage.setItem(
      "styleu_chats",
      JSON.stringify(chats.slice(0, MAX_CHATS)),
    );
  } catch {}
};

// ─────────────────────────────────────────
// OCCASION-BASED STYLING TIPS
// ─────────────────────────────────────────
const occasionTips = {
  wedding: [
    "Opt for pastel or jewel tones — avoid white to respect the bride.",
    "Choose breathable fabrics like chiffon or georgette for long events.",
    "Keep accessories elegant — less is more at weddings.",
  ],
  party: [
    "Bold colors and metallic shades make you stand out at parties.",
    "Statement earrings can elevate even a simple outfit.",
    "Choose comfortable heels you can actually dance in!",
  ],
  office: [
    "Stick to neutral tones — navy, grey, beige always look professional.",
    "Well-fitted clothing always looks more polished than oversized.",
    "A structured blazer instantly upgrades any office look.",
  ],
  casual: [
    "Layer pieces to add depth and interest to casual outfits.",
    "White sneakers pair effortlessly with almost any casual look.",
    "Mix textures like denim with cotton for an effortless vibe.",
  ],
  college: [
    "Go for comfort first — you'll be wearing this all day.",
    "A denim jacket is your best friend for college looks.",
    "Minimal accessories keep the look fresh and young.",
  ],
  "date night": [
    "Deep tones like burgundy and navy are perfect for romantic evenings.",
    "A touch of perfume and minimal jewellery goes a long way.",
    "Choose an outfit you feel confident in — confidence is the best accessory.",
  ],
  festival: [
    "Bright colors and prints are your best friends at festivals.",
    "Comfortable footwear is a must — you'll be on your feet all day.",
    "Layer light pieces you can remove as the day gets warmer.",
  ],
  beach: [
    "Light, flowy fabrics like linen work best in beach settings.",
    "Don't forget a wide-brim hat for sun protection and style.",
    "Neutral tones photograph beautifully against the sea.",
  ],
  formal: [
    "Classic cuts never go out of style for formal occasions.",
    "Invest in one good pair of heels that goes with everything.",
    "Keep makeup and accessories coordinated with your outfit.",
  ],
  brunch: [
    "Soft pastels and floral prints are perfect for brunch.",
    "A midi dress with sandals is the ideal brunch combo.",
    "Keep accessories light — small hoops and a dainty bag work great.",
  ],
  traditional: [
    "Embrace rich fabrics like silk, georgette, or cotton for traditional wear.",
    "Statement jewellery completes a traditional look beautifully.",
    "Choose colors that complement your skin tone for a radiant look.",
  ],
};

const defaultTips = [
  "Choose clothes that fit your body type for the most flattering look.",
  "Match your accessories to the tone of your outfit.",
  "Confidence is the best outfit — wear what makes you feel amazing!",
];

const getTipsForOccasion = (occasion) => {
  if (!occasion) return defaultTips;
  const key = occasion.toLowerCase();
  for (const [k, tips] of Object.entries(occasionTips)) {
    if (key.includes(k)) return tips;
  }
  return defaultTips;
};

// ─────────────────────────────────────────
// GREETING DETECTION
// ─────────────────────────────────────────
const greetingPatterns = [
  /^(hi+|hey+|hello+|hlo+|helo+|hii+|hiiii*|heyyy*)\s*[!.]*$/i,
  /^(good\s*(morning|evening|afternoon|night))\s*[!.]*$/i,
  /^(how\s*(are|r)\s*(you|u|ya))\s*[?!.]*$/i,
  /^(what'?s\s*up|wassup|sup|wsp)\s*[?!.]*$/i,
  /^(yo|hiya|howdy|greetings)\s*[!.]*$/i,
  /^(namaste|namaskar|salam|salaam)\s*[!.]*$/i,
];

const getGreetingReply = (name) => {
  const replies = [
    `Hey ${name}!👋✨So glad you're here!\n\nI'm StyleU — your personal AI fashion stylist. Ready to find you the perfect outfit?\n\nJust tell me the occasion:\n• Wedding 💍\n• Party 🎉\n• College 🎒\n• Office 💼\n• Date night 🌙`,
    `Hello ${name}!💕Welcome to StyleU!\n\nI'm here to help you dress your best for any occasion!\n\nWhat are we styling today?\n• Casual look\n• Formal outfit\n• Festive wear\n• Beach outfit`,
    `Hi ${name}! 🌸 Great to see you!\n\nYour personal stylist is ready! Tell me — what's the occasion and I'll find the perfect look for you! ✨`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
};

const getHowAreYouReply = (name) => {
  const replies = [
    `I'm doing amazing, ${name}! 💫 Ready to style you up!\n\nWhat occasion are we dressing for today? 👗`,
    `Feeling fabulous and ready to help you look fabulous too, ${name}! ✨\n\nTell me — what outfit do you need today?`,
  ];
  return replies[Math.floor(Math.random() * replies.length)];
};

const isGreeting = (msg) => greetingPatterns.slice(0, 2).some(p => p.test(msg.trim()));
const isHowAreYou = (msg) => greetingPatterns.slice(2).some(p => p.test(msg.trim()));

// ─────────────────────────────────────────
// MAIN COMPONENT
// ─────────────────────────────────────────
const Chatbot = () => {
  const navigate = useNavigate();

  const [chats, setChats] = useState([]);
  const [currentChatId, setCurrentChatId] = useState(null);
  const [input, setInput] = useState("");
  const [loadingState, setLoadingState] = useState("idle");
  const [selectedImage, setSelectedImage] = useState(null);
  const [userProfile, setUserProfile] = useState(null);
  const [profileLoading, setProfileLoading] = useState(true);
  const [favourites, setFavourites] = useState({});
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const messagesEndRef = useRef(null);
  const textareaRef = useRef(null);

  const currentChat = chats.find((c) => c.id === currentChatId);
  const messages = currentChat ? currentChat.messages : [];

  // ─────────────────────────────────────────
  // FETCH USER PROFILE ON LOAD
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

        const previous = loadChats();

        const greetingContent = data.success
          ? `Hi ${data.profile.fullName || "there"}! 👋✨\n\nI'm your personal AI Fashion Stylist.\n\nI already know your style profile!\nJust tell me — what's the occasion today?\n\nTry:\n• Wedding\n• Party\n• Office look\n• Casual college outfit\n• Date night`
          : "Hi! I am your personal AI Fashion Stylist👗✨\nWhat kind of outfit are you looking for today?\n\nTry asking:\n• Party outfit\n• Office outfit\n• Casual college look\n• Wedding guest outfit";

        if (data.success) setUserProfile(data.profile);

        const greeting = {
          sender: "bot",
          type: "text",
          content: greetingContent,
        };

        const lastChat = previous[0];
        const lastIsEmpty =
          lastChat &&
          lastChat.messages &&
          lastChat.messages.length === 1 &&
          lastChat.messages[0].sender === "bot";

        if (lastIsEmpty) {
          const updated = [...previous];
          updated[0] = {
            ...updated[0],
            messages: [greeting],
            conversationHistory: [],
          };
          setChats(updated);
          setCurrentChatId(updated[0].id);
          saveChats(updated);
        } else {
          const newChat = {
            id: Date.now().toString(),
            title: "New Chat",
            messages: [greeting],
            conversationHistory: [],
          };
          const allChats = [newChat, ...previous].slice(0, MAX_CHATS);
          setChats(allChats);
          setCurrentChatId(newChat.id);
          saveChats(allChats);
        }
      } catch (error) {
        console.error("Error fetching profile:", error);
        const previous = loadChats();
        const greeting = {
          sender: "bot",
          type: "text",
          content:
            "Hi! I am your personal AI Fashion Stylist👗✨\nWhat kind of outfit are you looking for today?",
        };
        const newChat = {
          id: Date.now().toString(),
          title: "New Chat",
          messages: [greeting],
          conversationHistory: [],
        };
        const allChats = [newChat, ...previous].slice(0, MAX_CHATS);
        setChats(allChats);
        setCurrentChatId(newChat.id);
        saveChats(allChats);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchProfile();
  }, []);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

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
      const updated = [newChat, ...prev].slice(0, MAX_CHATS);
      saveChats(updated);
      return updated;
    });
    setCurrentChatId(newChat.id);
  };

  const deleteChat = (chatId) => {
    setChats((prev) => {
      const updated = prev.filter((chat) => chat.id !== chatId);
      saveChats(updated);
      if (chatId === currentChatId) {
        if (updated.length > 0) setCurrentChatId(updated[0].id);
        else createNewChat();
      }
      return updated;
    });
  };

  const updateMessages = (newMessages) => {
    setChats((prev) => {
      const updated = prev.map((chat) =>
        chat.id === currentChatId ? { ...chat, messages: newMessages } : chat,
      );
      saveChats(updated);
      return updated;
    });
  };

  const updateConversationHistory = (history) => {
    setChats((prev) => {
      const updated = prev.map((chat) =>
        chat.id === currentChatId
          ? { ...chat, conversationHistory: history }
          : chat,
      );
      saveChats(updated);
      return updated;
    });
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
  // HANDLE SHARE CHECKBOX TOGGLE (per card)
  // ─────────────────────────────────────────
  const handleShareToggle = async (index, msg, checked) => {
    // Update this card's isPublic in messages
    const updatedMessages = messages.map((m, i) =>
      i === index ? { ...m, isPublic: checked } : m
    );
    updateMessages(updatedMessages);

    if (checked) {
      // User checked ON → save to trending
      try {
        await fetch("http://localhost:5000/save-to-trending", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            outfitId: msg.outfitId,
            imageUrl: msg.imageUrl,
            occasion: msg.occasion,
            gender: userProfile?.gender || "",
            bodyType: userProfile?.bodyType || "",
            skinTone: userProfile?.skinTone || "",
          }),
        });
      } catch (err) {
        console.error("Failed to share to trending:", err);
      }
    }
    // If unchecked → outfit stays private in Firebase
  };

  // ─────────────────────────────────────────
  // SEND MESSAGE
  // ─────────────────────────────────────────
  const handleSend = async () => {
    if (!input.trim() || loadingState !== "idle") return;

    const userMessage = { sender: "user", type: "text", content: input };
    let updatedMessages = [...messages, userMessage];

    if (messages.length === 1) {
      const title = input.trim().substring(0, 30);
      setChats((prev) => {
        const updated = prev.map((chat) =>
          chat.id === currentChatId ? { ...chat, title } : chat,
        );
        saveChats(updated);
        return updated;
      });
    }

    updateMessages(updatedMessages);
    const sentInput = input;
    setInput("");
    setLoadingState("typing");

    const name = userProfile?.fullName || "there";

    if (isGreeting(sentInput)) {
      await new Promise((r) => setTimeout(r, 700));
      const reply = getGreetingReply(name);
      updatedMessages = [
        ...updatedMessages,
        { sender: "bot", type: "text", content: reply },
      ];
      updateMessages(updatedMessages);
      updateConversationHistory([
        ...(currentChat?.conversationHistory || []),
        { role: "user", content: sentInput },
        { role: "assistant", content: reply },
      ]);
      setLoadingState("idle");
      return;
    }

    if (isHowAreYou(sentInput)) {
      await new Promise((r) => setTimeout(r, 700));
      const reply = getHowAreYouReply(name);
      updatedMessages = [
        ...updatedMessages,
        { sender: "bot", type: "text", content: reply },
      ];
      updateMessages(updatedMessages);
      updateConversationHistory([
        ...(currentChat?.conversationHistory || []),
        { role: "user", content: sentInput },
        { role: "assistant", content: reply },
      ]);
      setLoadingState("idle");
      return;
    }

    // ── Normal flow — send to backend ──
    try {
      const currentHistory = currentChat?.conversationHistory || [];

      const response = await fetch("http://localhost:5000/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          message: sentInput,
          profile: userProfile || {
            fullName: "there",
            gender: "female",
            bodyType: "average",
            skinTone: "medium",
            height: "",
            age: "",
          },
          conversationHistory: currentHistory,
        }),
      });

      const data = await response.json();

      if (data.type === "outfit") {
        setLoadingState("outfit");

        const tips = getTipsForOccasion(data.occasion);

        const imageMessage = {
          sender: "bot",
          type: "image",
          imageUrl: data.outfit.imageUrl,
          outfitId: data.outfit.id,
          source: data.source || "ai-generated",
          showShareToggle: true,
          occasion: data.occasion,
          stylingTips: tips,
          isPublic: false, // ✅ DEFAULT UNCHECKED — user must manually share
        };

        updatedMessages = [...updatedMessages, imageMessage];
        updateConversationHistory([]);
      } else if (data.type === "message") {
        updatedMessages = [
          ...updatedMessages,
          { sender: "bot", type: "text", content: data.reply },
        ];

        updateConversationHistory([
          ...currentHistory,
          { role: "user", content: sentInput },
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
      setLoadingState("idle");
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
        <p>✨ Loading your AI fashion stylist...</p>
      </div>
    );
  }

  return (
    <div className="app-container">

      <div
        className={`sidebar-overlay ${sidebarOpen ? "open" : ""}`}
        onClick={() => setSidebarOpen(false)}
      />

      {/* ── Sidebar ── */}
      <div className={`sidebar ${sidebarOpen ? "open" : ""}`}>
        <div className="sidebar-header">
          <img src={logo} alt="StyleU Logo" className="sidebar-logo" />
          <h2 className="brand-name">StyleU</h2>
        </div>

        <button
          className="new-chat-btn"
          onClick={() => { createNewChat(); setSidebarOpen(false); }}
        >
          + New Chat
        </button>

        <div className="chat-history">
          {chats.map((chat) => (
            <div
              key={chat.id}
              className={`chat-item ${chat.id === currentChatId ? "active" : ""}`}
            >
              <span onClick={() => { setCurrentChatId(chat.id); setSidebarOpen(false); }}>
                {chat.title}
              </span>
              <button
                className="delete-chat"
                onClick={() => deleteChat(chat.id)}
              >
                <Trash size={16} color="#dc3545" />
              </button>
            </div>
          ))}
        </div>

        <button className="back-btn" onClick={() => navigate("/home")}>
          ← Back to Home
        </button>
      </div>

      {/* ── Chat Section ── */}
      <div className="chat-section">

        <div className="mobile-topbar">
          <button className="sidebar-toggle" onClick={() => setSidebarOpen(true)}>
            ☰
          </button>
          <div className="main-title">StyleU – Your Personal AI Fashion Stylist</div>
        </div>

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

                  {/* STYLING TIPS */}
                  {msg.stylingTips && msg.stylingTips.length > 0 && (
                    <div className="styling-tips">
                      <p className="tips-title">💡 Styling Tips</p>
                      {msg.stylingTips.map((tip, i) => (
                        <p key={i} className="tip-item">
                          • {tip}
                        </p>
                      ))}
                    </div>
                  )}

                  {/* SHARE CHECKBOX — per card, uses msg.isPublic */}
                  {msg.showShareToggle && (
                    <div className="share-toggle">
                      <label className="share-label">
                        <input
                          type="checkbox"
                          checked={msg.isPublic === true}
                          onChange={(e) =>
                            handleShareToggle(index, msg, e.target.checked)
                          }
                          className="share-checkbox"
                        />
                        <span>🌟Share this look to Trending Community</span>
                      </label>
                    </div>
                  )}

                  <div className="outfit-actions">
                    <button
                      className={`action-btn favourite-btn ${favourites[msg.outfitId || msg.imageUrl?.slice(-20)] ? "active" : ""}`}
                      onClick={() => toggleFavourite(msg.imageUrl, msg.outfitId)}
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
                      <Download size={16} /> Download
                    </button>
                  </div>
                </div>
              )}
            </div>
          ))}

          {loadingState !== "idle" && (
            <div className="message bot loading-message">
              <div className="loading-bubble">
                <p className="loading-text">
                  {loadingState === "outfit"
                    ? "✨Your stylist is curating the perfect look..."
                    : "💬StyleU is thinking..."}
                </p>
                <div className="typing-indicator">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>
              </div>
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
            <button onClick={handleSend} disabled={loadingState !== "idle"}>
              ➤
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Chatbot;