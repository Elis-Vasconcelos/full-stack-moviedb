"use client";

import Image from "next/image";
import Insta from "../../public/insta.svg";
import Ln from "../../public/link.svg";
import styles from "./footer.module.css";
import { useState, ChangeEvent, FormEvent} from 'react';

export default function Rodape() {
    const [inscricao, setInscricao] = useState<string>('');

    const caixaInscricao = (event: ChangeEvent<HTMLInputElement>) => {
        setInscricao(event.target.value);
    };

    const caixaInscricaoSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); 
        console.log('Inscrição:', inscricao);
    };

    return (
        <div className={styles.footer}>

            <div className={styles.filmes}>
                <div className={styles.star}>
                    <h3>Star Movie</h3>

                    <ul className={styles.movies}>
                        <li>
                            <a href="">Filmes</a>
                        </li>
        
                        <li>
                            <a href="">Séries</a>
                        </li>

                        <li>
                            <a href="">Animes</a>
                        </li>

                        <li>
                            <a href="">Desenhos animados</a>
                        </li>
                    </ul> 
                </div>

                <div className={styles.genero}>

                    <h3>Gêneros</h3>

                    <ul className={styles.movies}>
                        <li>
                            <a href="">Romance</a>
                        </li>
        
                        <li>
                            <a href="">Comédia</a>
                        </li>

                        <li>
                            <a href="">Ação</a>
                        </li>

                        <li>
                            <a href="">Terror</a>
                        </li>

                        <li>
                            <a href="">Fantasia</a>
                        </li>

                        <li>
                            <a href="">Musical</a>
                        </li>
                    </ul> 

                </div>

            </div>

            <div className={styles.subscribe}>
                    <h3>Subscribe</h3>
                    <p>Inscreva-se para receber as novidades de  <br/> filmes, séries e notícias dos melhores filmes.</p>

                    <div className="barraIns">

                        <form className={styles.formsins} onSubmit={caixaInscricaoSubmit}>
                            <input
                                type="text"
                                value={inscricao}
                                onChange={caixaInscricao}
                                placeholder="Informe seu e-mail"
                                className={styles.inputInscricao}
                            />
                        </form>

                    </div>

                    <button type="submit" className={styles.inscricao}>Inscreva-se</button>

            </div>

            <div className={styles.redes}>

                <h3>Social Link</h3>
            
                <div className={styles.social}>
                    <Image className={styles.insta} src={Insta} alt="insta"  />
                    <Image className={styles.ln} src={Ln} alt="ln"  />
                </div>

                <div className={styles.copy}>
                    <h3>Copyright</h3>
                    <h5>Copyright © ínfoflix.com All Rights Reserved</h5>
                </div>
            
            </div>

        </div>

        
    )
    
}