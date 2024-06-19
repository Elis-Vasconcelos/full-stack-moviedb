import React, { useState } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface LoginProps {
  setUserId: (userId: number) => void;
  setToken: (token: string) => void;
}

const Login: React.FC<LoginProps> = ({ setUserId, setToken }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        setToken(data.token);
        const decodedToken = jwt.decode(data.token) as JwtPayload | null;
        if (decodedToken && typeof decodedToken.userId === 'number') {
          setUserId(decodedToken.userId);
          console.log('User logged in:', decodedToken.userId);
        } else {
          console.error('Invalid token format');
        }
      }
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <form onSubmit={handleLogin}>
      <div>
        <label>Email:</label>
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
      </div>
      <div>
        <label>Senha:</label>
        <input
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
      </div>
      <button type="submit">Login</button>
    </form>
  );
};

export default Login;
