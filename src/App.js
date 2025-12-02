import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Intro from "./Intro";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import Explore from "./pages/Explore";
import MyPosts from "./pages/MyPosts";
import Requests from "./pages/Requests";
import Workspace from "./pages/Workspace";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Intro />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/explore" element={<Explore />} />
        <Route path="/myposts" element={<MyPosts />} />
        <Route path="/requests" element={<Requests />} />
        <Route path="/workspace/:teamId" element={<Workspace />} />
      </Routes>
    </Router>
  );
}

export default App;
