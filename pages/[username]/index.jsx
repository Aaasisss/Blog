import { Box, Center, CircularProgress, Stack } from "@chakra-ui/react";
import {
  collection,
  getDocs,
  limit,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { firestore, getUserWithUsername, postToJSON } from "../../lib/firebase";
import UserProfile from "../../components/UserProfile";
import PostFeed from "../../components/PostFeed";

function UserProfilePage({ user, posts }) {
  return user && posts ? (
    <Box
      style={{
        width: "clamp(50%, 700px, 100%)",
        marginBottom: "20px",
        marginTop: "20px",
      }}
    >
      <Stack>
        <UserProfile user={user} />
        <PostFeed posts={posts} />
      </Stack>
    </Box>
  ) : (
    <Center>
      <CircularProgress isIndeterminate color="green.300" />
    </Center>
  );
}

export default UserProfilePage;

export async function getServerSideProps(context) {
  const username = context.params.username;
  const userDocSnapshot = await getUserWithUsername(username);

  if (!userDocSnapshot) {
    return {
      notFound: true,
    };
  }

  //JSON serializable data
  let user = null;
  let posts = null;
  let uid = null;
  if (userDocSnapshot) {
    user = userDocSnapshot.data();
    uid = userDocSnapshot.id;

    const usersRef = collection(firestore, "users");
    const postsRef = collection(usersRef, uid, "posts");
    const postQuery = query(
      postsRef,
      where("published", "==", true),
      orderBy("createdAt", "desc"),
      limit(5)
    );

    posts = (await getDocs(postQuery)).docs.map((postDoc) => {
      const docId = postDoc.id;
      const postData = postToJSON(postDoc);
      return { docId, postData };
    });
  }

  return {
    props: { user, posts },
  };
}
