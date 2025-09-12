import React, { useState } from "react";
import axios from "axios";

export default function Upload({ setFilename }) {
  const [selectedFile, setSelectedFile] = useState(null);
  const [message, setMessage] = useState("");

  const handleFileChange = (e) => {
    setSelectedFile(e.target.files[0]);
  };

  const handleUpload = async () => {
    if (!selectedFile) {
      setMessage("⚠️ Please select a file first.");
      return;
    }

    const formData = new FormData();
    formData.append("file", selectedFile);

    try {
      const res = await axios.post("http://127.0.0.1:5000/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });

      setMessage("✅ File uploaded: " + res.data.filename);
      setFilename(res.data.filename); // store in App.js
    } catch (err) {
      console.error("Upload error:", err);
      setMessage("❌ Upload failed: " + (err.response?.data?.error || err.message));
    }
  };

  return (
    <div style={{ padding: 16 }}>
      <h2>Upload PDF</h2>
      <input type="file" accept="application/pdf" onChange={handleFileChange} />
      <button onClick={handleUpload} style={{ marginLeft: 8 }}>Upload</button>
      {message && <p style={{ marginTop: 8 }}>{message}</p>}
    </div>
  );
}
