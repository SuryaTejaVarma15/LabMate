import React, { useRef, useState } from "react";
import "../index.css";

// Helper SVG for Plus icon
function PlusIcon() {
  return (
    <svg
      width="23"
      height="23"
      fill="none"
      stroke="currentColor"
      strokeWidth="3"
      strokeLinecap="round"
      strokeLinejoin="round"
      viewBox="0 0 24 24"
      style={{ pointerEvents: "none" }}
    >
      <line x1="12" y1="5" x2="12" y2="19" />
      <line x1="5" y1="12" x2="19" y2="12" />
    </svg>
  );
}

export default function LabMateApp() {
  const [question, setQuestion] = useState("");
  const [messages, setMessages] = useState([]);
  const [fileName, setFileName] = useState(""); // backend-safe filename
  const [originalFileName, setOriginalFileName] = useState(""); // For display
  const [uploadStatus, setUploadStatus] = useState("");
  const [showBottomInput, setShowBottomInput] = useState(false);
  const hiddenFileInput = useRef();

  const BACKEND_URL = "http://127.0.0.1:5000"; // update if different

  // -------- Upload PDF --------
  async function handleFileChange(e) {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setOriginalFileName(file.name);
      setUploadStatus("Uploading...");

      const formData = new FormData();
      formData.append("file", file);

      try {
        const res = await fetch(`${BACKEND_URL}/upload`, {
          method: "POST",
          body: formData
        });

        const data = await res.json();

        if (res.ok) {
          setFileName(data.filename); // backend-safe filename
          setUploadStatus(
            `Uploaded & ingested (${data.text_chunks} pages, ${data.images} images)`
          );
        } else {
          setUploadStatus(`❌ Upload failed: ${data.error || "Unknown error"}`);
        }
      } catch (err) {
        setUploadStatus(`❌ Upload error: ${err.message}`);
      }
    }
  }

  function handleAttachClick() {
    if (hiddenFileInput.current) hiddenFileInput.current.click();
  }

  // -------- Ask Question --------
  async function handleAsk(e) {
    e.preventDefault();
    if (!question.trim() || !fileName) return;

    // Add user message
    setMessages((msgs) => [...msgs, { role: "user", text: question }]);

    try {
      const res = await fetch(`${BACKEND_URL}/ask`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          filename: fileName,
          question: question
        })
      });

      const data = await res.json();

      if (res.ok) {
        const botText = `Q: ${data.question}\n\n📄 Preview: ${data.preview_text}\n\nPages: ${data.total_pages}, Images: ${data.images_found}`;
        setMessages((msgs) => [...msgs, { role: "bot", text: botText }]);
      } else {
        setMessages((msgs) => [
          ...msgs,
          { role: "bot", text: `❌ Error: ${data.error || "Unknown error"}` }
        ]);
      }
    } catch (err) {
      setMessages((msgs) => [
        ...msgs,
        { role: "bot", text: `❌ Request failed: ${err.message}` }
      ]);
    }

    setQuestion("");
    setShowBottomInput(true);
  }

  // -------- Input Row --------
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
          style={{ display: "none" }}
        />
      </button>
      <input
        className="chatbot-text-input"
        type="text"
        placeholder="Ask anything"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        autoFocus
      />
      <button className="chatbot-send-btn" type="submit">
        <span>Ask</span>
      </button>
    </form>
  );

  return (
    <div className="chatbot-main-wrapper">
      {/* Greeting + Input (before first ask) */}
      {!showBottomInput && (
        <div className="chatbot-center-content">
          <div className="greeting">Good to see you, LabMate User.</div>
          {inputBar}
          {originalFileName && (
            <div className="status-message">
              {uploadStatus} ({originalFileName})
            </div>
          )}
        </div>
      )}

      {/* Chat messages + persistent input */}
      {showBottomInput && (
        <>
          <div
            className="chatbot-messages"
            style={{ margin: "0 auto", marginTop: 24, marginBottom: 12 }}
          >
            {messages.map((msg, i) => (
              <div key={i} className="message-row">
                <div
                  className={`message-bubble ${
                    msg.role === "user" ? "message-user" : "message-bot"
                  }`}
                >
                  {msg.text}
                </div>
              </div>
            ))}
          </div>
          <div className="chatbot-bottom-content">
            {inputBar}
            {originalFileName && (
              <div className="status-message">
                {uploadStatus} ({originalFileName})
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
