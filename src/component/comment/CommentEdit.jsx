import {
  Box,
  Button,
  Flex,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
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
  const { onClose, onOpen, isOpen } = useDisclosure();
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
          description: "내부 오류가 발생하였습니다.",
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
      <Box margin={"auto"} ml={3}>
        <Box>
          <Button
            size={"sm"}
            mb={2}
            isLoading={isProcessing}
            variant={"outline"}
            colorScheme={"blue"}
            onClick={onOpen}
          >
            <FontAwesomeIcon icon={faPaperPlane} />
          </Button>
        </Box>
        <Box>
          <Button
            size={"sm"}
            variant={"outline"}
            colorScheme={"gray.200"}
            onClick={() => setIsEditing(false)}
          >
            <FontAwesomeIcon icon={faXmark} />
          </Button>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>댓글 수정</ModalHeader>
          <ModalBody>댓글을 수정하시겠습니까?</ModalBody>
          <ModalFooter>
            <Button colorScheme={"blue"} onClick={handleCommentSubmit}>
              수정
            </Button>
            <Button colorScheme={"gray"} onClick={onClose}>
              취소
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Flex>
  );
}
