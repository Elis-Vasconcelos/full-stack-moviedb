import React, { useState } from 'react';
import jwt, { JwtPayload } from 'jsonwebtoken';
import style from "./login.module.css";

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
          localStorage.setItem('token', data.token);
          localStorage.setItem('userId', decodedToken.userId.toString());
        } else {
          console.error('Invalid token format');
        }
      }
      
    } catch (error) {
      console.error('Error logging in:', error);
    }
  };

  return (
    <div className={style.login}>  

      <form className={style.formslog} onSubmit={handleLogin}>
        <div className={style.logcont}>
          <label className={style.label}>Email:</label>
            <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Digite seu e-mail"
            className={style.inputLogin}
            />
        </div>

        <div>
          <label className={style.label}>Senha:</label>
          <input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="Digite sua senha"
            className={style.inputLogin}
          />
        </div>

        <button className={style.botLogin} type="submit">Login</button>
      </form>

    </div>
    
  );
};

export default Login;
