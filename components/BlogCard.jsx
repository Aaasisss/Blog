import {
  Box,
  SimpleGrid,
  Flex,
  Text,
  HStack,
  useColorModeValue,
} from "@chakra-ui/react";
import { FaArrowRight } from "react-icons/fa";
import Link from "next/link";
import Image from "next/image";
import styles from "../styles/BlogCard.module.css";

const BlogCard = ({ post }) => {
  const date = new Date(post.postData.createdAt);
  const dateInString = date.toDateString();
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
        className={styles.main}
        _hover={{ border: "1px solid blue" }}
        bg={useColorModeValue("#ECB365", "#04293A")}
      >
        <SimpleGrid columns={{ sm: 1, md: 2, lg: 2 }} spacing={40}>
          <Flex
            direction={"column"}
            justifyContent={"space-between"}
            height={"250px"}
          >
            <Box>
              <Text fontSize={"2xl"} as="b">
                {post.postData.title}
              </Text>
              <Link passHref href={`/${post.postData.username}`}>
                <Text fontSize={"xs"}>@{post.postData.username}</Text>
              </Link>

              <Text fontSize={"xs"}>{dateInString}</Text>
            </Box>
            <HStack alignItems={"center"} spacing={10}>
              <Text fontSize={"md"} as="b">
                Read more
              </Text>
              <FaArrowRight />
            </HStack>
          </Flex>
          <Box className={styles.image}>
            <Image
              src={post.postData.downloadUrl}
              alt={post.postData.slug}
              layout="responsive"
              objectFit="cover"
              height={"250px"}
              width={"250px"}
            />
          </Box>
        </SimpleGrid>
      </Box>
    </Link>
  );
};
export default BlogCard;
