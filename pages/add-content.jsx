import {
  Input,
  Text,
  Stack,
  Flex,
  IconButton,
  Button,
  useColorModeValue,
  Box,
  useToast,
  Image,
  CircularProgress,
  CircularProgressLabel,
} from "@chakra-ui/react";
import { MdOutlineArrowBack } from "react-icons/md";
import { useRouter } from "next/router";
import { useEffect, useState, useCallback, useContext } from "react";
import kebabCase from "lodash.kebabcase";
import AuthCheck from "../components/AuthCheck";
import {
  addDoc,
  collection,
  doc,
  serverTimestamp,
  updateDoc,
} from "firebase/firestore";
import { UserContext } from "../lib/context";
import { firestore, storage } from "../lib/firebase";
import "quill/dist/quill.snow.css";
import {
  deleteObject,
  getDownloadURL,
  ref,
  uploadBytesResumable,
} from "firebase/storage";
import styles from "../styles/AddContent.module.css";

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

const AddContent = () => {
  const router = useRouter();
  const {
    query: { docId, post, edit },
  } = router;
  let postForEdit = null;
  if (edit) {
    postForEdit = JSON.parse(post);
  }

  const toast = useToast();
  const [title, setTitle] = useState(edit ? postForEdit.title : "");
  const [content, setContent] = useState("");
  const { user, username } = useContext(UserContext);
  const [quill, setQuill] = useState(null);
  const [imageFile, setImageFile] = useState(null);
  const [imagePath, setImagePath] = useState(null);
  const [posting, setPosting] = useState(false);
  const [imageUploadProgress, setImageUploadProgress] = useState(0);

  useEffect(() => {
    if (!imageFile) {
      setImagePath(undefined);
      return;
    }

    const image = URL.createObjectURL(imageFile);
    setImagePath(image);

    return () => {
      URL.revokeObjectURL(imagePath);
    };
  }, [imageFile]);

  const editorRef = useCallback((ref) => {
    const Quill = require("quill");

    if (ref == null) return;
    ref.innerHTML = "";

    const editor = document.createElement("div");
    ref.append(editor);
    let q = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
    if (edit) {
      //initialize quill data
      q.setContents(postForEdit.content);
      //initialize content data
      setContent(postForEdit.content);
    }
    setQuill(q);
  }, []);

  //ensure slug is uri safe
  const slug = encodeURI(kebabCase(title));

  //validate title
  const isValid = title.length > 3 && title.length < 100;

  const onTitleChangeHandler = (event) => {
    const value = event.target.value;

    return setTitle(value);
  };

  //update changes in the editor
  if (quill) {
    quill.on("text-change", function () {
      setContent(quill.getContents().ops);
    });
  }

  const createPost = () => {
    if (quill == null) return;
    setPosting(true);

    //create a reference to document collection
    //document id is generated automatically with addDoc()
    const docRef = collection(firestore, "users", user.uid, "posts");

    //create a reference for new image
    // appending date on the name, it creates a unique name every time,
    // even slug is similar
    const imageRef = ref(storage, `uploads/${user.uid}/${slug}${Date.now()}`);

    if (imageFile) {
      //upload image
      const uploadTask = uploadBytesResumable(imageRef, imageFile);

      uploadTask.on(
        "state_changed",
        (snapshot) => {
          // Observe state change events such as progress, pause, and resume
          // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
          const progrss =
            (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
          setImageUploadProgress(progrss.toFixed());
        },
        (error) => {
          // Handle unsuccessful uploads
          toast({
            position: "bottom-right",
            title: "Error occured while uploading image.",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        },
        () => {
          //reset values
          setTitle("");
          setImageFile(null);
          setImagePath(null);
          setQuill(null);
          quill.setContents([{ insert: "\n" }]);

          toast({
            position: "bottom-right",
            title: "Image uploaded",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
          // Handle successful uploads on complete
          getDownloadURL(uploadTask.snapshot.ref).then(async (downloadURL) => {
            await addDoc(docRef, {
              content: content,
              createdAt: serverTimestamp(),
              heartCount: 0,
              published: true,
              slug: slug,
              title: title,
              uid: user.uid,
              updatedAt: serverTimestamp(),
              username: username,
              downloadUrl: downloadURL,
            })
              .then(() => {
                setPosting(false);
                toast({
                  position: "bottom-right",
                  title: "New post created.",
                  status: "success",
                  duration: 9000,
                  isClosable: true,
                });
              })
              .catch(() => {
                setPosting(false);

                toast({
                  position: "bottom-right",
                  title: "Error occured!",
                  status: "error",
                  duration: 9000,
                  isClosable: true,
                });
              });
          });
        }
      );
    }
  };

  async function editPost() {
    if (quill == null) return;
    setPosting(true);

    //create a reference to the current document
    const docRef = doc(firestore, "users", user.uid, "posts", docId);

    if (imageFile) {
      //create new image ref
      const newImageRef = ref(
        storage,
        `uploads/${user.uid}/${slug}${Date.now()}`
      );

      //create old image ref
      const oldImageRef = ref(storage, postForEdit.downloadUrl);

      //upload image
      const uploadTask = uploadBytesResumable(newImageRef, imageFile);

      //Delete the old image first and then add the new one
      deleteObject(oldImageRef)
        .then(() => {
          // File deleted successfully
          toast({
            position: "bottom-right",
            title: "Image deleted successfully.",
            status: "success",
            duration: 9000,
            isClosable: true,
          });

          uploadTask.on(
            "state_changed",
            (snapshot) => {
              // Observe state change events such as progress, pause, and resume
              // Get task progress, including the number of bytes uploaded and the total number of bytes to be uploaded
              const progrss =
                (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
              setImageUploadProgress(progrss.toFixed());
            },
            (error) => {
              // Handle unsuccessful uploads
              toast({
                position: "bottom-right",
                title: "Error occured while uploading image.",
                status: "error",
                duration: 9000,
                isClosable: true,
              });
            },
            () => {
              //reset values
              setTitle("");
              setImageFile(null);
              setImagePath(null);
              setQuill(null);
              quill.setContents([{ insert: "\n" }]);

              toast({
                position: "bottom-right",
                title: "Image uploaded",
                status: "success",
                duration: 9000,
                isClosable: true,
              });

              // Handle successful uploads on complete
              getDownloadURL(uploadTask.snapshot.ref).then(
                async (downloadURL) => {
                  await updateDoc(docRef, {
                    title: title,
                    content: content,
                    updatedAt: serverTimestamp(),
                    slug: slug,
                    downloadUrl: downloadURL,
                  })
                    .then(() => {
                      setPosting(false);
                      toast({
                        position: "bottom-right",
                        title: "Post Editing Done",
                        status: "success",
                        duration: 9000,
                        isClosable: true,
                      });
                    })
                    .catch(() => {
                      setPosting(false);

                      toast({
                        position: "bottom-right",
                        title: "Error occured!",
                        status: "error",
                        duration: 9000,
                        isClosable: true,
                      });
                    });
                }
              );
            }
          );
        })
        .catch((error) => {
          setPosting(false);

          // Uh-oh, an error occurred!
          toast({
            position: "bottom-right",
            title: "Error occured while deleting image!",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    } else {
      await updateDoc(docRef, {
        title: title,
        content: content,
        updatedAt: serverTimestamp(),
        slug: slug,
      })
        .then(() => {
          //reset values
          setTitle("");
          setQuill(null);
          quill.setContents([{ insert: "\n" }]);

          setImageUploadProgress(100);

          setPosting(false);
          toast({
            position: "bottom-right",
            title: "Post Editing Done",
            status: "success",
            duration: 9000,
            isClosable: true,
          });
        })
        .catch(() => {
          toast({
            position: "bottom-right",
            title: "Error occured!",
            status: "error",
            duration: 9000,
            isClosable: true,
          });
        });
    }
  }

  //default post data
  const defaultPostData = {
    content: "",
    createdAt: serverTimestamp(),
    heartCount: 0,
    published: true,
    slug: slug,
    title: "",
    uid: user?.uid,
    updatedAt: serverTimestamp(),
    username: username,
  };

  const onImageChangeHandler = (event) => {
    const imageFile = event.target.files[0];
    setImageFile(imageFile);
  };

  return (
    <Box
      style={{
        width: "100%",
        height: "90vh",
      }}
    >
      <AuthCheck>
        <Stack
          style={{
            width: "100%",
            marginTop: "10px",
            alignItems: "center",
            height: "100%",
          }}
          spacing={3}
        >
          <Flex
            style={{ width: "clamp(50%, 1000px, 100%)" }}
            direction={"row"}
            justifyContent={"space-between"}
          >
            <IconButton
              colorScheme={"orange"}
              icon={
                <MdOutlineArrowBack
                  onClick={() => {
                    router.back();
                  }}
                />
              }
            />

            <Text fontSize={"3xl"} align={"center"}>
              {edit ? "Edit this post" : "Create a new post."}
            </Text>

            <Button
              type="submit"
              colorScheme={"green"}
              disabled={!isValid || posting}
              onClick={edit ? editPost : createPost}
              sx={{ padding: "25px" }}
            >
              {posting ? (
                <CircularProgress value={imageUploadProgress} color="#ECB365">
                  <CircularProgressLabel>
                    {imageUploadProgress}
                    {"%"}
                  </CircularProgressLabel>
                </CircularProgress>
              ) : (
                "Publish"
              )}
            </Button>
          </Flex>
          <Box
            style={{
              width: "clamp(50%, 1000px, 100%)",
              height: "100%",
            }}
          >
            <Stack
              spacing={2}
              sx={{
                height: "100%",
              }}
            >
              <Input
                fontSize={"2xl"}
                type={"text"}
                borderColor={useColorModeValue("#ECB365", "#04293A")}
                placeholder={"Title"}
                _hover={{ border: "1px solid blue" }}
                alignItems={"center"}
                onChange={onTitleChangeHandler}
                value={title}
                sx={{ width: "100%" }}
              />
              <Stack direction={"row"} spacing={10} alignItems={"center"}>
                <Stack>
                  {edit && (
                    <Text>
                      Image will remain same unless new one is chosen.
                    </Text>
                  )}
                  <Input
                    type={"file"}
                    onChange={onImageChangeHandler}
                    accept="image/x-png,image/gif,image/jpeg"
                    sx={{ display: "inline", width: "400px" }}
                  />
                </Stack>

                <Box
                  sx={{
                    bgColor: "grey",
                    height: "100px",
                    width: "100px",
                    display: "inline",
                  }}
                  borderColor={useColorModeValue("#ECB365", "#04293A")}
                >
                  {imageFile ? (
                    <>
                      <Image
                        src={imagePath}
                        alt={"choosen image"}
                        boxSize={"100px"}
                        objectFit={"cover"}
                        sx={{ display: "inline" }}
                      />
                    </>
                  ) : (
                    <>
                      <Text
                        sx={{
                          textAlign: "center",
                          alignItems: "center",
                        }}
                      >
                        Image Preview
                      </Text>
                    </>
                  )}
                </Box>
              </Stack>

              <Box id={styles.container} ref={editorRef}></Box>
            </Stack>
          </Box>
        </Stack>
      </AuthCheck>
    </Box>
  );
};

export default AddContent;
