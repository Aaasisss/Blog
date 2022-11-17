import {
  Box,
  Flex,
  Avatar,
  HStack,
  IconButton,
  Button,
  useDisclosure,
  Stack,
  useColorMode,
  Drawer,
  DrawerOverlay,
  DrawerHeader,
  DrawerContent,
  DrawerBody,
  DrawerFooter,
  DrawerCloseButton,
  Center,
} from "@chakra-ui/react";
import {
  HamburgerIcon,
  CloseIcon,
  AddIcon,
  MoonIcon,
  SunIcon,
} from "@chakra-ui/icons";
import styles from "../styles/NavBar.module.css";
import Link from "next/link";
import { useRouter } from "next/router";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import SignIn from "./SignIn";
import Logo from "./Logo";

const drawerLinks = [
  { name: "Profile", linkTo: "/profile" },
  { name: "Add Content", linkTo: "/add-content" },
];

const navLinks = [
  { name: "About", linkTo: "/about" },
  { name: "Edit", linkTo: "/edit" },
];

const NavBar = () => {
  const { isOpen2, onOpen2, onClose2 } = useDisclosure();
  const { isOpen, onOpen, onClose } = useDisclosure();
  const { colorMode, toggleColorMode } = useColorMode();
  const router = useRouter();
  const { user, username } = useContext(UserContext);
  return (
    <Box className={styles.main}>
      <Box>
        <Logo />
      </Box>
      <Flex alignItems={"center"} justifyContent={"flex-end"}>
        <Button size={"sm"} mr={4} onClick={toggleColorMode}>
          {colorMode === "light" ? <MoonIcon /> : <SunIcon />}
        </Button>
        <Flex alignItems={"center"} justifyContent={"flex-end"}>
          <HStack
            spacing={4}
            display={{
              base: "none",
              md: "flex",
            }}
          >
            <Link href={navLinks[0].linkTo}>{navLinks[0].name}</Link>

            <Button
              variant={"solid"}
              colorScheme={"teal"}
              size={"sm"}
              mr={4}
              leftIcon={<AddIcon />}
              onClick={() => {
                router.push("/add-content");
              }}
            >
              Add
            </Button>

            {user ? (
              <Avatar
                size={"sm"}
                src={user.photoURL}
                onClick={() => {
                  if (username) {
                    router.push(`/${username}`);
                  } else {
                    router.push("/profile");
                  }
                }}
              />
            ) : (
              <Center>
                <SignIn />
              </Center>
            )}
          </HStack>
        </Flex>

        <Flex alignItems={"center"}>
          <IconButton
            size={"md"}
            icon={isOpen ? <CloseIcon /> : <HamburgerIcon />}
            aria-label={"Open Menu"}
            display={{ md: "none" }}
            onClick={isOpen ? onClose : onOpen}
          />
        </Flex>
      </Flex>

      {isOpen ? (
        <Drawer onClose={onClose} isOpen={isOpen} size="xs">
          <DrawerOverlay />
          <DrawerContent>
            <DrawerCloseButton />
            <DrawerHeader borderBottomWidth="1px">
              <Logo />
            </DrawerHeader>
            <DrawerBody>
              <Stack as={"nav"} spacing={4}>
                {drawerLinks.map((link) => (
                  <Link href={link.linkTo} key={link.name}>
                    {link.name}
                  </Link>
                ))}
              </Stack>
            </DrawerBody>
            <DrawerFooter>
              {" "}
              <Link href={"/help"}>Need Help?</Link>{" "}
            </DrawerFooter>
          </DrawerContent>
        </Drawer>
      ) : null}
    </Box>
  );
};
export default NavBar;
