"use client"

import Image from "next/image";
import Movies from "../../components/movies/movies";
import Navbar from "../../components/nav/navbar";
import User from "../../components/user/User";
import { useState } from "react";


export default function Home() {
  const [userId, setUserId] = useState<number | null>(null);

  return (
    <main className="container">
      <Navbar />
      <User setUserId={setUserId} />
      {userId && <Movies userId={userId} />}
    </main>
  );
}
