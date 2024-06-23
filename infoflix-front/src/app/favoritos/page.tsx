// src/pages/index.tsx
'use client'

import React, { useState } from 'react';
import Login from '../../../components/login/Login';
import Movies from '../../../components/movies/movies';
import Favoritos from '../../../components/favoritos/favoritos';
import { useRouter } from 'next/navigation';

const App = () => {
  const [userId, setUserId] = useState<number | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const router = useRouter();

  if (!userId || !token) {
    return <Login setUserId={setUserId} setToken={setToken} />;
  }

  return (
    <div>
      <button onClick={() => router.push('/movies')}>Movies</button>
      <button onClick={() => router.push('/favoritos')}>Favoritos</button>
      {/* You can add more navigation buttons or links here */}
    </div>
  );
};

export default App;
