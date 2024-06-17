"use client"

import Image from "next/image";
import Movies from "../../components/movies/movies";
import Navbar from "../../components/nav/navbar";
import Popular from "../../components/moviesPopulares/popular";
import Avaliados from "../../components/movieAvaliados/avaliados";

export default function Home() {
  return (
    <main className="container">
      <Navbar />
      < Movies />
      <Popular/>
      <Avaliados/>
    </main>
  );
}
