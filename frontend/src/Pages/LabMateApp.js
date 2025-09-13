import { useState } from "react";
import Upload from "../Upload"; // your existing component
import Chat from "../Chat";     // your existing component
import "../index.css";          // global CSS

export default function LabMateApp() {
  const [filename, setFilename] = useState("");

  return (
    <div className="app-container">
      <header className="dashboard-header">
        <h1 className="dashboard-title">LabMate Dashboard</h1>
      </header>

      <div className="dashboard-container">
        <div className="card dashboard-card">
          <h2 className="card-title">Upload Lab File</h2>
          <Upload setFilename={setFilename} />
        </div>

        <div className="card dashboard-card">
          <h2 className="card-title">Chat with LabMate</h2>
          <Chat filename={filename} />
        </div>
      </div>
    </div>
  );
}
