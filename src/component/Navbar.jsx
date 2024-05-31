import { useNavigate } from "react-router-dom";
import { Center, Flex, Spacer } from "@chakra-ui/react";
import React, { useContext } from "react";
import { LoginContext } from "./LoginProvider.jsx";
import { faUser } from "@fortawesome/free-regular-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

export function Navbar() {
  const navigate = useNavigate();
  const account = useContext(LoginContext);

  return (
    <Flex px={{ lg: 200, base: 0 }} gap={3} height={16} bgColor={"gray.200"}>
      <Center
        p={5}
        fontSize={20}
        fontWeight={600}
        onClick={() => navigate(`/`)}
        cursor={"pointer"}
        _hover={{
          bgColor: "gray.300",
        }}
      >
        HOME
      </Center>
      {account.isLoggedIn() && (
        <Center
          p={5}
          fontSize={20}
          fontWeight={600}
          onClick={() => navigate("/write")}
          cursor={"pointer"}
          _hover={{
            bgColor: "gray.300",
          }}
        >
          글쓰기
        </Center>
      )}
      <Spacer />
      {account.isLoggedIn() && (
        <Center
          p={5}
          fontSize={20}
          fontWeight={600}
          onClick={() => navigate(`/member/${account.id}`)}
          cursor={"pointer"}
          _hover={{
            bgColor: "gray.300",
          }}
        >
          <FontAwesomeIcon icon={faUser} />
          {account.nickName}
        </Center>
      )}
      {account.isAdmin() && (
        <Center
          p={5}
          fontSize={20}
          fontWeight={600}
          onClick={() => navigate("/member/list")}
          cursor={"pointer"}
          _hover={{
            bgColor: "gray.300",
          }}
        >
          회원목록
        </Center>
      )}
      {account.isLoggedIn() || (
        <Center
          p={5}
          fontSize={20}
          fontWeight={600}
          onClick={() => navigate("/signup")}
          cursor={"pointer"}
          _hover={{
            bgColor: "gray.300",
          }}
        >
          회원가입
        </Center>
      )}
      {account.isLoggedIn() || (
        <Center
          p={5}
          fontSize={20}
          fontWeight={600}
          onClick={() => navigate("/login")}
          cursor={"pointer"}
          _hover={{
            bgColor: "gray.300",
          }}
        >
          로그인
        </Center>
      )}
      {account.isLoggedIn() && (
        <Center
          p={5}
          fontSize={20}
          fontWeight={600}
          onClick={() => {
            account.logout();
            navigate("/login");
          }}
          cursor={"pointer"}
          _hover={{
            bgColor: "gray.300",
          }}
        >
          로그아웃
        </Center>
      )}
    </Flex>
  );
}
