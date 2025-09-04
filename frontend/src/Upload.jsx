import React, { useState } from "react";
import { uploadPDF } from "./Api";

export default function Upload({ onUploaded }) {
  const [file, setFile] = useState(null);
  const [status, setStatus] = useState("");

  const handleUpload = async () => {
    if (!file) { setStatus("Select a PDF first."); return; }
    setStatus("Uploading...");
    try {
      const data = await uploadPDF(file);
      setStatus(`Uploaded: ${data.filename}`);
      onUploaded?.(data.filename);
      localStorage.setItem("labmate_last_filename", data.filename);
    } catch (e) {
      console.error(e);
      setStatus("Upload failed.");
    }
  };

  return (
    <div style={{ display: "grid", gap: 8 }}>
      <input type="file" accept="application/pdf" onChange={(e) => setFile(e.target.files?.[0] ?? null)} />
      <button onClick={handleUpload}>Upload PDF</button>
      {status && <div>{status}</div>}
    </div>
  );
}
