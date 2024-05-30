import { Box, Button, Textarea, Tooltip, useToast } from "@chakra-ui/react";
import { useContext, useState } from "react";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPaperPlane } from "@fortawesome/free-solid-svg-icons";
import { LoginContext } from "../LoginProvider.jsx";

export function CommentWrite({ boardId, isSending, setIsSending }) {
  const [comment, setComment] = useState("");
  const toast = useToast();
  const account = useContext(LoginContext);

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
        isDisabled={!account.isLoggedIn()}
        placeholder={
          account.isLoggedIn()
            ? "댓글을 작성해보세요."
            : "댓글을 작성하시려면 로그인해주세요."
        }
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <Tooltip
        label={"로그인 하세요."}
        isDisabled={account.isLoggedIn()}
        placement={"top"}
      >
        <Button
          isDisabled={comment.trim().length === 0 || !account.isLoggedIn()}
          isLoading={isSending}
          onClick={handleCommentSubmitClick}
          colorScheme={"blue"}
        >
          <FontAwesomeIcon icon={faPaperPlane} />
        </Button>
      </Tooltip>
    </Box>
  );
}
