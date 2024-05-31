import { useNavigate } from "react-router-dom";
import { Box, Center, Flex, Hide, Show, Spacer } from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faHouse,
  faPencil,
  faRightFromBracket,
  faUsers,
} from "@fortawesome/free-solid-svg-icons";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  const centerStyle = {
    p: 5,
    fontSize: 20,
    fontWeight: 600,
    cursor: "pointer",
    _hover: {
      bgColor: "gray.300",
    },
  };

  return (
    <Flex px={{ lg: 200, base: 0 }} gap={3} height={16} bgColor={"gray.200"}>
      <Center {...centerStyle} onClick={() => navigate(`/`)}>
        <Hide below={"md"}>HOME</Hide>
        <Show below={"md"}>
          <FontAwesomeIcon icon={faHouse} />
        </Show>
      </Center>
      {account.isLoggedIn() && (
        <Center {...centerStyle} onClick={() => navigate("/write")}>
          <Hide below={"lg"}>글쓰기</Hide>
          <Show below={"lg"}>
            <FontAwesomeIcon icon={faPencil} />
          </Show>
        </Center>
      )}
      <Spacer />
      {account.isLoggedIn() && (
        <Center
          {...centerStyle}
          onClick={() => navigate(`/member/${account.id}`)}
        >
          <Flex gap={2}>
            <Box>
              <FontAwesomeIcon icon={faUser} />
            </Box>
            <Box>{account.nickName}</Box>
          </Flex>
        </Center>
      )}
      {account.isAdmin() && (
        <Center {...centerStyle} onClick={() => navigate("/member/list")}>
          <FontAwesomeIcon icon={faUsers} />
        </Center>
      )}
      {account.isLoggedIn() || (
        <Center {...centerStyle} onClick={() => navigate("/signup")}>
          회원가입
        </Center>
      )}
      {account.isLoggedIn() || (
        <Center {...centerStyle} onClick={() => navigate("/login")}>
          로그인
        </Center>
      )}
      {account.isLoggedIn() && (
        <Center
          {...centerStyle}
          onClick={() => {
            account.logout();
            navigate("/login");
          }}
        >
          <Hide below={"md"}>로그아웃</Hide>
          <Show below={"md"}>
            <FontAwesomeIcon icon={faRightFromBracket} />
          </Show>
        </Center>
      )}
    </Flex>
  );
}
