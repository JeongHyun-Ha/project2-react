import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => {
        setMember({ ...res.data, password: "" });
      })
      .catch((err) => {
        toast({
          status: "error",
          description: "존재하지 않는 회원입니다.",
          position: "top",
        });
        navigate("/");
      });
  }, []);

  function handleClickSave() {
    axios
      .put("/api/member/edit", member)
      .then((res) => {
        toast({
          status: "success",
          description: "수정이 완료되었습니다.",
          position: "top",
        });
      })
      .catch((err) => {});
  }

  if (member === null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box>회원 정보 수정</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input value={member.email} readOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>비밀번호</FormLabel>
            <Input
              placeholder={"암호를 변경하려면 입력하세요."}
              onChange={(e) =>
                setMember({ ...member, password: e.target.value })
              }
            />
            <FormHelperText>
              입력하지 않으면 기존 암호를 변경하지 않습니다.
            </FormHelperText>
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>비밀번호 확인</FormLabel>
            <Input />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>닉네임</FormLabel>
            <Input
              defaultValue={member.nickName}
              onChange={(e) =>
                setMember({ ...member, nickName: e.target.value })
              }
            />
          </FormControl>
        </Box>
        <Box>
          <Button colorScheme={"blue"} onClick={handleClickSave}>
            저장
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
