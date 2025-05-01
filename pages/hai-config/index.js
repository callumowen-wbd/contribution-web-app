import Head from "next/head";
import styles from "@/styles/Home.module.css";
import haiConfigStyles from "@/styles/HaiConfig.module.css";
import { Inter } from "@next/font/google";
import { Box } from "@chakra-ui/react";
import generateMixedZoneEncs from "@/utils/generateMixedZoneEncs";
import generateMixedZoneDecs from "@/utils/generateMixedZoneDecs";
import addEncryption from "@/utils/addEncryption";
import generateTechHubEncs from "@/utils/generateTechHubEncs";
import generateTechHubDecs from "@/utils/generateTechHubDecs";
import generateNocEncs from "@/utils/generateNocEncs";
import generateFullNocEncs from "@/utils/generateFullNocEncs";

const inter = Inter({ subsets: ["latin"] });

export async function getServerSideProps() {
  const getHeaders = () => {
    const myHeaders = new Headers();
    myHeaders.append(
      "Accept",
      "text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,image/apng,*/*;q=0.8,application/signed-exchange;v=b3;q=0.7"
    );
    myHeaders.append("Accept-Language", "en-GB,en-US;q=0.9,en;q=0.8");
    myHeaders.append("Cache-Control", "max-age=0");
    myHeaders.append("Connection", "keep-alive");
    myHeaders.append(
      "Cookie",
      "SessionID=GXUHqWTbYUGiC4v0Av5o2zPV1TwgEPIiMAZbwQmtL2Jl5ejDIo2KWPFVJbblYSDJ"
    );
    myHeaders.append("Sec-Fetch-Dest", "document");
    myHeaders.append("Sec-Fetch-Mode", "navigate");
    myHeaders.append("Sec-Fetch-Site", "none");
    myHeaders.append("Sec-Fetch-User", "?1");
    myHeaders.append("Upgrade-Insecure-Requests", "1");
    myHeaders.append(
      "User-Agent",
      "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36"
    );
    myHeaders.append(
      "sec-ch-ua",
      '"Chromium";v="122", "Not(A:Brand";v="24", "Google Chrome";v="122"'
    );
    myHeaders.append("sec-ch-ua-mobile", "?0");
    myHeaders.append("sec-ch-ua-platform", '"Windows"');
    return myHeaders;
  };
  const requestOptions = {
    method: "GET",
    headers: getHeaders(),
    redirect: "follow",
  };
  try {
    const res = await fetch(
      "https://10.101.2.38/apis/streams/7",
      requestOptions
    );
    const data = await res.json();
    return { props: { data } };
  } catch (error) {
    return { props: {} };
  }
  // Pass data to the page via props
}

export default function Home({ data }) {
  // console.log(data);
  return (
    <>
      <Head>
        <title>Contribution - Haivision Config</title>
      </Head>
      <div className={haiConfigStyles.wrapper}>
        <div className={styles.center}>
          <h2 className={inter.className}>Haivision Config Generator</h2>
          <img
            src="https://upload.wikimedia.org/wikipedia/en/thumb/d/d1/2024_Summer_Olympics_logo.svg/1200px-2024_Summer_Olympics_logo.svg.png"
            height="60px"
          />
        </div>
        <div className={styles.grid}>
          <Box
            className={styles.card}
            onClick={() => generateMixedZoneEncs()}
            cursor="pointer"
          >
            <p className={inter.className}>1.</p>
            <h2 className={inter.className}>Mixed Zone Encoders</h2>
            <p className={inter.className}>
              Generate fully-loaded config covering all possible streams for
              each Mixed Zone encoder
            </p>
            <br />
            <p>[128 SRT Callers each]</p>
          </Box>
          <Box
            className={styles.card}
            onClick={() => generateMixedZoneDecs()}
            cursor="pointer"
          >
            <p className={inter.className}>2.</p>
            <h2 className={inter.className}>Mixed Zone Decoders</h2>
            <p className={inter.className}>
              Generate fully-loaded config covering all possible streams for
              each Mixed Zone decoder
            </p>
            <br />
            <p>[80 SRT Callers each]</p>
          </Box>
          <Box
            className={styles.card}
            onClick={() => generateTechHubEncs()}
            cursor="pointer"
          >
            <p className={inter.className}>3.</p>
            <h2 className={inter.className}>Tech Hub Encoders</h2>
            <p className={inter.className}>
              Generate static config with SRT Listeners for each encode
            </p>
            <br />
            <p>[4 SRT Listeners each]</p>
          </Box>
          <Box
            className={styles.card}
            onClick={() => generateTechHubDecs()}
            cursor="pointer"
          >
            <p className={inter.className}>4.</p>
            <h2 className={inter.className}>Tech Hub Decoders</h2>
            <p className={inter.className}>
              Generate static config with SRT Listeners for each decode
            </p>
            <br />
            <p>[4 SRT Listeners each]</p>
          </Box>
          <Box
            className={styles.card}
            onClick={() => generateNocEncs()}
            cursor="pointer"
          >
            <p className={inter.className}>5.</p>
            <h2 className={inter.className}>NOC House Encoders (simplified)</h2>
            <p className={inter.className}>
              Generate simplified config for multiple encodes in each NOC House
            </p>
            <br />
            <p>[x SRT Listeners each]</p>
          </Box>
          <Box
            className={styles.card}
            onClick={() => generateFullNocEncs()}
            cursor="pointer"
          >
            <p className={inter.className}>6.</p>
            <h2 className={inter.className}>NOC House Encoders (full)</h2>
            <p className={inter.className}>
              Generate fully-loaded config for multiple encoders in each NOC
              House
            </p>
            <br />
            <p>[y SRT Listeners each]</p>
          </Box>
          <Box
            className={styles.card}
            onClick={() => {
              // console.log(data);
              addEncryption();
            }}
            cursor="pointer"
          >
            <p className={inter.className}>7.</p>
            <h2 className={inter.className}>Add Encryption</h2>
            <p className={inter.className}>
              Adds AES-256 encryption to each stream on a device
            </p>
            <br />
            <p>10.88.88.43</p>
          </Box>
        </div>
      </div>
    </>
  );
}
