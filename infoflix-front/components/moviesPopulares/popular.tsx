import React, { useEffect, useState } from "react";
import Image from "next/image";
import styles from "./popular.module.css";


export default function MoviesPopular() {
    return (
        <>
            <div className={styles.titulo}>
                <h3>FILMES POPULARES</h3>
            </div>
        </>    
    );
}
