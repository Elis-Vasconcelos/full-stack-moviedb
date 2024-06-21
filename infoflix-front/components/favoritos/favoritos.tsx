// src/components/Favoritos.tsx
import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./movies.module.css";
import { Movie } from "../movies/movies"; // Importe a interface Movie se necessário

interface FavoritosProps {
    userId: number;
    token: string;
}

const Favoritos: React.FC<FavoritosProps> = ({ userId, token }) => {
    const [favoriteMovies, setFavoriteMovies] = useState<Movie[]>([]);
    const [loading, setLoading] = useState<boolean>(false);

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
        getFavoriteMovies();
    }, [userId]);

    return (
        <>
            <div className={styles.titulo}>
                <h3>FILMES FAVORITOS</h3>
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

export default Favoritos;
