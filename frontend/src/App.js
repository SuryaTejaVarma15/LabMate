import React, { useEffect, useState } from "react";
import Upload from "./Upload";
import Chat from "./Chat";

function App() {
  const [filename, setFilename] = useState("");
  useEffect(() => {
    const last = localStorage.getItem("labmate_last_filename");
    if (last) setFilename(last);
  }, []);
  return (
    <div style={{ maxWidth: 900, margin: "24px auto", padding: 16 }}>
      <h1>LabMate</h1>
      <div style={{ display: "grid", gap: 16, gridTemplateColumns: "1fr 1fr" }}>
        <div>
          <h3>1) Upload</h3>
          <Upload onUploaded={setFilename} />
        </div>
        <div>
          <h3>2) Ask</h3>
          <Chat filename={filename} />
        </div>
      </div>
    </div>
  );
}
export default App;
