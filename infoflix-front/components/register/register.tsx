import React, { useState } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';
import style from "./register.module.css";

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
    <div className={style.register}>
      <form onSubmit={handleRegister}>
        <div>
          <label className={style.label}>Nome:</label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
             placeholder="Digite seu nome"
            className={style.inputRegister}
          />
        </div>
        <div>
          <label className={style.label}>Email:</label>
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            className={style.inputRegister}
          />
        </div>
        <div>
          <label className={style.label}>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
             placeholder="Digite sua senha"
            className={style.inputRegister}
          />
        </div>
        <button className={style.botReg} type="submit">Registrar</button>
      </form>
    </div>
    
  );
};

export default Register;
