import { Box, Button, Flex, Textarea, useToast } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane, faXmark } from "@fortawesome/free-solid-svg-icons";
import { useState } from "react";
import axios from "axios";

export function CommentEdit({
  comment,
  setIsEditing,
  setIsProcessing,
  isProcessing,
}) {
  const [commentText, setCommentText] = useState(comment.comment);
  const toast = useToast();

  function handleCommentSubmit() {
    setIsProcessing(true);
    axios
      .put("/api/comment/edit", {
        id: comment.id,
        comment: commentText,
      })
      .then((res) => {
        toast({
          status: "success",
          description: "댓글이 수정되었습니다.",
          position: "top",
        });
      })
      .catch(() => {
        toast({
          status: "error",
          description: "내부 에러가 발생하였습니다.",
          position: "top",
        });
      })
      .finally(() => {
        setIsProcessing(false);
        setIsEditing(false);
      });
  }

  return (
    <Flex>
      <Box flex={1}>
        <Textarea
          defaultValue={commentText}
          onChange={(e) => setCommentText(e.target.value)}
        />
      </Box>
      <Box>
        <Button
          variant={"outline"}
          colorScheme={"gray"}
          onClick={() => setIsEditing(false)}
        >
          <FontAwesomeIcon icon={faXmark} />
        </Button>
        <Button
          isLoading={isProcessing}
          variant={"outline"}
          colorScheme={"blue"}
          onClick={handleCommentSubmit}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </Button>
      </Box>
    </Flex>
  );
}
