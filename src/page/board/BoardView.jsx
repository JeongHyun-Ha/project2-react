import { useNavigate, useParams } from "react-router-dom";
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Button,
  Card,
  CardBody,
  Center,
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
  Tooltip,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { LoginContext } from "../../component/LoginProvider.jsx";
import { faHeart as fullHeart } from "@fortawesome/free-solid-svg-icons";
import { faHeart as emptyHeart } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { CommentComponent } from "../../component/comment/CommentComponent.jsx";

export function BoardView() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [like, setLike] = useState({
    like: false,
    count: 0,
  });
  const [isLikeProcessing, setIsLikeProcessing] = useState(false);
  const account = useContext(LoginContext);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/board/${id}`)
      .then((res) => {
        setBoard(res.data.board);
        setLike(res.data.like);
      })
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
    if (!account.isLoggedIn()) {
      return;
    }
    setIsLikeProcessing(true);
    axios
      .put("/api/board/like", { boardId: board.id })
      .then((res) => {
        setLike(res.data);
      })
      .catch()
      .finally(() => setIsLikeProcessing(false));
  }

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Center>
      <Box w={500}>
        <Box mb={10}>
          <Flex>
            <Heading>{board.id}번 게시물</Heading>
            <Spacer />
            {isLikeProcessing || (
              <Flex>
                <Tooltip
                  label={"로그인 해주세요."}
                  hasArrow
                  isDisabled={account.isLoggedIn()}
                >
                  <Box
                    onClick={handleClickLike}
                    cursor={"pointer"}
                    fontSize={"2xl"}
                    color={"red"}
                  >
                    {like.like && <FontAwesomeIcon icon={fullHeart} />}
                    {like.like || <FontAwesomeIcon icon={emptyHeart} />}
                  </Box>
                </Tooltip>
                <Box ml={3} fontSize={"2xl"}>
                  {like.count}
                </Box>
              </Flex>
            )}
            {isLikeProcessing && <Spinner />}
          </Flex>
        </Box>
        <Box>
          <Box mb={7}>
            <FormControl>
              <FormLabel>제목</FormLabel>
              <Input value={board.title} readOnly />
            </FormControl>
          </Box>
          <Box mb={7}>
            <FormControl>
              <FormLabel>내용</FormLabel>
              <Textarea value={board.content} readOnly />
            </FormControl>
          </Box>
          <Box mb={7}>
            {board.fileList &&
              board.fileList.map((file) => (
                <Card key={file.name} m={3}>
                  <CardBody>
                    <Image src={file.src} />
                  </CardBody>
                </Card>
              ))}
          </Box>
          <Box mb={7}>
            <FormControl>
              <FormLabel>작성자</FormLabel>
              <Input value={board.writer} readOnly />
            </FormControl>
          </Box>

          {account.hasAccess(board.memberId) && (
            <Box mb={7}>
              <Button
                mr={2}
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
        <Box mb={20}></Box>
        <CommentComponent boardId={board.id} />
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>삭제</ModalHeader>
            <ModalBody>삭제하시겠습니까</ModalBody>
            <ModalFooter>
              <Button onClick={handleClickRemove} colorScheme={"red"} mr={2}>
                삭제
              </Button>
              <Button onClick={onClose} colorScheme={"gray"}>
                취소
              </Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Center>
  );
}
