import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Input,
  Select,
  Table,
  Tbody,
  Td,
  Th,
  Thead,
  Tr,
} from "@chakra-ui/react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import {
  faAngleLeft,
  faAngleRight,
  faAnglesLeft,
  faAnglesRight,
  faImages,
  faMagnifyingGlass,
  faUser,
} from "@fortawesome/free-solid-svg-icons";
import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

export function BoardList() {
  const [boardList, setBoardList] = useState([]);
  const [pageInfo, setPageInfo] = useState({});
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [searchType, setSearchType] = useState("all");
  const [searchKeyword, setSearchKeyword] = useState();

  useEffect(() => {
    axios.get(`/api/board/list?${searchParams}`).then((res) => {
      setBoardList(res.data.boardList);
      setPageInfo(res.data.pageInfo);
    });
    setSearchType("all");
    setSearchKeyword("");

    const typeParam = searchParams.get("type");
    const keywordParam = searchParams.get("keyword");
    if (typeParam) {
      setSearchType(typeParam);
    }
    if (keywordParam) {
      setSearchKeyword(keywordParam);
    }
  }, [searchParams]);

  const handleNavPage = (page) => () => {
    searchParams.set("page", page);
    navigate(`/?${searchParams}`);
  };

  function handleSearchClick() {
    navigate(`/?type=${searchType}&keyword=${searchKeyword}`);
  }

  const pageNumbers = [];

  for (let i = pageInfo.leftPageNumber; i <= pageInfo.rightPageNumber; i++) {
    pageNumbers[i] = i;
  }

  return (
    <Box>
      <Box>게시물 목록</Box>
      <Box>
        {boardList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
        {boardList.length > 0 && (
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
                  <Td>
                    {board.title}
                    {board.numberOfImages && (
                      <Badge>
                        <FontAwesomeIcon icon={faImages} />
                        {board.numberOfImages}
                      </Badge>
                    )}
                  </Td>
                  <Td>{board.writer}</Td>
                  <Td>{board.inserted}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Box>
        <Center>
          <Flex>
            <Box>
              <Select
                value={searchType}
                onChange={(e) => setSearchType(e.target.value)}
              >
                <option value="all">전체</option>
                <option value="text">글</option>
                <option value="nickName">작성자</option>
              </Select>
            </Box>
            <Box>
              <Input
                value={searchKeyword}
                onChange={(e) => setSearchKeyword(e.target.value)}
                placeholder={"검색어"}
              />
            </Box>
            <Box>
              <Button onClick={handleSearchClick}>
                <FontAwesomeIcon icon={faMagnifyingGlass} />
              </Button>
            </Box>
          </Flex>
        </Center>
      </Box>
      <Center>
        {pageInfo.prevPageNumber && (
          <>
            <Button onClick={handleNavPage(1)}>
              <FontAwesomeIcon icon={faAnglesLeft} />
            </Button>
            <Button onClick={handleNavPage(pageInfo.prevPageNumber)}>
              <FontAwesomeIcon icon={faAngleLeft} />
            </Button>
          </>
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
          <>
            <Button onClick={handleNavPage(pageInfo.nextPageNumber)}>
              <FontAwesomeIcon icon={faAngleRight} />
            </Button>
            <Button onClick={handleNavPage(pageInfo.lastPageNumber)}>
              <FontAwesomeIcon icon={faAnglesRight} />
            </Button>
          </>
        )}
      </Center>
    </Box>
  );
}
