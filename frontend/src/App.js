// src/App.js
import React from "react";
import { BrowserRouter as Router, Route, Routes, Navigate } from "react-router-dom";
import UserList from "./components/UserList";
import UserRanking from "./components/UserRanking";

function App() {
  return (
    <Router>
      <Routes>
        {/* 根路由重導到查詢用戶頁面 */}
        <Route path="/" element={<Navigate to="/users" replace />} />
        <Route path="/users" element={<UserList />} />
        <Route path="/users/ranking" element={<UserRanking />} />
      </Routes>
    </Router>
  );
}

export default App;
