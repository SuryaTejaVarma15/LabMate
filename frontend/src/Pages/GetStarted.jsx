import { Link } from "react-router-dom";
import "../index.css";

function GetStarted() {
  return (
    <div className="page-center-wrapper">
      <div className="page-top-content">
        <h1 className="page-heading">
          Welcome to <span className="title-highlight">LabMate</span>
        </h1>
        <p className="page-subtitle">Your smart lab assistant for manuals & Q&A</p>
      </div>
      <div className="page-card">
        <Link to="/signin" className="btn">
          Get Started
        </Link>
      </div>
    </div>
  );
}

export default GetStarted;
