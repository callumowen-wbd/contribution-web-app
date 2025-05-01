import Head from "next/head";
import styles from "@/styles/Home.module.css";
import haiConfigStyles from "@/styles/HaiConfig.module.css";
import { Inter } from "@next/font/google";
import {
  Box,
  Button,
  Flex,
  Heading,
  Radio,
  RadioGroup,
  Text,
} from "@chakra-ui/react";
import addEncryption from "@/utils/addEncryption";
import {
  eventEncoders,
  generateTechHubDecoders,
  techHubDecoders,
} from "../../utils/getDevices";
import { useState } from "react";

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
      "SessionID=BstkMmM4AYydLPMTSeHurScYHEDj1uQCUjUFFHJeDhro5dgXrXsTPEPvhqOiSCVN"
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
    return { props: { data: data.data } };
  } catch (error) {
    return { props: {} };
  }
  // Pass data to the page via props
}

export default function Home({ data }) {
  const [encoder, setEncoder] = useState(null);
  const [decoder, setDecoder] = useState(null);
  const [SDI, setSDI] = useState("1");
  return (
    <>
      <Head>
        <title>Contribution - Haivision Routing</title>
      </Head>
      <Heading position="fixed" bottom="4rem" mt="2rem">
        {encoder ? encoder.name + " SDI " + SDI : "_"} to{" "}
        {decoder ? decoder.name : "_"}
      </Heading>
      {encoder && decoder ? (
        <Button
          zIndex="1"
          cursor="pointer"
          colorScheme="purple"
          size="lg"
          position="fixed"
          bottom="8rem"
          mt="2rem"
          p="3rem"
          onClick={() => {
            console.log(encoder);
            console.log(decoder);
            console.log(SDI);
          }}
        >
          Route
        </Button>
      ) : (
        ""
      )}
      <Box className={(haiConfigStyles.wrapper, styles.center)}>
        <Flex
          width="100vw"
          h="75vh"
          p="0 40px"
          justify="space-between"
          gap="40px"
          fontFamily="sans-serif"
        >
          <Box width="100%" justifyItems="center" overflow="auto">
            <Heading pb="2rem">Event Encoders</Heading>
            <Flex direction="column" gap="4">
              {eventEncoders.map((enc) => (
                <Box>
                  <Box
                    background={encoder === enc ? "#cd8dff44" : "#ffffff1a"}
                    p="1rem 4rem"
                    borderRadius={encoder === enc ? "16px 16px 0 0" : "16px"}
                    color={encoder === enc ? "#bd69ff" : "#999"}
                    cursor="pointer"
                    onClick={
                      encoder === enc
                        ? () => setEncoder(null)
                        : () => setEncoder(enc)
                    }
                  >
                    <Text>{enc.name}</Text>
                  </Box>
                  <Box>
                    {encoder === enc ? (
                      <RadioGroup
                        background="#cd8dff22"
                        borderRadius="0 0 16px 16px"
                        p="1rem"
                        display="flex"
                        justifyContent="space-between"
                        pt="1rem"
                        w="full"
                        color="#bd69ff"
                        colorScheme="purple"
                        value={SDI}
                        onChange={(e) => {
                          setSDI(e);
                        }}
                      >
                        <Radio border="#cd8dff 1px solid" size="md" value="1">
                          SDI 1
                        </Radio>
                        <Radio border="#cd8dff 1px solid" size="md" value="2">
                          SDI 2
                        </Radio>
                        <Radio border="#cd8dff 1px solid" size="md" value="3">
                          SDI 3
                        </Radio>
                        <Radio border="#cd8dff 1px solid" size="md" value="4">
                          SDI 4
                        </Radio>
                      </RadioGroup>
                    ) : (
                      ""
                    )}
                  </Box>
                </Box>
              ))}
            </Flex>
          </Box>
          <Box width="100%" justifyItems="center">
            <Heading pb="2rem">Tech Hub Decoders</Heading>
            <Flex direction="column" gap="4" overflow="scroll" h="70vh">
              {techHubDecoders.map((dec) => (
                <Box
                  background={decoder == dec ? "#cd8dff44" : "#ffffff1a"}
                  p="1rem 4rem"
                  borderRadius="16px"
                  color={decoder == dec ? "#bd69ff" : "#999"}
                  cursor="pointer"
                  onClick={
                    decoder === dec
                      ? () => setDecoder(null)
                      : () => setDecoder(dec)
                  }
                >
                  <Text>{dec.name}</Text>
                </Box>
              ))}
            </Flex>
          </Box>
        </Flex>
      </Box>
      {/* <div className={styles.grid}>
          <Box
            className={styles.card}
            onClick={() => {
              console.log(data);
              addEncryption(data);
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
        </div> */}
    </>
  );
}
