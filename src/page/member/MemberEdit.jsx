import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  Modal,
  ModalBody,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
  Spinner,
  useDisclosure,
  useToast,
} from "@chakra-ui/react";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState(false);
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => {
        const member1 = res.data;
        setMember({ ...member1, password: "" });
      })
      .catch(() => {
        toast({
          status: "warning",
          description: "회원 정보 조회 중 문제가 발생하였습니다.",
          position: "top",
        });
        navigate("/");
      });
  }, []);

  function handleClickSave() {
    axios
      .put("/api/member/edit", { ...member, oldPassword })
      .then((res) => {})
      .catch(() => {})
      .finally(() => {});
  }

  let isDisableSaveBtn = false;

  if (member !== null) {
    if (member.password !== passwordCheck) {
      isDisableSaveBtn = true;
    }
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
            <Input readOnly value={member.email} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>비밀번호</FormLabel>
            <Input
              onChange={(e) =>
                setMember({ ...member, password: e.target.value })
              }
              placeholder={"비밀번호를 변경하려면 입력하세요"}
            />
            <FormHelperText>
              입력하지 않으면 기존 비밀번호를 변경하지 않습니다.
            </FormHelperText>
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>비밀번호 확인</FormLabel>
            <Input onChange={(e) => setPasswordCheck(e.target.value)} />
            {member.password === passwordCheck || (
              <FormHelperText>비밀번호가 일치하지 않습니다.</FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl>닉네임</FormControl>
          <Input
            onChange={(e) => {
              setMember({ ...member, nickName: e.target.value });
            }}
            value={member.nickName}
          />
        </Box>
        <Box>
          <Button
            onClick={onOpen}
            colorScheme={"blue"}
            isDisabled={isDisableSaveBtn}
          >
            저장
          </Button>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>기존 비밀번호 확인</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>기존 비밀번호</FormLabel>
              <Input onChange={(e) => setOldPassword(e.target.value)} />
            </FormControl>
          </ModalBody>
          <ModalFooter>
            <Button onClick={onClose}>취소</Button>
            <Button onClick={handleClickSave} colorScheme={"blue"}>
              확인
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
