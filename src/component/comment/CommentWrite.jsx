import { Box, Button, Textarea, useToast } from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";

export function CommentWrite({ boardId, isSending, setIsSending }) {
  const [comment, setComment] = useState("");
  const toast = useToast();

  function handleCommentSubmitClick() {
    setIsSending(true);
    axios
      .post("/api/comment/add", {
        boardId,
        comment,
      })
      .then((res) => {
        setComment("");
        toast({
          status: "success",
          description: "댓글이 등록되었습니다.",
          position: "top",
        });
      })
      .catch()
      .finally(() => setIsSending(false));
  }

  return (
    <Box>
      <Textarea
        placeholder={"댓글을 작성해보세요."}
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Button
        isDisabled={comment.trim().length === 0}
        isLoading={isSending}
        onClick={handleCommentSubmitClick}
        colorScheme={"blue"}
      >
        <FontAwesomeIcon icon={faPaperPlane} />
      </Button>
    </Box>
  );
}
