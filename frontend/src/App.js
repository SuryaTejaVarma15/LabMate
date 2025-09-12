import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import GetStarted from "./Pages/GetStarted";
import SignIn from "./Pages/SignIn";
import LabMateApp from "./Pages/LabMateApp";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<GetStarted />} />
        <Route path="/signin" element={<SignIn />} />
        <Route path="/dashboard" element={<LabMateApp />} />
      </Routes>
    </Router>
  );
}

export default App;
