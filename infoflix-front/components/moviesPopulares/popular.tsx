import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./movies.module.css";


export default function MoviesAvaliados() {
    return (
        <>
            <div className={styles.titulo}>
                <h3>FILMES MAIS AVALIADOS</h3>
            </div>
        </>    
    );
}