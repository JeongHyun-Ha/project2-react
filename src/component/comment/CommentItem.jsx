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
  Spacer,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faPenToSquare, faTrashCan } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";
import { useContext, useState } from "react";
import { LoginContext } from "../LoginProvider.jsx";
import { CommentEdit } from "./CommentEdit.jsx";

export function CommentItem({ comment, isProcessing, setIsProcessing }) {
  const [isEditing, setIsEditing] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const toast = useToast();
  const account = useContext(LoginContext);

  function handleRemoveClick(id) {
    setIsProcessing(true);
    axios
      .delete("/api/comment/remove", {
        data: { id: comment.id },
      })
      .then((res) => {
        toast({
          description: "댓글이 삭제되었습니다.",
          status: "success",
          position: "top",
        });
      })
      .catch()
      .finally(() => {
        setIsProcessing(false);
      });
  }

  return (
    <Box border={"1px solid black"} my={3}>
      <Flex>
        <Box>작성자 : {comment.nickName}</Box>
        <Spacer />
        <Box>{comment.inserted}</Box>
      </Flex>
      {isEditing || (
        <Flex>
          <Box>{comment.comment}</Box>
          <Spacer />
          {account.hasAccess(comment.memberId) && (
            <Box>
              <Button colorScheme={"blue"} onClick={() => setIsEditing(true)}>
                <FontAwesomeIcon icon={faPenToSquare} />
              </Button>
              <Button
                colorScheme={"red"}
                onClick={onOpen}
                isLoading={isProcessing}
              >
                <FontAwesomeIcon icon={faTrashCan} />
              </Button>
            </Box>
          )}
        </Flex>
      )}
      {isEditing && (
        <CommentEdit
          comment={comment}
          setIsEditing={setIsEditing}
          setIsProcessing={setIsProcessing}
          isProcessing={isProcessing}
        />
      )}
      {account.hasAccess(comment.memberId) && (
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>댓글 삭제</ModalHeader>
            <ModalBody>댓글을 삭제하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button onClick={handleRemoveClick} colorScheme={"red"}>
                삭제
              </Button>
              <Button onClick={onClose}>취소</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      )}
    </Box>
  );
}
