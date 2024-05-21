import {
  Box,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
} from "@chakra-ui/react";
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function BoardWrite() {
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [writer, setWriter] = useState("");
  const toast = useToast();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);

  function handleSaveClick() {
    setLoading(true);
    axios
      .post("/api/board/add", { title, content, writer })
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
  if (writer.trim().length === 0) {
    disableSaveBtn = true;
  }
  return (
    <Box>
      <Box>글 작성 화면</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>제목</FormLabel>
            <Input onChange={(e) => setTitle(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>본문</FormLabel>
            <Textarea onChange={(e) => setContent(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>작성자</FormControl>
          <Input onChange={(e) => setWriter(e.target.value)} />
        </Box>
        <Box>
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
  );
}
