'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Login from '../../../components/login/Login';
import Favoritos from '../../../components/favoritos/favoritos';
import Navbar from '../../../components/nav/navbar';

// Função para recuperar o estado de login
const retrieveLoginState = () => {
  if (typeof window !== 'undefined') {
    const userId = localStorage.getItem('userId');
    const token = localStorage.getItem('token');
    return { userId: userId ? Number(userId) : null, token: token };
  }
  return { userId: null, token: null };
};

const App = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  useEffect(() => {
    const { userId, token } = retrieveLoginState();
    if (userId !== null && token !== null) {
      setUserId(userId);
      setToken(token);
      router.push('/favoritos'); // Redireciona para a página de favoritos
    }
  }, [router]);

  // Se não houver userId ou token, renderiza o componente de Login
  if (userId === null || token === null) {
    return (
      <>
        <Navbar />
        <Login setUserId={setUserId} setToken={setToken} />
      </>
    );
  }

  // Se userId e token estiverem presentes, renderiza o componente de Favoritos
  return (
    <>
      <Navbar />
      <Favoritos userId={userId} token={token} />
    </>
  );
};

export default App;
