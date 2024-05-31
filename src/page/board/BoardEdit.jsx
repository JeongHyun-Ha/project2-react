import { useNavigate, useParams } from "react-router-dom";
import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  CardHeader,
  Center,
  FormControl,
  FormHelperText,
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
  Spinner,
  Stack,
  StackDivider,
  Switch,
  Text,
  Textarea,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { faTrashCan } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function BoardEdit() {
  const { id } = useParams();
  const [board, setBoard] = useState(null);
  const [removeFileList, setRemoveFileList] = useState([]);
  const [addFileList, setAddFileList] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios.get(`/api/board/${id}`).then((res) => setBoard(res.data.board));
  }, []);

  function handleClickSave() {
    axios
      .putForm(`/api/board/edit`, {
        id: board.id,
        title: board.title,
        content: board.content,
        removeFileList,
        addFileList,
      })
      .then(() => {
        toast({
          status: "success",
          description: `${board.id}번 게시물이 수정이 되었습니다.`,
          position: "top",
        });
        navigate(`/board/${board.id}`);
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description:
              "게시물이 수정되지 않았습니다. 작성한 내용을 확인해주세요.",
            position: "top",
          });
        }
        if (err.response.status === 403) {
          toast({
            status: "warning",
            description: "접근 권한이 없습니다.",
            position: "top",
          });
        }
        navigate(`/board/${board.id}`);
      })
      .finally(() => {
        onClose();
      });
  }

  function handleRemoveSwitchChange(name, checked) {
    if (checked) {
      setRemoveFileList([...removeFileList, name]);
    } else {
      setRemoveFileList(removeFileList.filter((item) => item !== name));
    }
  }

  //file 목록 작성
  const fileNameList = [];
  for (let addFile of addFileList) {
    // 이미 있는 파일과 중복된 파일명인지?
    let duplicate = false;
    for (let file of board.fileList) {
      if (file.name === addFile.name) {
        duplicate = true;
        break;
      }
    }
    fileNameList.push(
      <li>
        {addFile.name}
        {duplicate && (
          <Badge colorScheme="red">기존 이미지를 덮어씁니다.</Badge>
        )}
      </li>,
    );
  }

  if (board === null) {
    return <Spinner />;
  }

  return (
    <Center>
      <Box w={500}>
        <Box mb={10}>
          <Heading>게시물 수정</Heading>
        </Box>
        <Box>
          <Box mb={7}>
            <FormControl>
              <FormLabel>제목</FormLabel>
              <Input
                defaultValue={board.title}
                onChange={(e) => setBoard({ ...board, title: e.target.value })}
              />
            </FormControl>
          </Box>
          <Box mb={7}>
            <FormControl>
              <FormLabel>내용</FormLabel>
              <Textarea
                defaultValue={board.content}
                onChange={(e) =>
                  setBoard({ ...board, content: e.target.value })
                }
              />
            </FormControl>
          </Box>
          <Box mb={7}>
            {board.fileList &&
              board.fileList.map((file) => (
                <Card key={file.name} border={"2px solid black"} m={3}>
                  <CardBody>
                    <FontAwesomeIcon icon={faTrashCan} />
                    <Switch
                      onChange={(e) =>
                        handleRemoveSwitchChange(file.name, e.target.checked)
                      }
                    />
                    <Text>{file.name}</Text>
                  </CardBody>
                  <Image
                    sx={
                      removeFileList.includes(file.name)
                        ? { filter: "blur(8px)" }
                        : {}
                    }
                    src={file.src}
                  />
                </Card>
              ))}
          </Box>
          <Box mb={7}>
            <FormControl>
              <FormLabel>파일</FormLabel>
              <Input
                multiple
                type={"file"}
                accept={"image/*"}
                onChange={(e) => setAddFileList(e.target.files)}
              />
              <FormHelperText>
                총 용량은 10MB, 한 파일은 1MB를 초과할 수 없습니다.
              </FormHelperText>
            </FormControl>
          </Box>
          {fileNameList.length > 0 && (
            <Box mb={7}>
              <Card>
                <CardHeader>
                  <Heading size="md">선택된 파일 목록</Heading>
                </CardHeader>
                <CardBody>
                  <Stack divider={<StackDivider />} spacing={4}>
                    {fileNameList}
                  </Stack>
                </CardBody>
              </Card>
            </Box>
          )}
          <Box mb={7}>
            <FormControl>
              <FormLabel>작성자</FormLabel>
              <Input defaultValue={board.writer} readOnly />
            </FormControl>
          </Box>
          <Box mb={7}>
            <Button colorScheme={"blue"} onClick={onOpen}>
              저장
            </Button>
          </Box>
        </Box>
        <Modal isOpen={isOpen} onClose={onClose}>
          <ModalOverlay />
          <ModalContent>
            <ModalHeader>수정</ModalHeader>
            <ModalBody>수정한 내용을 저장하시겠습니까?</ModalBody>
            <ModalFooter>
              <Button mr={2} onClick={handleClickSave} colorScheme={"blue"}>
                수정
              </Button>
              <Button onClick={onClose}>취소</Button>
            </ModalFooter>
          </ModalContent>
        </Modal>
      </Box>
    </Center>
  );
}
