import { Box, Text } from "@chakra-ui/react";
import Image from "next/image";

export default function UserProfile({ user }) {
  return (
    <Box
      display={"flex"}
      justifyContent={"center"}
      flexDirection={"column"}
      alignItems={"center"}
    >
      <Image
        style={{ borderRadius: "100%" }}
        src={user.photoURL}
        alt={"image"}
        height={"100px"}
        width={"100px"}
        objectFit="cover"
        objectPosition={"center"}
      />
      <Text>@{user.userName}</Text>
      <Text fontSize={"2xl"}>{user.displayName}</Text>
    </Box>
  );
}
