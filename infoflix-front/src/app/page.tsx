"use client"

import Image from "next/image";
import Movies from "../../components/movies/movies";
import Navbar from "../../components/nav/navbar";

export default function Home() {
  return (
    <main className="container">
      <Navbar />
      < Movies />
    </main>
  );
}
