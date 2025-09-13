import { Link } from "react-router-dom";
import "../index.css";

function GetStarted() {
  return (
    <div className="full-screen">
      <div className="card">
        <h1 className="title">
          Welcome to <span className="title-highlight">LabMate</span>
        </h1>
        <p className="subtitle">
          Your smart lab assistant for manuals & Q&A
        </p>
        <Link to="/signin" className="btn">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default GetStarted;
