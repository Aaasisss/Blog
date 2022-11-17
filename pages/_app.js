import Layout from "../components/Layout";
import "../styles/globals.css";
import "../styles/BlogCard.module.css";
import { UserContext } from "../lib/context";
import { useUserData } from "../lib/hooks";
import { ChakraProvider } from "@chakra-ui/react";

function MyApp({ Component, pageProps }) {
  const userData = useUserData();
  return (
    <ChakraProvider>
      <UserContext.Provider value={userData}>
        <Layout>
          <Component {...pageProps} />
        </Layout>
      </UserContext.Provider>
    </ChakraProvider>
  );
}

export default MyApp;
