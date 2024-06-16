"use client";

import Image from "next/image";
import Logo from "../../public/infoflixLogo.png";
import styles from "./header.module.css";
import { useState, ChangeEvent, FormEvent} from 'react';

export default function Cabecalho() {
    const [pesquisa, setPesquisa] = useState<string>('');

    const barraPesquisa = (event: ChangeEvent<HTMLInputElement>) => {
        setPesquisa(event.target.value);
    };

    const barraPesquisaSubmit = (event: FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Prevenir o comportamento padrão do formulário
        console.log('Pesquisa:', pesquisa);
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
                </div>
        </div>
    );
}
