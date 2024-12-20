'use client';

import React, { useState, useEffect } from "react";
import Movies from "../../components/movies/movies";
import Navbar from "../../components/nav/navbar";
import Login from "../../components/login/Login";
import Register from "../../components/register/register";
import style from "./page.module.css";

export default function Home() {
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  const handleLogout = () => {
    setToken(null);
    setUserId(null);
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
  };

  useEffect(() => {
    setIsClient(true);
    const storedToken = localStorage.getItem('token');
    const storedUserId = localStorage.getItem('userId');
    if (storedToken && storedUserId) {
      setToken(storedToken);
      setUserId(Number(storedUserId));
    }
  }, []);

  return (
    <main className="container">
      <Navbar />
      {isClient && !userId ? (
        showRegister ? (
          <Register setUserId={setUserId} setToken={setToken} />
        ) : (
          <Login setUserId={setUserId} setToken={setToken} />
        )
      ) : isClient && userId && token ? (
        <Movies userId={userId} token={token} onLogout={handleLogout} />
      ) : null}
      {isClient && !userId && (
        <button className={style.register} onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? 'Já tem conta? Login' : "Não tem conta? Registrar"}
        </button>
      )}
    </main>
  );
}
