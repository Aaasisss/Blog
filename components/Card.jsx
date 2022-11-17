import { Box, Stack, Text } from "@chakra-ui/react";
import Image from "next/image";
import Link from "next/link";
import styles from "../styles/Card.module.css";

const Card = ({ post }) => {
  const date = new Date(post.postData.createdAt);
  const dateInString = date.toDateString();
  return (
    <Link
      passHref
      href={{
        pathname: "/[username]/[docId]",
        query: {
          username: post.postData.username,
          docId: post.docId,
          slug: post.postData.slug,
        },
      }}
    >
      <Box className={styles.main}>
        <Stack spacing={3} width={"90%"}>
          <Box className={styles.image}>
            <Image
              src={post.postData.downloadUrl}
              alt={post.postData.slug}
              layout="responsive"
              objectPosition="center"
              objectFit="cover"
              height={"100%"}
              width={"100%"}
            />
          </Box>
          <Box px={"10px"}>
            <Text fontSize={"xs"}>{dateInString}</Text>
            <Text fontSize={"lg"}>{post.postData.title}</Text>
          </Box>
        </Stack>
      </Box>
    </Link>
  );
};

export default Card;
