import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
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

export function MemberEdit() {
  const [member, setMember] = useState(null);
  const [oldPassword, setOldPassword] = useState("");
  const [oldNickName, setOldNickName] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [isCheckedNick, setIsCheckedNick] = useState(true);
  const { id } = useParams();
  const toast = useToast();
  const navigate = useNavigate();
  const { isOpen, onClose, onOpen } = useDisclosure();
  const account = useContext(LoginContext);

  useEffect(() => {
    axios
      .get(`/api/member/${id}`)
      .then((res) => {
        const member1 = res.data;
        setMember({ ...member1, password: "" });
        setOldNickName(member1.nickName);
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
      .then((res) => {
        account.login(res.data.token);
        toast({
          status: "success",
          description: "회원 정보가 수정되었습니다.",
          position: "top",
        });
        navigate(`/member/${id}`);
      })
      .catch(() => {
        toast({
          status: "error",
          description: "회원 정보가 수정되지 않았습니다.",
          position: "top",
        });
      })
      .finally(() => {
        onClose();
        setOldPassword("");
      });
  }

  function handleCheckNickName() {
    axios
      .get(`/api/member/check?nickName=${member.nickName}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 닉네임입니다.",
          position: "top",
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "사용할 수 있는 닉네임입니다.",
            position: "top",
          });
        }
        setIsCheckedNick(true);
      })
      .finally();
  }

  if (member === null) {
    return <Spinner />;
  }

  let isDisableNickCheckBtn = false;
  if (member.nickName === oldNickName) {
    isDisableNickCheckBtn = true;
  }
  if (member.nickName.length === 0) {
    isDisableNickCheckBtn = true;
  }

  if (isCheckedNick) {
    isDisableNickCheckBtn = true;
  }

  let isDisableSaveBtn = false;
  if (member.password !== passwordCheck) {
    isDisableSaveBtn = true;
  }
  if (member.nickName.trim().length === 0) {
    isDisableSaveBtn = true;
  }

  if (!isCheckedNick) {
    isDisableSaveBtn = true;
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
          <InputGroup>
            <Input
              onChange={(e) => {
                const newNickName = e.target.value.trim();
                setMember({ ...member, nickName: newNickName });
                setIsCheckedNick(newNickName === member.nickName);
              }}
              value={member.nickName}
            />
            <InputRightElement w={"75px"} mr={1}>
              <Button
                size={"sm"}
                bgColor={"gray.300"}
                onClick={handleCheckNickName}
                isDisabled={isDisableNickCheckBtn}
              >
                중복확인
              </Button>
            </InputRightElement>
          </InputGroup>
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
            <Button onClick={handleClickSave} colorScheme={"blue"}>
              확인
            </Button>
            <Button onClick={onClose}>취소</Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  );
}
