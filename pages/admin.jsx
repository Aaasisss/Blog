import Post from "../components/admin-post";
import { Stack, Box, Text, Button, Center } from "@chakra-ui/react";

const Admin = () => {
  return (
    <Box 
    maxWidth={"1000px"}
    width={'100%'}
    >
      <Stack spacing={5} mb={"20px"}>
        <Box
          display={"flex"}
          flexDirection={"row"}
          justifyContent={"space-between"}
          alignItems={"center"}
width={'100%'}
          py={"5px"}
        >
          <Text>List of post</Text>
          <Button>Create</Button>
        </Box>
        <Stack spacing={5}>
          <Post />
          <Post />
          <Post />
          <Post />
          <Post />
        </Stack>
      </Stack>
      </Box>
  );
};

export default Admin;
