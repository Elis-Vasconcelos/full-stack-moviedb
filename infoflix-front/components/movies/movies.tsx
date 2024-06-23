import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./movies.module.css";

export interface Movie {
  id: number;
  title: string;
  poster_path: string; // Para movieList
  posterPath: string;  // Para favoriteMovies
}

interface MoviesProps {
  userId: number;
  token: string;
}

const Movies: React.FC<MoviesProps> = ({ userId, token }) => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

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
      setLoading(true);
      const response = await fetch('http://localhost:3000/api/favorites', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          userId,
          title: movie.title,
          posterPath: movie.poster_path || movie.posterPath, // Usando o que estiver definido
        }),
      });
      const data = await response.json();
      console.log('Added to favorites:', data);
      getFavoriteMovies(); // Atualiza lista de favoritos
    } catch (error) {
      console.error("Error adding favorite movie", error);
    } finally {
      setLoading(false);
    }
  };

  const removeFavoriteMovie = async (movieId: number) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:3000/api/favorites/${userId}/${movieId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      console.log('Removed from favorites:', movieId);
      getFavoriteMovies(); // Atualiza lista de favoritos
    } catch (error) {
      console.error("Error removing favorite movie", error);
    } finally {
      setLoading(false);
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
            <p className={styles.tituloFilme}>{movie.title}</p>
            <div className={styles.botoes}>
              <button className={styles.favoritados} onClick={() => addFavoriteMovie(movie)}>Favorite</button>
              <button className={styles.favoritados1}>Detalhes</button>
            </div>
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
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              width={500}
              height={750}
              layout="responsive"
              className={styles.image}
              priority={index === 0}
            />
            <p className={styles.tituloFilme}>{movie.title}</p>
            <div className={styles.botoes}>
              <button className={styles.favoritados} onClick={() => removeFavoriteMovie(movie.id)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Movies;
