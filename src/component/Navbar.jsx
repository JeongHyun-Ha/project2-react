import { useNavigate } from "react-router-dom";
import { Center, Flex, Spacer } from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
        HOME
      </Center>
      {account.isLoggedIn() && (
        <Center {...centerStyle} onClick={() => navigate("/write")}>
          글쓰기
        </Center>
      )}
      <Spacer />
      {account.isLoggedIn() && (
        <Center
          {...centerStyle}
          onClick={() => navigate(`/member/${account.id}`)}
        >
          <FontAwesomeIcon icon={faUser} />
          {account.nickName}
        </Center>
      )}
      {account.isAdmin() && (
        <Center {...centerStyle} onClick={() => navigate("/member/list")}>
          회원목록
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
          로그아웃
        </Center>
      )}
    </Flex>
  );
}
