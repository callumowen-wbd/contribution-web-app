import styles from "../styles/Home.module.css";
import Link from "next/link";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
  return (
    <>
      <div className={styles.center}>
        <h2 className={inter.className}>Contribution</h2>
      </div>
      <div className={styles.grid}>
        <Link href="/hai-config" className={styles.card}>
          <h2 className={inter.className}>Haivision Config</h2>
          <p className={inter.className}>
            Generate config files for P2024 Haivisions across Mixed Zones and
            Tech Hubs
          </p>
        </Link>
        <Link href="/hai-router" className={styles.card}>
          <h2 className={inter.className}>Haivision Router</h2>
          <p className={inter.className}>
            Intuitively route Haivision streams from a single visual control
            panel
          </p>
        </Link>
      </div>
    </>
  );
}
