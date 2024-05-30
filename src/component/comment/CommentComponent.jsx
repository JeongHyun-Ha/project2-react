import { Box } from "@chakra-ui/react";
import { CommentList } from "./CommentList.jsx";
import { CommentWrite } from "./CommentWrite.jsx";
import { useState } from "react";

export function CommentComponent({ boardId }) {
  const [isProcessing, setIsProcessing] = useState(false);

  return (
    <Box>
      <CommentWrite
        boardId={boardId}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
      <CommentList
        boardId={boardId}
        isProcessing={isProcessing}
        setIsProcessing={setIsProcessing}
      />
    </Box>
  );
}
