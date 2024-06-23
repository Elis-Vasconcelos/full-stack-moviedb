import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./movies.module.css";

export interface Movie {
  id: number;
  title: string;
  poster_path: string; // Para movieList
  posterPath: string;  // Para favoriteMovies
  overview: string;    // Movie synopsis
  release_date: string; // Movie release date
}

interface MoviesProps {
  userId: number;
  token: string;
  onLogout: () => void;
}

const TMDB_API_KEY = 'eb4a0700966ecd9a61881d4b79da8fcb';

const Movies: React.FC<MoviesProps> = ({ userId, token, onLogout }) => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedSynopsis, setExpandedSynopsis] = useState<{ [key: number]: boolean }>({});

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    onLogout();
  };

  const getMovies = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/movies');
      const data = await response.json();
      
      const moviesWithDetails = await Promise.all(data.map(async (movie: Movie) => {
        const detailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`);
        const detailsData = await detailsResponse.json();
        return {
          ...movie,
          overview: detailsData.overview,
          release_date: detailsData.release_date,
        };
      }));

      setMovieList(moviesWithDetails);
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
          posterPath: movie.poster_path || movie.posterPath,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Added to favorites:', data);
        alert('Filme adicionado aos favoritos!');
        getFavoriteMovies(); // Atualiza lista de favoritos
      } else if (response.status === 409) {
        alert('Este filme já está na sua lista de favoritos.');
      } else {
        console.error('Erro ao adicionar o filme aos favoritos');
        alert('Não foi possível adicionar o filme aos favoritos.');
      }
    } catch (error) {
      console.error("Erro ao adicionar filme favorito", error);
      alert('Erro na rede ou no servidor ao adicionar o filme aos favoritos.');
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

  const toggleSynopsis = (movieId: number) => {
    setExpandedSynopsis(prevState => ({
      ...prevState,
      [movieId]: !prevState[movieId]
    }));
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
          <div key={movie.id} className={styles.card}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
              alt={movie.title}
              width={500}
              height={750}
              layout="responsive"
              className={styles.image}
              priority={index === 0}
            />
            <div className={styles.cardContent}>
              <h4 className={styles.tituloFilme}>{movie.title}</h4>
              <p className={expandedSynopsis[movie.id] ? styles.sinopseExpanded : styles.sinopse}>
                {movie.overview}
              </p>
              <div className={styles.bottom}>
                <p className={styles.releaseDate}>Release Date: {movie.release_date}</p>
                <div className={styles.botoes}>
                  <button className={styles.favoritados} onClick={() => addFavoriteMovie(movie)}>Favorite</button>
                  <button className={styles.favoritados1} onClick={() => toggleSynopsis(movie.id)}>
                    {expandedSynopsis[movie.id] ? "Menos" : "Detalhes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.titulo}>
        <h3>FAVORITOS</h3>
      </div>

      <div className={styles.exibicao}>
        {favoriteMovies.map((movie, index) => (
          <div key={movie.id} className={styles.card}>
            <Image
              src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`}
              alt={movie.title}
              width={500}
              height={750}
              layout="responsive"
              className={styles.image}
              priority={index === 0}
            />
            <div className={styles.cardContent}>
              <h4 className={styles.tituloFilme}>{movie.title}</h4>
              <div className={styles.botoes}>
                <button className={styles.favoritados} onClick={() => removeFavoriteMovie(movie.id)}>Delete</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      <button onClick={handleLogout} className={styles.logoutButton}>
        Logout
      </button>
    </>
  );
};

export default Movies;
