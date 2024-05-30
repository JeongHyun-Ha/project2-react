import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export function CommentItem({ comment, isProcessing, setIsProcessing }) {
  function handleRemoveClick(id) {
    setIsProcessing(true);
    axios
      .delete("/api/comment/remove", {
        data: { id: comment.id },
      })
      .then((res) => {})
      .catch()
      .finally(() => setIsProcessing(false));
  }

  return (
    <Box border={"1px solid black"} my={3}>
      <Flex>
        <Box>작성자 : {comment.nickName}</Box>
        <Spacer />
        <Box>{comment.inserted}</Box>
      </Flex>
      <Flex>
        <Box>{comment.comment}</Box>
        <Spacer />
        <Box>
          <Button
            colorScheme={"red"}
            onClick={handleRemoveClick}
            isLoading={isProcessing}
          >
            <FontAwesomeIcon icon={faTrashCan} />
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
