import Link from "next/link";
import {
  Box,
  chakra,
  SimpleGrid,
  Stack,
  Text,
  VisuallyHidden,
  useColorModeValue,
  Center,
} from "@chakra-ui/react";
import {
  FaGithub,
  FaInstagram,
  FaLinkedinIn,
  FaTwitter,
  FaYoutube,
} from "react-icons/fa";
import Logo from "./Logo";
const date = new Date();

const SocialButton = ({ children, label, href }) => {
  return (
    <chakra.button
      bg={useColorModeValue("blackAlpha.100", "whiteAlpha.100")}
      rounded={"full"}
      w={8}
      h={8}
      cursor={"pointer"}
      as={"a"}
      href={href}
      display={"inline-flex"}
      alignItems={"center"}
      justifyContent={"center"}
      transition={"background 0.3s ease"}
      _hover={{
        bg: useColorModeValue("blackAlpha.200", "whiteAlpha.200"),
      }}
    >
      <VisuallyHidden>{label}</VisuallyHidden>
      {children}
    </chakra.button>
  );
};

const ListHeader = ({ children }) => {
  return (
    <Text fontWeight={"500"} fontSize={"lg"} mb={2}>
      {children}
    </Text>
  );
};

export default function Footer() {
  return (
    <Box width={"100%"}>
      <Center>
        <Box
          color={useColorModeValue("gray.700", "gray.200")}
          mx={"5vw"}
          style={{ borderTop: "1px solid white", maxWidth: "1000px" }}
          py={"10px"}
          width={"100%"}
        >
          <SimpleGrid columns={{ sm: 2, md: 3, lg: 3 }} spacing={8}>
            <Stack spacing={2}>
              <Logo />

              <Stack direction={"row"} spacing={6}>
                <SocialButton
                  label={"Twitter"}
                  href={"https://twitter.com/aaasisss"}
                >
                  <FaTwitter />
                </SocialButton>
                <SocialButton
                  label={"GitHub"}
                  href={"https://github.com/Aaasisss"}
                >
                  <FaGithub />
                </SocialButton>
                <SocialButton
                  label={"LinkedIn"}
                  href={"https://www.linkedin.com/in/aaasisss/"}
                >
                  <FaLinkedinIn />
                </SocialButton>
                <SocialButton
                  label={"Instagram"}
                  href={"https://www.instagram.com/_aaasisss_/"}
                >
                  <FaInstagram />
                </SocialButton>
              </Stack>
              <Text fontSize={"sm"}>© {date.getFullYear()} aaasisss.dev</Text>
            </Stack>
            <Stack>
              <ListHeader>Quick Links</ListHeader>
              <Link href={"/about"}>About</Link>
            </Stack>
            <Stack>
              <ListHeader>More</ListHeader>
              <Link href={"/terms-of-service"}>Terms of Service</Link>
              <Link href={"/contact"}>Contact me</Link>
            </Stack>
          </SimpleGrid>
        </Box>
      </Center>
    </Box>
  );
}
