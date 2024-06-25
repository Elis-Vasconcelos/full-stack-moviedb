"use client";

import Image from "next/image";
import Insta from "../../public/insta.svg";
import Ln from "../../public/link.svg";
import styles from "./footer.module.css";
import { useState, ChangeEvent, FormEvent} from 'react';

export default function Rodape() {

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