import {
  Button,
  Box,
  useToast,
  Text,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionIcon,
  AccordionPanel,
  CircularProgress,
  Center,
} from "@chakra-ui/react";
import { signOut } from "firebase/auth";
import { useContext } from "react";
import { UserContext } from "../lib/context";
import { auth } from "../lib/firebase";
import { useRouter } from "next/router";

import UsernameForm from "../components/UsernameForm";
import AuthCheck from "../components/AuthCheck";
import { useEffect } from "react";

const Profile = () => {
  const { user, username } = useContext(UserContext);

  const router = useRouter();
  const toast = useToast();

  return (
    <Box style={{ minHeight: "50vh", width: "1000px" }}>
      {user ? (
        <Box style={{ minHeight: "50vh", width: "100%" }}>
          <Accordion allowToggle width={"100%"}>
            <AccordionItem>
              <AccordionButton>
                View Info
                <AccordionIcon />
              </AccordionButton>

              <AccordionPanel>
                <Text>Id: {user.uid}</Text>
                <Text>name: {user.displayName}</Text>
                <Text>email: {user.email}</Text>
                <Text>username: {username}</Text>
              </AccordionPanel>
            </AccordionItem>
          </Accordion>

          {!username && (
            <>
              <Accordion allowToggle width={"100%"}>
                <AccordionItem>
                  <AccordionButton>
                    Set username
                    <AccordionIcon />
                  </AccordionButton>

                  <AccordionPanel>
                    <UsernameForm />
                  </AccordionPanel>
                </AccordionItem>
              </Accordion>
            </>
          )}

          <Button
            onClick={async () =>
              signOut(auth).then(() => {
                router.push("/");
                toast({
                  position: "bottom-right",
                  title: "Signed out",
                  // description: "signed out successfully.",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
              })
            }
          >
            sign Out
          </Button>
          <hr />
          <hr />
          <hr />
        </Box>
      ) : (
        <Center>
          <CircularProgress isIndeterminate color="green.300" />
        </Center>
      )}
    </Box>
  );
};

export default Profile;
