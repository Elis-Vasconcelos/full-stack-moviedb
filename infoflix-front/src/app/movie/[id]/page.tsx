'use client'

import Image from 'next/image';
import { notFound } from 'next/navigation';
import { Movie } from '../../../../components/movies/movies';
import styles from './movieDetails.module.css';
import Navbar from '../../../../components/nav/navbar';
import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

interface MovieDetailsProps {
    params: {
        id: string;
    };
}

const TMDB_API_KEY = 'eb4a0700966ecd9a61881d4b79da8fcb';
const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

async function fetchMovie(id: string) {
    const response = await fetch(`${TMDB_BASE_URL}/movie/${id}?api_key=${TMDB_API_KEY}`);
    if (!response.ok) {
        return null;
    }
    return await response.json();
}

export default function MovieDetails({ params }: MovieDetailsProps) {
    const { id } = params;
    const [movie, setMovie] = useState<Movie | null>(null);
    const [loading, setLoading] = useState<boolean>(false);
    const router = useRouter();

    useEffect(() => {
        const fetchData = async () => {
            const movieData = await fetchMovie(id);
            if (!movieData) {
                notFound();
            } else {
                setMovie(movieData);
            }
        };
        fetchData();
    }, [id]);

    const addFavoriteMovie = async (movie: Movie) => {
        const userId = localStorage.getItem('userId');
        const token = localStorage.getItem('token');
        
        if (!userId || !token) {
            alert('You must be logged in to favorite a movie.');
            router.push('/login');
            return;
        }

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

    if (!movie) {
        return null;
    }

    return (
        <>
        <Navbar />
        <div className={styles.pageContainer}>
            <div className={styles.movieHeader}>
                <div className={styles.moviePoster}>
                    <Image
                        src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`}
                        alt={movie.title}
                        width={300}
                        height={450}
                        objectFit="cover"
                    />
                </div>
                <div className={styles.movieDetails}>
                    <h1 className={styles.movieTitle}>{movie.title}</h1>
                    <div className={styles.movieInfo}>
                        <span className={styles.detail}><strong>Release Date:</strong> {movie.release_date}</span>
                        <span className={styles.detail}><strong>Rating:</strong> {movie.vote_average}</span>
                        <p className={styles.movieOverview}>{movie.overview}</p>
                    </div>
                    <button className={styles.favoriteButton} onClick={() => addFavoriteMovie(movie)}>
                        {loading ? 'Adding...' : 'Favoritar'}
                    </button>
                </div>
            </div>
        </div>
        </>
    );
}
