import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./movies.module.css";

export interface Movie {
  id: number;
  title: string;
  poster_path: string;
}

interface MoviesProps {
  userId: number;
  token: string;
}

const Movies: React.FC<MoviesProps> = ({ userId, token }) => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);

  const getMovies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/movies');
      const data = await response.json();
      setMovieList(data);
    } catch (error) {
      console.error("Error fetching movies", error);
    }
  };

  const getFavoriteMovies = async () => {
    try {
      const response = await fetch(`http://localhost:3000/api/favorites/${userId}`, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      const data = await response.json();
      setFavoriteMovies(data);
    } catch (error) {
      console.error("Error fetching favorite movies", error);
    }
  };

  const addFavoriteMovie = async (movie: Movie) => {
    try {
      const response = await fetch('http://localhost:3000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          title: movie.title,
          posterPath: movie.poster_path,
        }),
      });
      const data = await response.json();
      console.log('Added to favorites:', data);
      getFavoriteMovies(); // Refresh favorites
    } catch (error) {
      console.error("Error adding favorite movie", error);
    }
  };

  useEffect(() => {
    getMovies();
    if (userId) {
      getFavoriteMovies();
    }
  }, [userId]);

  return (
    <>
      <div className={styles.titulo}>
        <h3>LANÇAMENTOS</h3>
      </div>

      <div className={styles.exibicao}>
        {movieList.map((movie, index) => (
          <div key={movie.id} className={styles.filmes}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              layout="responsive"
              className={styles.image}
              priority={index === 0}
            />
            <button onClick={() => addFavoriteMovie(movie)}>Favorite</button>
          </div>
        ))}
      </div>

      <div className={styles.titulo}>
        <h3>FAVORITOS</h3>
      </div>

      <div className={styles.exibicao}>
        {favoriteMovies.map((movie, index) => (
          <div key={movie.id} className={styles.filmes}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              layout="responsive"
              className={styles.image}
              priority={index === 0}
            />
          </div>
        ))}
      </div>
    </>
  );
};

export default Movies;
