import React, { useState } from "react";

const Chatbot = () => {
  const [messages, setMessages] = useState([
    {
      sender: "bot",
      type: "text",
      content: "Hi! Tell me what outfit you need.",
    },
  ]);

  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;

    const userMessage = {
      sender: "user",
      type: "text",
      content: input,
    };

    setMessages([...messages, userMessage]);
    setInput("");
  };

  return (
    <div style={styles.chatContainer}>
      <div style={styles.messagesContainer}>
        {messages.map((msg, index) => (
          <div
            key={index}
            style={
              msg.sender === "user" ? styles.userMessage : styles.botMessage
            }
          >
            {msg.type === "text" && <p>{msg.content}</p>}
          </div>
        ))}
      </div>

      <div style={styles.inputContainer}>
        <input
          type="text"
          placeholder="Type your message..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
          style={styles.input}
        />
        <button onClick={handleSend} style={styles.button}>
          Send
        </button>
      </div>
    </div>
  );
};

const styles = {
  chatContainer: {
    width: "400px",
    height: "500px",
    border: "1px solid #ccc",
    display: "flex",
    flexDirection: "column",
    justifyContent: "space-between",
    backgroundColor: "#fff",
  },
  messagesContainer: {
    padding: "10px",
    overflowY: "auto",
    flex: 1,
  },
  userMessage: {
    textAlign: "right",
    marginBottom: "10px",
  },
  botMessage: {
    textAlign: "left",
    marginBottom: "10px",
  },
  inputContainer: {
    display: "flex",
    borderTop: "1px solid #ccc",
  },
  input: {
    flex: 1,
    padding: "10px",
    border: "none",
  },
  button: {
    padding: "10px",
    border: "none",
    backgroundColor: "#000",
    color: "#fff",
    cursor: "pointer",
  },
};

export default Chatbot;
