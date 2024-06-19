import React, { useState } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';

interface RegisterProps {
  setUserId: (userId: number) => void;
  setToken: (token: string) => void;
}

const Register: React.FC<RegisterProps> = ({ setUserId, setToken }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async (event: React.FormEvent) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email, password }),
      });
      const data = await response.json();
      if (data) {
        // Automatically log in the user after registration
        const loginResponse = await fetch('http://localhost:3000/api/login', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ email, password }),
        });
        const loginData = await loginResponse.json();
        if (loginData.token) {
          setToken(loginData.token);
          const decodedToken = jwt.decode(loginData.token) as JwtPayload | null;
          if (decodedToken && typeof decodedToken.userId === 'number') {
            setUserId(decodedToken.userId);
            console.log('User logged in:', decodedToken.userId);
          }
        }
      }
    } catch (error) {
      console.error('Error registering:', error);
    }
  };

  return (
    <form onSubmit={handleRegister}>
      <div>
        <label>Nome:</label>
        <input
          type="text"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
      </div>
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
      <button type="submit">Registrar</button>
    </form>
  );
};

export default Register;
