import React, { useState } from "react";
import axios from "axios";

export default function Chat({ filename }) {
  const [question, setQuestion] = useState("");
  const [answer, setAnswer] = useState("");

  const handleAsk = async () => {
    if (!filename) {
      setAnswer("⚠️ Please upload a PDF first.");
      return;
    }
    if (!question.trim()) {
      setAnswer("⚠️ Please enter a question.");
      return;
    }

    try {
      const res = await axios.post("http://127.0.0.1:5000/ask", {
        filename,
        question,
      });

      setAnswer(res.data.answer || "No answer received.");
    } catch (err) {
      console.error("Ask error:", err);
      setAnswer("❌ Error: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Ask Questions</h2>
      <input
        type="text"
        value={question}
        onChange={(e) => setQuestion(e.target.value)}
        placeholder="Enter your question"
        style={{ width: "70%", marginRight: 8 }}
      />
      <button onClick={handleAsk}>Ask</button>
      {answer && (
        <div style={{ marginTop: 16 }}>
          <h3>Answer:</h3>
          <p>{answer}</p>
        </div>
      )}
    </div>
  );
}

