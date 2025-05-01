import Head from "next/head";
import styles from "@/styles/Home.module.css";
import Link from "next/link";
import { Inter } from "@next/font/google";

const inter = Inter({ subsets: ["latin"] });

function Layout({ children }) {
  return (
    <>
      <Head>
        <title>Contribution Super App</title>
        <meta name="description" content="Contribution Super App" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
        <link href="./output.css" rel="stylesheet"></link>
      </Head>
      <main className={styles.main}>
        <Link href="/">
          <div className={styles.description}>
            <p>
              <code className={styles.code}>Contribution Super App</code>
            </p>
          </div>
        </Link>
        {children}
      </main>
    </>
  );
}

export default Layout;
