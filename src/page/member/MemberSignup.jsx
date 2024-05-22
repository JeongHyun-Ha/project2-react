import {
  Box,
  Button,
  FormControl,
  FormHelperText,
  FormLabel,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
} from "@chakra-ui/react";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export function MemberSignup() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [passwordCheck, setPasswordCheck] = useState("");
  const [nickName, setNickName] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isCheckedEmail, setIsCheckedEmail] = useState(false);
  const [isCheckNick, setIsCheckNick] = useState(false);
  const toast = useToast();
  const navigate = useNavigate();

  function handleClick() {
    setIsLoading(true);
    axios
      .post("/api/member/signup", { email, password, nickName })
      .then((res) => {
        toast({
          status: "success",
          description: "회원가입이 완료되었습니다.",
          position: "top",
        });
        // todo : 로그인화면으로 이동
        navigate("/");
      })
      .catch((err) => {
        if (err.response.status === 400) {
          toast({
            status: "error",
            description: "입력값을 확인해주세요.",
            position: "top",
          });
        } else {
          toast({
            status: "error",
            description: "회원 가입 중 문제가 발생하였습니다.",
            position: "top",
          });
        }
      })
      .finally(() => setIsLoading(false));
  }

  function handleCheckEmail() {
    axios
      .get(`/api/member/check?email=${email}`)
      .then((res) => {
        toast({
          status: "warning",
          description: "사용할 수 없는 이메일입니다.",
          position: "top",
        });
      })
      .catch((err) => {
        if (err.response.status === 404) {
          toast({
            status: "info",
            description: "사용할 수 있는 이메일입니다.",
            position: "top",
          });
        }
        setIsCheckedEmail(true);
      })
      .finally();
  }

  function handleCheckNick() {
    axios
      .get(`/api/member/check?nickName=${nickName}`)
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
        setIsCheckNick(true);
      })
      .finally();
  }

  const isCheckedPwd = password === passwordCheck;

  let isDisabled = false;

  if (!isCheckedPwd) {
    isDisabled = true;
  }

  if (
    !(
      email.trim().length > 0 &&
      password.trim().length > 0 &&
      nickName.trim().length > 0
    )
  ) {
    isDisabled = true;
  }

  if (!isCheckedEmail) {
    isDisabled = true;
  }
  if (!isCheckNick) {
    isDisabled = true;
  }

  return (
    <Box>
      <Box>회원 가입</Box>
      <Box>
        <Box>
          <FormControl>
            <FormLabel>이메일</FormLabel>
            <InputGroup>
              <Input
                onChange={(e) => {
                  setEmail(e.target.value);
                  setIsCheckedEmail(false);
                }}
              />
              <InputRightElement w={"75px"} mr={1}>
                <Button
                  size={"sm"}
                  bgColor={"gray.300"}
                  onClick={handleCheckEmail}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>비밀번호</FormLabel>
            <Input onChange={(e) => setPassword(e.target.value)} />
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>비밀번호 확인</FormLabel>
            <Input onChange={(e) => setPasswordCheck(e.target.value)} />
            {isCheckedPwd || (
              <FormHelperText color={"red"}>
                비밀번호와 비밀번호 확인이 일치하지 않습니다.
              </FormHelperText>
            )}
          </FormControl>
        </Box>
        <Box>
          <FormControl>
            <FormLabel>닉네임</FormLabel>
            <InputGroup>
              <Input
                onChange={(e) => {
                  setNickName(e.target.value);
                  setIsCheckNick(false);
                }}
              />
              <InputRightElement w={"75px"} mr={1}>
                <Button
                  size={"sm"}
                  bgColor={"gray.300"}
                  onClick={handleCheckNick}
                >
                  중복확인
                </Button>
              </InputRightElement>
            </InputGroup>
          </FormControl>
        </Box>
        <Box>
          <Button
            isDisabled={isDisabled}
            isLoading={isLoading}
            ding
            colorScheme={"blue"}
            onClick={handleClick}
          >
            가입
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
