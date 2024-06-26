import {
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
  Input,
  Stack,
  StackDivider,
  Text,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [files, setFiles] = useState([]);
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const account = useContext(LoginContext);

  function handleSaveClick() {
    setLoading(true);
    axios
      .postForm("/api/board/add", { title, content, files })
      .then(() => {
        toast({
          status: "success",
          description: "새 글이 등록되었습니다.",
          position: "top",
        });
        navigate("/");
      })
      .catch((e) => {
        const code = e.response.status;

        if (code === 400) {
          toast({
            status: "error",
            description: "빈 칸을 입력해주세요.",
            position: "top",
          });
        }
      })
      .finally(() => setLoading(false));
  }

  let disableSaveBtn = false;
  if (title.trim().length === 0) {
    disableSaveBtn = true;
  }
  if (content.trim().length === 0) {
    disableSaveBtn = true;
  }

  //file 목록 작성
  const fileNameList = [];
  for (let i = 0; i < files.length; i++) {
    fileNameList.push(
      <Box>
        <Text fontSize={"md"}>{files[i].name}</Text>
      </Box>,
    );
  }

  return (
    <Center>
      <Box w={500}>
        <Box mb={10}>
          <Heading>게시글 작성</Heading>
        </Box>
        <Box>
          <Box mb={7}>
            <FormControl>
              <FormLabel>제목</FormLabel>
              <Input onChange={(e) => setTitle(e.target.value)} />
            </FormControl>
          </Box>
          <Box mb={7}>
            <FormControl>
              <FormLabel>본문</FormLabel>
              <Textarea onChange={(e) => setContent(e.target.value)} />
            </FormControl>
          </Box>
          <Box mb={7}>
            <FormControl>
              <FormLabel>파일</FormLabel>
              <Input
                multiple
                type={"file"}
                accept={"image/*"}
                onChange={(e) => setFiles(e.target.files)}
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
                  <Heading size={"md"}>선택된 파일 목록</Heading>
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
            <FormControl>작성자</FormControl>
            <Input readOnly value={account.nickName} />
          </Box>
          <Box mb={7}>
            <Button
              isLoading={loading}
              isDisabled={disableSaveBtn}
              colorScheme={"blue"}
              onClick={handleSaveClick}
            >
              저장
            </Button>
          </Box>
        </Box>
      </Box>
    </Center>
  );
}
