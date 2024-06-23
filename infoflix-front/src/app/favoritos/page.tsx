'use client'

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation'; // Corrigido de 'next/navigation' para 'next/router'
import Navbar from '../../../components/nav/navbar';
import Favoritos from '../../../components/favoritos/favoritos';

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
    setUserId(userId);
    setToken(token);
    if (userId === null && token === null) {
      router.push('/'); // Redireciona para a página inicial
    } else if (userId !== null && token !== null) {
      router.push('/favoritos'); // Redireciona para a página de favoritos
    }
  }, [router]);

  // Renderiza o componente de Navbar em todos os casos
  return (
    <>
      <Navbar />
      {/* O componente de Favoritos será renderizado se userId e token estiverem presentes */}
      {userId !== null && token !== null && <Favoritos userId={userId} token={token} />}
    </>
  );
};

export default App;

