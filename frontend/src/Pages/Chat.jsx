import { useState } from "react";

export default function Chat({ filename }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const handleSend = () => {
    if (!input.trim()) return;
    setMessages([...messages, { sender: "user", text: input }]);
    setInput("");
    // Placeholder bot reply
    setTimeout(() => {
      setMessages((prev) => [...prev, { sender: "bot", text: "Response..." }]);
    }, 500);
  };

  return (
    <div className="chat-container">
      <div className="chat-messages">
        {messages.map((msg, idx) => (
          <div key={idx} className={`message ${msg.sender}`}>
            {msg.text}
          </div>
        ))}
      </div>

      <div className="chat-input">
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Message LabMate..."
        />
        <button onClick={handleSend}>Send</button>
      </div>
    </div>
  );
}
