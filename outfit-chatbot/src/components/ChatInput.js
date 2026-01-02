// src/components/ChatInput.js
import React, { useState } from 'react';

function ChatInput({ onSend }) {
  const [text, setText] = useState('');

  const sendMessage = () => {
    if (!text) return;
    onSend(text);
    setText('');
  };

  return (
    <div className="chat-input">
      <input
        type="text"
        value={text}
        placeholder="Type your message..."
        onChange={(e) => setText(e.target.value)}
        onKeyDown={(e) => e.key === 'Enter' && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>
    </div>
  );
}

export default ChatInput;
