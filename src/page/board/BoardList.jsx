import { Box, Table, Tbody, Td, Th, Thead, Tr } from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUser } from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  useEffect(() => {
    axios
      .get(`/api/board/list?${searchParams}`)
      .then((res) => setBoardList(res.data));
  }, []);

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
    </Box>
  );
}
