import Image from "next/image";
import Link from "next/link";
import styles from "./page.module.css";

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
        <Image
          className={styles.logo}
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        />
        <div className={styles.intro}>
          <h1>Ejemplo de Testing en Next.js</h1>
          <p>
            Este proyecto incluye ejemplos de testing con Jest, Testing Library
            y Playwright para Next.js.
          </p>
        </div>
        <nav className={styles.ctas}>
          <Link href="/about" className={styles.primary}>
            About
          </Link>
          <Link href="/cinemas" className={styles.secondary}>
            Cinemas
          </Link>
          <Link href="/profile" className={styles.secondary}>
            Profile
          </Link>
        </nav>
      </main>
    </div>
  );
}
