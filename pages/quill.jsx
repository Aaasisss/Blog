import { Box } from "@chakra-ui/react";
import "quill/dist/quill.snow.css";
import { useCallback } from "react";

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

const QuillJs = () => {
  const editorRef = useCallback((ref) => {
    const Quill = require("quill");

    if (ref == null) return;
    ref.innerHTML = "";

    let editor = document.createElement("div");
    ref.append(editor);

    const quill = new Quill(editor, {
      theme: "snow",
      modules: { toolbar: TOOLBAR_OPTIONS },
    });
  });

  return (
    <Box height={"70vh"} width={"100%"}>
      <Box width={"100%"} height={"calc(100% - 45px)"} ref={editorRef}></Box>
    </Box>
  );
};
export default QuillJs;
