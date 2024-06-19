import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./movies.module.css";

interface Movie {
    poster_path: string;
    title: string;
    id: number;
}

export default function Movies() {
    const [movieList, setMovieList] = useState<Movie[]>([]);
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
    const userId = 1; // This should come from your auth system

    const getMovies = async () => {
        try {
            const response = await fetch('/api/movies');
            const data = await response.json();
            setMovieList(data);
        } catch (error) {
            console.error("Error fetching movies", error);
        }
    };

    const getFavoriteMovies = async () => {
        try {
            const response = await fetch(`/api/favorites/${userId}`);
            const data = await response.json();
            setFavoriteMovies(data);
        } catch (error) {
            console.error("Error fetching favorite movies", error);
        }
    };

    const addFavoriteMovie = async (movie: Movie) => {
        try {
            await fetch('/api/favorites', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    userId,
                    title: movie.title,
                    posterPath: movie.poster_path,
                }),
            });
            getFavoriteMovies();
        } catch (error) {
            console.error("Error adding favorite movie", error);
        }
    };

    useEffect(() => {
        getMovies();
        getFavoriteMovies();
    }, []);

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
                            src={`https://image.tmdb.org/t/p/w500${movie.posterPath}`} 
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
}
