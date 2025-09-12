import React, { useState } from "react";
import Upload from "../Upload";
import Chat from "../Chat";
import "../App.css";

function LabMateApp() {
  const [filename, setFilename] = useState("");

  return (
    <div className="app">
      <h1 className="title">LabMate</h1>
      <div className="container">
        <div className="card">
          <Upload setFilename={setFilename} />
        </div>
        <div className="card">
          <Chat filename={filename} />
        </div>
      </div>
    </div>
  );
}

export default LabMateApp;
