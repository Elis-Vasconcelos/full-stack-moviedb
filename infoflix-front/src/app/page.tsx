'use client';

import React, { useState, useEffect } from "react";
import Movies from "../../components/movies/movies";
import Navbar from "../../components/nav/navbar";
import Login from "../../components/login/Login";
import Register from "../../components/register/register";
import style from "./page.module.css";
import Popular from "../../components/moviesPopulares/popular";

export default function Home() {
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isClient, setIsClient] = useState(false);
  const [showRegister, setShowRegister] = useState(false);

  useEffect(() => {
    setIsClient(true);
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
      ) : isClient && userId ? (
        <Movies userId={userId} token={token!} />
      ) : null}
      {isClient && !userId && (
        <button className={style.register} onClick={() => setShowRegister(!showRegister)}>
          {showRegister ? 'Já tem conta? Login' : "Não tem conta? Registrar"}
        </button>
      )}

      

    </main>
  );
}
