import React, { useEffect, useRef, useState } from "react";
import Image from "next/image";
import styles from "./movies.module.css";
import Link from "next/link";

export interface Movie {
  id: number;
  title: string;
  poster_path: string; // For movieList
  posterPath: string;  // For favoriteMovies
  overview: string;    // Movie synopsis
  release_date: string; // Movie release date
  vote_average: number;
  vote_percentage?: number;
}

interface MoviesProps {
  userId: number;
  token: string;
  onLogout: () => void;
}

const TMDB_API_KEY = 'eb4a0700966ecd9a61881d4b79da8fcb';

const Movies: React.FC<MoviesProps> = ({ userId, token, onLogout }) => {
  const [movieList, setMovieList] = useState<Movie[]>([]);
  const [topRatedList, setTopRated] = useState<Movie[]>([]);
  const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [expandedSynopsis, setExpandedSynopsis] = useState<{ [key: number]: boolean }>({});
  const [isDragging, setIsDragging] = useState({ movieList: false, topRatedList: false });
  const [startX, setStartX] = useState({ movieList: 0, topRatedList: 0 });
  const [scrollLeft, setScrollLeft] = useState({ movieList: 0, topRatedList: 0 });

  const movieListRef = useRef<HTMLDivElement | null>(null);
  const topRatedListRef = useRef<HTMLDivElement | null>(null);

  const handleMouseDown = (e: React.MouseEvent<HTMLDivElement>, listType: 'movieList' | 'topRatedList') => {
    const ref = listType === 'movieList' ? movieListRef : topRatedListRef;
    if (ref.current) {
      setIsDragging(prev => ({ ...prev, [listType]: true }));
      setStartX(prev => ({ ...prev, [listType]: e.pageX - ref.current!.offsetLeft }));
      setScrollLeft(prev => ({ ...prev, [listType]: ref.current!.scrollLeft }));
    }
  };

  const handleMouseLeave = (listType: 'movieList' | 'topRatedList') => {
    setIsDragging(prev => ({ ...prev, [listType]: false }));
  };

  const handleMouseUp = (listType: 'movieList' | 'topRatedList') => {
    setIsDragging(prev => ({ ...prev, [listType]: false }));
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>, listType: 'movieList' | 'topRatedList') => {
    const ref = listType === 'movieList' ? movieListRef : topRatedListRef;
    if (!isDragging[listType] || !ref.current) return;
    e.preventDefault();
    const x = e.pageX - ref.current.offsetLeft;
    const walk = (x - startX[listType]) * 4; // Adjust the scroll speed here
    ref.current.scrollLeft = scrollLeft[listType] - walk;
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('userId');
    onLogout();
  };

  const getTopRated = async () => {
    try {
      const response = await fetch('http://localhost:3000/api/topRated');
      const data = await response.json();

      const moviesWithDetails = await Promise.all(data.map(async (movie: Movie) => {
        const detailsResponse = await fetch(`https://api.themoviedb.org/3/movie/${movie.id}?api_key=${TMDB_API_KEY}`);
        const detailsData = await detailsResponse.json();
        return {
          ...movie,
          overview: detailsData.overview,
          release_date: detailsData.release_date,
          vote_percentage: detailsData.vote_average * 10
        };
      }));

      setTopRated(moviesWithDetails);
    } catch (error) {
      console.error("Error fetching top rated movies", error);
    }
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
          vote_percentage: detailsData.vote_average * 10
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

  const toggleSynopsis = (movieId: number) => {
    setExpandedSynopsis(prevState => ({
      ...prevState,
      [movieId]: !prevState[movieId]
    }));
  };

  useEffect(() => {
    getMovies();
    getTopRated();
    if (userId) {
      getFavoriteMovies();
    }
  }, [userId]);

  return (
    <>
      <div className={styles.titulo}>
        <h3>LANÇAMENTOS</h3>
      </div>

      <div 
        className={styles.exibicao}
        ref={movieListRef}
        onMouseDown={(e) => handleMouseDown(e, 'movieList')}
        onMouseLeave={() => handleMouseLeave('movieList')}
        onMouseUp={() => handleMouseUp('movieList')}
        onMouseMove={(e) => handleMouseMove(e, 'movieList')}
      >
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
            <div className={styles.voteCircle}>
              {movie.vote_percentage?.toFixed(0)}%
            </div>

            <div className={styles.cardContent}>
              <Link href={`/movie/${movie.id}`} passHref className={styles.tituloFilme}>{movie.title}</Link>
              <p className={expandedSynopsis[movie.id] ? styles.sinopseExpanded : styles.sinopse}>
                {movie.overview}
              </p>
              <div className={styles.bottom}>
                <p className={styles.releaseDate}>Data de lançamento: {movie.release_date}</p>
                <div className={styles.botoes}>
                  <button className={styles.favoritados} onClick={() => addFavoriteMovie(movie)}>Favoritar</button>
                  <button className={styles.favoritados} onClick={() => toggleSynopsis(movie.id)}>
                    {expandedSynopsis[movie.id] ? "Menos" : "Detalhes"}
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className={styles.titulo}>
        <h3>MELHOR AVALIADOS</h3>
      </div>

      <div 
        className={styles.exibicao}
        ref={topRatedListRef}
        onMouseDown={(e) => handleMouseDown(e, 'topRatedList')}
        onMouseLeave={() => handleMouseLeave('topRatedList')}
        onMouseUp={() => handleMouseUp('topRatedList')}
        onMouseMove={(e) => handleMouseMove(e, 'topRatedList')}
      >
        {topRatedList.map((movie, index) => (
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
            <div className={styles.voteCircle}>
              {movie.vote_percentage?.toFixed(0)}%
            </div>
            
            <div className={styles.cardContent}>
              <Link href={`/movie/${movie.id}`} passHref className={styles.tituloFilme}>{movie.title}</Link>
              <p className={expandedSynopsis[movie.id] ? styles.sinopseExpanded : styles.sinopse}>
                {movie.overview}
              </p>
              <div className={styles.bottom}>
                <p className={styles.releaseDate}>Data de lançamento: {movie.release_date}</p>
                <div className={styles.botoes}>
                  <button className={styles.favoritados} onClick={() => addFavoriteMovie(movie)}>Favoritar</button>
                  <button className={styles.favoritados} onClick={() => toggleSynopsis(movie.id)}>
                    {expandedSynopsis[movie.id] ? "Menos" : "Detalhes"}
                  </button>
                </div>
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
