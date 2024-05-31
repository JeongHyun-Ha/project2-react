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
import {
  faCalendarDays,
  faPenToSquare,
  faTrashCan,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
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
    <Box>
      <Flex mb={4}>
        <Box>
          <Flex gap={2} fontWeight={700}>
            <Box>
              <FontAwesomeIcon icon={faUser} />
            </Box>
            <Box>{comment.nickName}</Box>
          </Flex>
        </Box>
        <Spacer />
        <Flex gap={2}>
          <Box>
            <FontAwesomeIcon icon={faCalendarDays} />
          </Box>
          <Box>{comment.inserted}</Box>
        </Flex>
      </Flex>
      {isEditing || (
        <Flex>
          <Box whiteSpace={"pre"}>{comment.comment}</Box>
          <Spacer />
          {account.hasAccess(comment.memberId) && (
            <Box>
              <Box mb={1}>
                <Button
                  variant={"outline"}
                  size={"sm"}
                  colorScheme={"blue"}
                  onClick={() => setIsEditing(true)}
                >
                  <FontAwesomeIcon icon={faPenToSquare} />
                </Button>
              </Box>
              <Box>
                <Button
                  variant={"outline"}
                  size={"sm"}
                  colorScheme={"red"}
                  onClick={onOpen}
                  isLoading={isProcessing}
                >
                  <FontAwesomeIcon icon={faTrashCan} />
                </Button>
              </Box>
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
              <Button onClick={handleRemoveClick} colorScheme={"red"} mr={2}>
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
