"use client";

import Image from "next/image";
import Logo from "../../public/infoflixLogo.png";
import styles from "./header.module.css";
import { useState, ChangeEvent, FormEvent} from 'react';
import axios from 'axios';

export default function Cabecalho() {
    const [pesquisa, setPesquisa] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [filmes, setFilmes] = useState<any[]>([]);
    const [erro, setErro] = useState<string>('');

    const TMDB_API_KEY = 'eb4a0700966ecd9a61881d4b79da8fcb';
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

    const barraPesquisa = (event: ChangeEvent<HTMLInputElement>) => {
        setPesquisa(event.target.value);  
    };

    const barraPesquisaSubmit = async (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevenir o comportamento padrão do formulário
        
        try {
            setLoading(true);
            const response = await axios.get(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(pesquisa)}&api_key=${TMDB_API_KEY}`);
            setFilmes(response.data.results);
            setErro('');
        } catch (error) {
            console.error('Erro ao buscar filmes na API do TMDB:', error);
            setErro('Não foi possível encontrar filmes com o título fornecido. Verifique se o título está correto e tente novamente.');
            setFilmes([]);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className={styles.cabecalho}>
            <Image className={styles.logo} src={Logo} alt="Logo" priority />

            <div className="barraPes">
                <form className={styles.formPesquisa} onSubmit={barraPesquisaSubmit}>
                    <button type="submit" className={styles.buttonMovie}>Movie</button>
                    <input
                        type="text"
                        value={pesquisa}
                        onChange={barraPesquisa}
                        placeholder="Pesquisar"
                        className={styles.inputPesquisa}
                    />
                    <button type="submit" className={styles.buttonPesquisa}>SEARCH</button>
                </form>
                
                {/* Mostrar loading enquanto busca */}
                {loading && <p>Carregando...</p>}
                
                {/* Mostrar mensagem de erro, se houver */}
                {erro && <p>{erro}</p>}
                
                {/* Mostrar resultados da pesquisa */}
                {filmes.length > 0 && (
                    <div className={styles.resultados}>
                        <h2>Resultados da Pesquisa:</h2>
                        <ul>
                            {filmes.map((filme) => (
                                <li key={filme.id}>
                                    <h3>{filme.title}</h3>
                                    <p>{filme.overview}</p>
                                    <img src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`} alt={filme.title} />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
