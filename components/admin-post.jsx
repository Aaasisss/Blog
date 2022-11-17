import { DeleteIcon, EditIcon } from "@chakra-ui/icons";
import {
  Box,
  HStack,
  IconButton,
  Stack,
  Text,
  useColorModeValue,
} from "@chakra-ui/react";

const AdminPost = () => {
  return (
    <Box
      display={"flex"}
      flexDirection={"row"}
      justifyContent={"space-between"}
      alignItems={"center"}
      py={"5px"}
      px={"5vw"}
      borderWidth="1px"
      borderRadius={"5"}
      bg={useColorModeValue("#ECB365", "#04293A")}
      maxWidth={"1000px"}
    >
      <Box>
        <Stack>
          <Text fontSize={"2xl"}>How I build my blog using next.js?</Text>
          <Text fontSize={"xs"}>Mon 25 Jul 2022</Text>
        </Stack>
      </Box>
      <HStack spacing={5}>
        <IconButton
          aria-label="Delete Post"
          icon={<DeleteIcon />}
          backgroundColor={"red"}
          color={"white"}
          size="sm"
        />
        <IconButton
          aria-label="Edit Post"
          icon={<EditIcon />}
          backgroundColor={"blue"}
          color={"white"}
          size="sm"
        />
      </HStack>
    </Box>
  );
};
export default AdminPost;
