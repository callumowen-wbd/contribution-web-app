import "@/styles/globals.css";
import Layout from "./layout";
import { ChakraProvider } from "@chakra-ui/react";

export default function App({ Component, pageProps }) {
	return (
		<Layout>
			<ChakraProvider resetCSS={false} disableGlobalStyle={true}>
				<Component {...pageProps} />
			</ChakraProvider>
		</Layout>
	);
}
