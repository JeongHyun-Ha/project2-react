import { Box, Button, Flex, Spacer } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

export function CommentItem({ comment, key }) {
  function handleRemoveClick(id) {
    axios
      .delete("/api/comment/remove", {
        data: { id: comment.id },
      })
      .then((res) => {})
      .catch()
      .finally();
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
          <Button colorScheme={"red"} onClick={handleRemoveClick}>
            <FontAwesomeIcon icon={faTrashCan} />
          </Button>
        </Box>
      </Flex>
    </Box>
  );
}
