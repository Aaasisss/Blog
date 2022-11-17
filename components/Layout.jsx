import { Box, useColorModeValue, Center } from "@chakra-ui/react";
import Footer from "./Footer";
import NavBar from "./NavBar";

function Layout({ children }) {
  return (
    <Box
      sx={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        backgroundColor: useColorModeValue("gray.100", "gray.900"),
      }}
    >
      <Box
        sx={{
          width: "1200px",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
        }}
      >
        <NavBar />
        {children}
        <Footer />
      </Box>
    </Box>
  );
}
export default Layout;
