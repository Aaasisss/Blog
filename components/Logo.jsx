import { Stack, Text, useColorModeValue } from "@chakra-ui/react";
import { AiOutlineCode } from "react-icons/ai";
import Link from "next/link";

const Logo = () => {
  return (
    <Stack direction={"row"} alignItems={"center"} spacing={1}>
      <AiOutlineCode
        size={"30px"}
        color={useColorModeValue("#023E8A", "white")}
        style={{ fontWeight: "bold" }}
      />
      <Text
        variant="h6"
        fontSize="xl"
        component="a"
        href="/"
        sx={{
          fontWeight: 900,
          color: useColorModeValue("#023E8A", "white"),
          letterSpacing: ".1rem",
          textDecoration: "none",
          fontFamily: "monospace",
        }}
      >
        <Link href={"/"} passHref>
          AAASISSS.DEV
        </Link>
      </Text>
    </Stack>
  );
};

export default Logo;
