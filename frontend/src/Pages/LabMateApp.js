import React, { useRef, useState } from "react";
import "../index.css";

// Helper SVG for Plus icon
function PlusIcon() {
  return (
    <svg width="23" height="23" fill="none" stroke="currentColor" strokeWidth="3"
      strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" style={{pointerEvents:"none"}}>
      <line x1="12" y1="5" x2="12" y2="19"/>
      <line x1="5" y1="12" x2="19" y2="12"/>
    </svg>
  );
}

export default function LabMateApp() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileName, setFileName] = useState("");
  const [uploadStatus, setUploadStatus] = useState("");
  const [showBottomInput, setShowBottomInput] = useState(false);
  const hiddenFileInput = useRef();

  function handleAsk(e) {
    e.preventDefault();
    if (!question.trim()) return;
    setMessages(msgs => [
      ...msgs,
      { role: "user", text: question },
      { role: "bot", text: "This is a mock response from LabMate." }
    ]);
    setQuestion("");
    setShowBottomInput(true);
  }

  function handleAttachClick(e) {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  }

  function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      setFileName(e.target.files[0].name);
      setUploadStatus("Uploading...");
      setTimeout(() => setUploadStatus("File uploaded! (mock)"), 1200);
    }
  }

  // Input row with attach, input, send button
  const inputBar = (
    <form className="chatbot-input-row" onSubmit={handleAsk}>
      <button
        type="button"
        className="chatbot-attach-btn"
        title="Attach PDF"
        onClick={handleAttachClick}
        tabIndex={-1}
      >
        <PlusIcon />
        <input
          ref={hiddenFileInput}
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
        />
      </button>
      <input
        className="chatbot-text-input"
        type="text"
        placeholder="Ask anything"
        value={question}
        onChange={e => setQuestion(e.target.value)}
        autoFocus
      />
      <button className="chatbot-send-btn" type="submit">
        <span>Ask</span>
      </button>
    </form>
  );

  return (
    <div className="chatbot-main-wrapper">
      {/* Main Content: Greeting and Input */}
      {!showBottomInput && (
        <div className="chatbot-center-content">
          <div className="greeting">Good to see you, LabMate User.</div>
          {inputBar}
          {fileName && <div className="status-message">{uploadStatus} ({fileName})</div>}
        </div>
      )}
      {/* Messages and persistent input at bottom */}
      {showBottomInput && (
        <>
          <div className="chatbot-messages" style={{margin: "0 auto", marginTop: 24, marginBottom: 12}}>
            {messages.map((msg, i) => (
              <div key={i} className="message-row">
                <div className={`message-bubble ${msg.role === "user" ? "message-user" : "message-bot"}`}>
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="chatbot-bottom-content">
            {inputBar}
            {fileName && <div className="status-message">{uploadStatus} ({fileName})</div>}
          </div>
        </>
      )}
    </div>
  );
}
