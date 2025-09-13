import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GetStarted from "./Pages/GetStarted";
import SignIn from "./Pages/SignIn";
import SignUp from "./Pages/SignUp";
import LabMateApp from "./Pages/LabMateApp";
import "./index.css"; // OK to import here too but index.js already imports it; leaving this is harmless

export default function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/signup" element={<SignUp />} />
        <Route path="/chatbot" element={<LabMateApp />} />
      </Routes>
    </Router>
  );
}
