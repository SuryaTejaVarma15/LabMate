import React, { useState } from "react";
import { askQuestion } from "./Api";

export default function Chat({ filename }) {
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState([]);
  const [busy, setBusy] = useState(false);

  const send = async () => {
    const q = input.trim();
    if (!q) return;
    if (!filename) { setMessages((p) => [...p, { who: "system", text: "Upload a PDF first." }]); return; }
    setMessages((p) => [...p, { who: "you", text: q }]);
    setInput("");
    setBusy(true);
    try {
      const data = await askQuestion(filename, q);
      if (data.error) setMessages((p) => [...p, { who: "system", text: `Error: ${data.error}` }]);
      else setMessages((p) => [...p, { who: "bot", text: data.answer }]);
    } catch (e) {
      console.error(e);
      setMessages((p) => [...p, { who: "system", text: "Backend not reachable." }]);
    } finally { setBusy(false); }
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <div style={{ height: 320, border: "1px solid #ddd", padding: 8, overflowY: "auto", borderRadius: 8, background: "#fafafa" }}>
        {messages.map((m, i) => (
          <div key={i} style={{ margin: "6px 0" }}>
            <b>{m.who === "you" ? "You" : m.who === "bot" ? "LabMate" : "System"}:</b>{" "}
            <span style={{ whiteSpace: "pre-wrap" }}>{m.text}</span>
          </div>
        ))}
      </div>
      <div style={{ display: "flex", gap: 8 }}>
        <input value={input} onChange={(e) => setInput(e.target.value)} placeholder={filename ? "Ask a question..." : "Upload a PDF to start"} style={{ flex: 1, padding: 8 }} onKeyDown={(e) => { if (e.key === "Enter") send(); }} disabled={busy} />
        <button onClick={send} disabled={busy}>{busy ? "Asking..." : "Send"}</button>
      </div>
      {filename && <div style={{ fontSize: 12, color: "#666" }}>Using: {filename}</div>}
    </div>
  );
}
