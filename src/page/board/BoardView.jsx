import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Flex,
  FormControl,
  FormLabel,
  Heading,
  Image,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spacer,
  Spinner,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState({
    like: false,
    count: 0,
  });
  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => setBoard(res.data))
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "존재하지 않는 게시물입니다.",
            position: "top",
          });
          navigate("/");
        }
      });
  }, []);

  function handleClickRemove() {
    axios
      .delete(`/api/board/${id}`)
      .then(() => {
        toast({
          status: "success",
          description: `${id}번 게시물이 삭제되었습니다.`,
          position: "top",
        });
        navigate("/");
      })
      .catch(() => {
        toast({
          status: "error",
          description: `게시물이 삭제되지 않았습니다.`,
          position: "top",
        });
        navigate("/");
      });
  }

  function handleClickLike() {
    axios
      .put("/api/board/like", { boardId: board.id })
      .then((res) => {
        setLike(res.data);
      })
      .catch()
      .finally();
  }

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Flex>
        <Heading>{board.id}번 게시물</Heading>
        <Spacer />
        <Box
          onClick={handleClickLike}
          cursor={"pointer"}
          fontSize={"3xl"}
          color={"red"}
        >
          {like.like && <FontAwesomeIcon icon={fullHeart} />}
          {like.like || <FontAwesomeIcon icon={emptyHeart} />}
        </Box>
        <Box fontSize={"3xl"}>{like.count}</Box>
      </Flex>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input value={board.title} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>내용</FormLabel>
            <Textarea value={board.content} readOnly />
          </FormControl>
        </Box>
        <Box>
          {board.fileList &&
            board.fileList.map((file) => (
              <Box key={file.name} border={"2px solid black"} m={3}>
                <Image src={file.src} />
              </Box>
            ))}
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성자</FormLabel>
            <Input value={board.writer} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>작성 일시</FormLabel>
            <Input type={"datetime-local"} value={board.inserted} readOnly />
          </FormControl>
        </Box>
        {account.hasAccess(board.memberId) && (
          <Box>
            <Button
              colorScheme={"blue"}
              onClick={() => navigate(`/edit/${board.id}`)}
            >
              수정
            </Button>
            <Button colorScheme={"red"} onClick={onOpen}>
              삭제
            </Button>
          </Box>
        )}
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>삭제</ModalHeader>
          <ModalBody>삭제하시겠습니까</ModalBody>
          <ModalFooter>
            <Button onClick={onClose} colorScheme={"gray"}>
              취소
            </Button>
            <Button onClick={handleClickRemove} colorScheme={"red"}>
              삭제
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
