import { Box, Button, Stack, Text } from "@chakra-ui/react";
import Link from "next/link";
import { useRouter } from "next/router";
import { AiFillHeart } from "react-icons/ai";

export default function PostFeed({ posts }) {
  return (
    <Box>
      <Stack spacing={6} sx={{ width: "100%" }}>
        {console.log(" this is from postfeed" + posts[0])}
        {posts.map((post, index) => (
          <PostItem key={index} post={post} />
        ))}
      </Stack>
    </Box>
  );
}

export function PostItem({ post }) {
  const router = useRouter();
  const date = new Date(post.postData.createdAt);
  return (
    <Link
      passHref
      href={{
        pathname: `/[username]/[docId]`,
        query: {
          username: post.postData.username,
          docId: post.docId,
          slug: post.postData.slug,
        },
      }}
    >
      <Box
        display={"flex"}
        flexDirection={"row"}
        justifyContent={"space-between"}
        width={"100%"}
        style={{ borderWidth: "1px", borderRadius: "10px", padding: "15px" }}
      >
        <Stack width={"100%"}>
          <Text>By @{post.postData.username}</Text>
          <Text fontSize={"2xl"}>{post.postData.title}</Text>
          <Text>{date.toDateString()}</Text>
        </Stack>
        <Box
          display={"flex"}
          flexDirection={"column"}
          justifyContent={"flex-end"}
        >
          <Box>
            <AiFillHeart color="red" />
            {post.heartCount}
          </Box>
        </Box>
      </Box>
    </Link>
  );
}
