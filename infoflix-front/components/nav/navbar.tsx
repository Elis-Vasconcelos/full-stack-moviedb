import styles from "./navbar.module.css";

export default function Navbar() {

    return (
        <div className={styles.navegacao}>
            <nav>
                <ul className={styles.menu}>
                        <li>
                            <a href="/">HOME</a>
                        </li>
        
                        <li>
                            <a href="\favoritos">FAVORITOS</a>
                        </li>
                    </ul> 
            </nav>
        </div>
    )
    
}