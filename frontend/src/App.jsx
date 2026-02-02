import { useState } from "react";
import LoginPage from "./pages/loginPage";
import SignupPage from "./pages/signupPage";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import LobbyPage from "./pages/lobbyPage";
import CreateGamePage from "./pages/createGamePage";
import GamePage from "./pages/gamePage";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" />} />{" "}
        <Route path="/login" element={<LoginPage />} />
        <Route path="/signup" element={<SignupPage />} />
        <Route path="/lobby" element={<LobbyPage />} />
        <Route path="/creategame" element={<CreateGamePage />} />
        <Route path="/game/:gameId" element={<GamePage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
