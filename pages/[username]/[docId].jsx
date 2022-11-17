import {
  collectionGroup,
  doc,
  getDoc,
  getDocs,
  query,
} from "firebase/firestore";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import "quill/dist/quill.snow.css";
import { Box, Flex, Stack, Text, Image, Link, Button } from "@chakra-ui/react";
import { useCallback, useEffect, useState } from "react";
import styles from "../../styles/ViewContent.module.css";
import { useContext } from "react";
import { UserContext } from "../../lib/context";
import { FaEdit } from "react-icons/fa";
import Router from "next/router";

const TOOLBAR_OPTIONS = [
  [{ header: [1, 2, 3, 4, 5, 6, false] }],
  [{ font: [] }],
  [{ list: "ordered" }, { list: "bullet" }],
  ["bold", "italic", "underline"],
  [{ color: [] }, { background: [] }],
  [{ script: "sub" }, { script: "super" }],
  [{ align: [] }],
  ["image", "blockquote", "code-block"],
  ["clean"],
];

export async function getStaticProps(context) {
  const { username, docId } = context.params;
  const slug = context.params.slug;
  const userDoc = await getUserWithUsername(username);

  let userInfo;
  let post;
  let path;

  if (userDoc) {
    userInfo = userDoc.data();

    const postRef = doc(firestore, "users", userDoc.id, "posts", docId);
    const postDoc = await getDoc(postRef);

    post = postToJSON(postDoc);
    path = postRef.path;
  }

  return {
    props: { docId, post, path, userInfo },
    revalidate: 5000,
  };
}

export async function getStaticPaths() {
  const snapshot = getDocs(query(collectionGroup(firestore, "posts")));
  const paths = (await snapshot).docs.map((doc) => {
    const { slug, username } = doc.data();
    const docId = doc.id;

    return {
      params: { username, docId },
    };
  });
  return {
    paths,
    fallback: "blocking",
  };
}

const ViewContent = ({ docId, post, userInfo }) => {
  //convert date to a readable string
  const date = new Date(post.updatedAt);
  const dateInString = date.toDateString();

  const [quill, setQuill] = useState(null);
  const [editorMode, setEditorMode] = useState(false);
  const { user, username } = useContext(UserContext);

  //initiate the editor
  const editorRef = useCallback((ref) => {
    const Quill = require("quill");

    if (ref == null) return;

    ref.innerHTML = "";
    const editor = document.createElement("div");

    ref.append(editor);
    let q = new Quill(editor, {
      theme: "snow",
      readOnly: !editorMode,
      modules: {
        toolbar: editorMode && TOOLBAR_OPTIONS,
      },
    });
    q.setContents(post.content);
    setQuill(q);
  }, []);

  //remove the border of the editor
  useEffect(() => {
    let elements = document.getElementsByClassName("ql-container");
    elements[0].style["border"] = "none";
  }, []);

  function handleEditPost() {
    Router.push({
      pathname: `/add-content`,
      query: {
        docId: docId,
        post: JSON.stringify(post),
        edit: true,
      },
    });
  }

  return (
    <Box className={styles.main}>
      <Box
        sx={{
          width: { xl: "50%", lg: "60%", md: "70%", sm: "100%" },
        }}
      >
        <Box className={styles.container}>
          <Link href={`/${post.username}`}>
            <Stack spacing={3} direction={"row"}>
              <Image
                className={styles.image}
                src={userInfo.photoURL}
                alt={"image"}
              />
              <Box>
                <Stack spacing={0}>
                  <Text>{userInfo.displayName}</Text>
                  <Text>@{userInfo.userName}</Text>
                </Stack>
              </Box>
            </Stack>
          </Link>

          <Flex sx={{ alignItems: "space-between", flexDirection: "column" }}>
            <Text>{dateInString}</Text>
            {username == userInfo.userName && (
              <Button
                onClick={handleEditPost}
                leftIcon={<FaEdit />}
                colorScheme="green"
              >
                Edit Post
              </Button>
            )}
          </Flex>
        </Box>
        <Text fontSize={"3xl"} sx={{ fontWeight: "bold", paddingX: "10px" }}>
          {post.title}
        </Text>
        <Image
          src={post.downloadUrl}
          alt={post.slug}
          objectFit={"contain"}
          width={"100%"}
        />
        <Box ref={editorRef}></Box>
      </Box>
    </Box>
  );
};

export default ViewContent;
