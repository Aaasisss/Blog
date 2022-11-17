import { EmailIcon, LockIcon } from "@chakra-ui/icons";
import {
  Button,
  Box,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  InputGroup,
  Input,
  InputLeftElement,
  Stack,
  Text,
  useToast,
} from "@chakra-ui/react";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { useContext, useState } from "react";
import { auth, googleAuthProvider } from "../lib/firebase";
import { FcGoogle } from "react-icons/fc";
import { UserContext } from "../lib/context";

const SignIn = () => {
  const toast = useToast();
  const { user, username } = useContext(UserContext);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const { isOpen, onOpen, onClose } = useDisclosure();

  //sign in with google
  const signInWithGoogle = async () => {
    await signInWithPopup(auth, googleAuthProvider)
      .then((result) => {
        user = result.user;

        toast({
          position: "bottom-right",
          title: `Signed in successfully as ${user.displayName}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        // console.log(error);
        toast({
          position: "bottom-right",
          title: "Log in failed",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  function emailChangeHandler(event) {
    const input = event.target.value;
    console.log("email: " + input);

    setEmail(input);
  }
  function passwordChangeHandler(event) {
    const input = event.target.value;
    console.log("password: " + input);
    setPassword(input);
  }

  //sign in with Email
  const signInWithEmail = async () => {
    await signInWithEmailAndPassword(auth, email, password)
      .then((userCredentials) => {
        user = userCredentials.user;
        toast({
          position: "bottom-right",
          title: `Logged in successfully as ${user.displayName}`,
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        toast({
          position: "bottom-right",
          title: "Log in failed",
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  return (
    <>
      <Button onClick={onOpen}>Sign In</Button>
      <Modal
        isCentered
        onClose={onClose}
        isOpen={isOpen}
        motionPreset="slideInBottom"
      >
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Sign In</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Stack mb={"10px"} spacing={4}>
              <InputGroup>
                <InputLeftElement>
                  <EmailIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type={"email"}
                  placeholder={"email"}
                  variant={"flushed"}
                  onChange={emailChangeHandler}
                ></Input>
              </InputGroup>

              <InputGroup>
                <InputLeftElement>
                  <LockIcon color="gray.300" />
                </InputLeftElement>
                <Input
                  type={"password"}
                  placeholder={"********"}
                  variant={"flushed"}
                  onChange={passwordChangeHandler}
                ></Input>
              </InputGroup>
              <Button onClick={signInWithEmail}>Sign In</Button>
            </Stack>

            <hr />
            <Box mt={"10px"}>
              <Stack spacing={4} my={"10px"}>
                <Button
                  // isLoading
                  leftIcon={<FcGoogle />}
                  loadingText="signing in"
                  onClick={signInWithGoogle}
                >
                  Sign In With Google
                </Button>
              </Stack>
            </Box>
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  );
};

export default SignIn;
