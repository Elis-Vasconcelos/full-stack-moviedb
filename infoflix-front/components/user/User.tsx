import React, { useState } from 'react';

export interface Movie {
    id: number;
    title: string;
    posterPath: string;
    userId: number;
    user: User;
  }
  
  export interface User {
    id: number;
    name: string;
    email: string;
    movies: Movie[];
  }
  
  interface UserProps {
    setUserId: (id: number) => void;
  }

export default function User({ setUserId }: UserProps) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');

  const handleSubmit = async (event: { preventDefault: () => void; }) => {
    event.preventDefault();
    try {
      const response = await fetch('http://localhost:3000/api/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ name, email }),
      });
      const data = await response.json();
      console.log('User created:', data);
      setUserId(data.id); // Assuming the response has an id field
    } catch (error) {
      console.error('Error creating user:', error);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div>
        <label>Name:</label>
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
      <button type="submit">Create User</button>
    </form>
  );
}
