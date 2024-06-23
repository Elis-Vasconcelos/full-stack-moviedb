'use client'

import Image from 'next/image';
import Logo from '../../public/infoflixLogo.png';
import styles from './header.module.css';
import { useState, ChangeEvent, FormEvent, useEffect } from 'react';
import Link from 'next/link';
import { Movie } from '../movies/movies';

export default function Cabecalho() {
    const [pesquisa, setPesquisa] = useState('');
    const [loading, setLoading] = useState(false);
    const [filmes, setFilmes] = useState<Movie[]>([]);
    const [erro, setErro] = useState('');
    const [showResults, setShowResults] = useState(false);

    const TMDB_API_KEY = 'eb4a0700966ecd9a61881d4b79da8fcb';
    const TMDB_BASE_URL = 'https://api.themoviedb.org/3';

    const barraPesquisa = (event: ChangeEvent<HTMLInputElement>) => {
        const valorPesquisa = event.target.value;
        setPesquisa(valorPesquisa);
        setShowResults(!!valorPesquisa); // Show results only if search is not empty
    };

    const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevent form submission
        realizarPesquisa(); // Handle search logic
    };

    useEffect(() => {
        // Function to debounce the API call
        const timeoutId = setTimeout(() => {
            if (pesquisa.trim()) {
                realizarPesquisa();
            } else {
                setFilmes([]);
                setErro('');
                setLoading(false);
            }
        }, 500); // Adjust debounce delay as needed (e.g., 500ms)

        return () => clearTimeout(timeoutId);
    }, [pesquisa]); // Trigger effect on each change to 'pesquisa'

    const realizarPesquisa = async () => {
        try {
            setLoading(true);
            const response = await fetch(`${TMDB_BASE_URL}/search/movie?query=${encodeURIComponent(pesquisa)}&api_key=${TMDB_API_KEY}`);
            if (!response.ok) {
                throw new Error('A resposta da rede não foi ok');
            }
            const data = await response.json();
            setFilmes(data.results);
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
            <Link href='/' passHref>
                <Image className={styles.logo} src={Logo} alt="Logo" priority />
            </Link>

            <div className={styles.barraPes}>
                <form className={styles.formPesquisa} onSubmit={handleSubmit}>
                    <input
                        type="text"
                        value={pesquisa}
                        onChange={barraPesquisa}
                        placeholder="Pesquisar"
                        className={styles.inputPesquisa}
                    />
                    <button type="submit" className={styles.buttonPesquisa}>SEARCH</button>
                </form>

                {loading && <p>Carregando...</p>}
                {erro && <p className={styles.mensagemErro}>{erro}</p>}
                
                {showResults && filmes.length > 0 && (
                    <div className={styles.resultados}>
                        <ul className={styles.listaFilmes}>
                            {filmes.map((filme) => (
                                <li key={filme.id} className={styles.itemFilme}>
                                    <h3 className={styles.detailsFilme}>{filme.title}</h3>
                                    <Image
                                        src={`https://image.tmdb.org/t/p/w500${filme.poster_path}`}
                                        alt={filme.title}
                                        width={500}
                                        height={750}
                                        layout='responsive'
                                    />
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}
