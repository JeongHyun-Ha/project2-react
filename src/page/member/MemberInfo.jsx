import {
  Box,
  Button,
  FormControl,
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
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useParams } from "react-router-dom";
import { LoginContext } from "../../component/LoginProvider.jsx";

export function MemberInfo() {
  const { id } = useParams();
  const [member, setMember] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const { isOpen, onClose, onOpen } = useDisclosure();
  const [password, setPassword] = useState("");
  const account = useContext(LoginContext);

  const toast = useToast();
  const navigate = useNavigate();

  useEffect(() => {
    axios
      .get(`/api/member/${id}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then((res) => setMember(res.data))
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "error",
            description: "존재하지 않는 게시물입니다.",
            position: "top",
          });
          navigate("/");
        } else if (err.response.status === 403) {
          toast({
            status: "warning",
            description: "접근 권한이 없습니다.",
            position: "top",
          });
          navigate(-1);
        }
      });
  }, []);

  function handleClickRemove() {
    setIsLoading(true);
    axios
      .delete(`/api/member/${id}`, {
        data: { id, password },
        headers: {
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
      })
      .then(() => {
        toast({
          status: "success",
          description: "회원 탈퇴하였습니다.",
          position: "top",
        });
        account.logout();
        navigate("/member/list");
      })
      .catch(() => {
        toast({
          status: "error",
          description: "회원 탈퇴 중 문제가 발생하였습니다.",
          position: "top",
        });
      })
      .finally(() => {
        setIsLoading(false);
        setPassword("");
        onClose();
      });
  }

  if (member == null) {
    return <Spinner />;
  }

  return (
    <Box>
      <Box>회원정보</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <Input value={member.email} isReadOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>닉네임</FormLabel>
            <Input value={member.nickName} isReadOnly />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>가입일시</FormLabel>
            <Input value={member.inserted} type={"datetime-local"} isReadOnly />
          </FormControl>
        </Box>
        <Box>
          <Button
            colorScheme={"blue"}
            onClick={() => navigate(`/member/edit/${member.id}`)}
          >
            회원정보 수정
          </Button>
          <Button colorScheme={"red"} onClick={onOpen}>
            회원 탈퇴
          </Button>
        </Box>
      </Box>
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>회원 탈퇴</ModalHeader>
          <ModalBody>
            <FormControl>
              <FormLabel>비밀번호</FormLabel>
              <Input
                onChange={(e) => setPassword(e.target.value)}
                value={password}
              />
            </FormControl>
            <Box>정말 탈퇴하시겠습니까?</Box>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme={"red"}
              onClick={handleClickRemove}
              isLoading={isLoading}
            >
              탈퇴
            </Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
