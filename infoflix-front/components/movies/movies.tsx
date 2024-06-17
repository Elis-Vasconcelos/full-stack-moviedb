import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./movies.module.css";

interface Movie {
    poster_path: string; // Caminho para a imagem do pôster
    title: string;       // Título do filme
    id: number;          // ID do filme (para usar como key)
}

export default function Movies() {
    const [movieList, setMovieList] = useState<Movie[]>([]);
    
    const getMovie = async () => {
        try {
            const response = await fetch('https://api.themoviedb.org/3/discover/movie?api_key=eb4a0700966ecd9a61881d4b79da8fcb');
            const data = await response.json(); // Converte a resposta para JSON
            setMovieList(data.results); // Supondo que 'results' seja o array de filmes
        } catch (error) {
            console.error("Error fetching movies", error);
        }
    };
    
    useEffect(() => {
        getMovie();
    }, []);

    return (
        <>
            <div className={styles.titulo}>
                <h3>Lançamentos</h3>
            </div>

            <div className={styles.exibicao}>
                <>
                
                {movieList.map((movie, index) => (
                    <div key={movie.id} className={styles.filmes}>
                        <Image 
                            src={`https://image.tmdb.org/t/p/w500${movie.poster_path}`} 
                            alt={movie.title}
                            width={500} 
                            height={750} 
                            layout="responsive"
                            className={styles.image}
                            priority={index === 0} // Adiciona prioridade à primeira imagem
                        />
                    </div>
                ))}
                </>
        </div>
        </>    
    );
}
