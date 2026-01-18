import Image from "next/image";
import styles from "./page.module.css";
import Link from "next/link";

export const Nav = () => {
    return (
        <nav>
            <Link href="/csr">CSR</Link>
            <Link href="/ssr">SSR</Link>
            <Link href="/ssg">SSG</Link>
            <Link href="/isr">ISR</Link>
        </nav>
    )
}

export default function Home() {
  return (
    <div className={styles.page}>
      <main className={styles.main}>
          <Nav></Nav>
      </main>
    </div>
  );
}
