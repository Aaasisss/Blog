import React, { useContext, useState, useEffect, useCallback } from "react";
import {
  FormControl,
  FormLabel,
  FormErrorMessage,
  FormHelperText,
  Text,
  Input,
  Button,
  Box,
  useToast,
} from "@chakra-ui/react";
import { UserContext } from "../lib/context";
import { doc, Firestore, getDoc, writeBatch } from "firebase/firestore";
import { firestore } from "../lib/firebase";
import debounce from "lodash.debounce";

const UsernameForm = () => {
  const [formInput, setFormInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [isValid, setIsValid] = useState(false);
  const { user, username } = useContext(UserContext);
  const toast = useToast();

  let helperText = "Username available";
  let usernameErrorMessage = "Username is already taken";
  let loadingMessage = "Checking...";
  let lengthErrorMessage = "Write at least 4 characters";

  useEffect(() => {
    validateUserName(formInput);
  }, [formInput]);

  const validateUserName = useCallback(
    debounce(async (value) => {
      if (value.length > 3) {
        const docRef = doc(firestore, "usernames", value);
        const docSnap = await getDoc(docRef);
        // console.log("firestore read executed");
        // console.log(docSnap.exists());

        setIsValid(!docSnap.exists());
        setLoading(false);
      }
    }, 500),
    []
  );

  function onChangeHandler(event) {
    const input = event.target.value.toLowerCase();
    const reg = /^(?=[a-zA-Z0-9._]{3,15}$)(?!.*[_.]{2})[^_.].*[^_.]$/;

    if (input.length < 3) {
      setFormInput(input);
      setLoading(false);
      setIsValid(false);
    }
    if (reg.test(input)) {
      setFormInput(input);
      setLoading(true);
      setIsValid(false);
    }
  }

  const onSubmit = async (event) => {
    event.preventDefault();
    //create refs for both documents
    const userDoc = doc(firestore, "users", user.uid);
    const usernameDoc = doc(firestore, "usernames", formInput);

    //commit both documents together as a batch write
    const batch = writeBatch(firestore);

    batch.set(userDoc, {
      userName: formInput,
      displayName: user.displayName,
      photoURL: user.photoURL,
      email: user.email,
    });
    batch.set(usernameDoc, { uid: user.uid });
    // Commit the batch
    await batch
      .commit()
      .then(() => {
        toast({
          position: "bottom-right",
          title: "username set successfully",
          status: "success",
          duration: 9000,
          isClosable: true,
        });
      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        toast({
          position: "bottom-right",
          title: "an unknown error occured.",
          description: `${errorCode} : ${errorMessage}`,
          status: "error",
          duration: 9000,
          isClosable: true,
        });
      });
  };

  function showMessage({ formInput, isValid, loading }) {
    if (formInput.length > 0 && formInput.length <= 3) {
      return <Text>{lengthErrorMessage}</Text>;
    } else {
      if (loading) {
        return (
          <Text fontSize={"lg"} color={"gray"}>
            {loadingMessage}
          </Text>
        );
      } else if (isValid) {
        return (
          <Text fontSize={"lg"} color={"green"}>
            {helperText}
          </Text>
        );
      } else if (formInput && !isValid) {
        return (
          <Text fontSize={"lg"} color={"red"}>
            {usernameErrorMessage}
          </Text>
        );
      } else {
        return <></>;
      }
    }
  }

  return (
    <Box width={"100%"}>
      <Text fontSize={"2xl"}>Choose your username</Text>
      <form onSubmit={onSubmit}>
        <FormControl isRequired>
          <FormLabel>Username (You cannot change this later.)</FormLabel>
          <Input type={"text"} onChange={onChangeHandler} value={formInput} />
          {showMessage({ formInput, isValid, loading })}
        </FormControl>
        <Button disabled={!isValid} type="submit">
          Set username
        </Button>
      </form>
    </Box>
  );
};

export default UsernameForm;
