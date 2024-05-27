import {
  Box,
  Button,
  Flex,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    axios.get(`/api/board/list?${searchParams}`).then((res) => {
      setBoardList(res.data.boardList);
      setPageInfo(res.data.pageInfo);
    });
  }, [searchParams]);

  const handleNavPage = (page) => () => {
    navigate("/?page=" + page);
  };

  const pageNumbers = [];
  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers[i] = i;
  }

  return (
    <Box>
      <Box>게시물 목록</Box>
      <Box>
        <Table>
          <Thead>
            <Tr>
              <Th>#</Th>
              <Th>제목</Th>
              <Th>
                <FontAwesomeIcon icon={faUser} />
              </Th>
              <Th>작성 일시</Th>
            </Tr>
          </Thead>
          <Tbody>
            {boardList.map((board) => (
              <Tr
                key={board.id}
                onClick={() => navigate(`/board/${board.id}`)}
                cursor={"pointer"}
                _hover={{ bgColor: "gray.200" }}
              >
                <Td>{board.id}</Td>
                <Td>{board.title}</Td>
                <Td>{board.writer}</Td>
                <Td>{board.inserted}</Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>
      <Flex justifyContent={"center"}>
        {pageInfo.currentPageNumber > 1 && (
          <Button onClick={handleNavPage(1)}>맨 앞</Button>
        )}
        {pageInfo.prevPageNumber && (
          <Button onClick={handleNavPage(pageInfo.prevPageNumber)}>이전</Button>
        )}
        {pageNumbers.map((pageNumber) => (
          <Button
            onClick={handleNavPage(pageNumber)}
            key={pageNumber}
            colorScheme={
              pageNumber === pageInfo.currentPageNumber ? "blue" : "gray"
            }
          >
            {pageNumber}
          </Button>
        ))}
        {pageInfo.nextPageNumber && (
          <Button onClick={handleNavPage(pageInfo.nextPageNumber)}>다음</Button>
        )}
        {pageInfo.currentPageNumber !== pageInfo.lastPageNumber && (
          <Button onClick={handleNavPage(pageInfo.lastPageNumber)}>
            맨 끝
          </Button>
        )}
      </Flex>
    </Box>
  );
}
