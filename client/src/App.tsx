// src/App.tsx
import React from "react";
import { BrowserRouter as Router, Route, Routes } from "react-router-dom";
import UserDashboard from "./pages/UserDashboard"; // Assuming you have a UserDashboard component
import BaseLogin from "./pages/BaseLogin";
import BaseRegister from "./pages/BaseRegister";
const App: React.FC = () => {
  return (
    <Router>
      <Routes>
        <Route path="/user" element={<UserDashboard />} />
        <Route path="/login" element={<BaseLogin />} />
        <Route path="/register" element={<BaseRegister />} />
      </Routes>
    </Router>
  );
};

export default App;
