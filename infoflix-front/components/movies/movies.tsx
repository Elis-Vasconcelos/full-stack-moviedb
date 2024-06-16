import React, { useEffect, useState } from "react";
import styles from "./movies.module.css"

interface Movie {
    poster_path: string; // Caminho para a imagem do pôster
    title: string;       // Título do filme

}

export default function Movies() {
    const [movieList, setMovieList] = useState<Movie[]>([])
    

    const getMovie = async () => {
        try {
            const response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=eb4a0700966ecd9a61881d4b79da8fcb');
            const data = await response.json(); // Converte a resposta para JSON
            setMovieList(data.results); // Supondo que 'results' seja o array de filmes
        } catch(error) {
            console.error("Error fetching movies", error);
        }
    }
    
    useEffect(() => {
        getMovie();
    }, []);

    console.log(movieList);

    return (
        <div className={styles.exibicao}>
            {movieList.map((movie) => {
                return (
                    <div className={styles.filmes}>
                        <img src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} />
                    </div>
                )
            })}
        </div>
    )
}