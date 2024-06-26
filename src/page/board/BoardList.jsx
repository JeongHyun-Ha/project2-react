import {
  Badge,
  Box,
  Button,
  Center,
  Flex,
  Heading,
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
  faComments,
  faHeart,
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
      <Box mb={10}>
        <Heading>게시물 목록</Heading>
      </Box>
      <Box mb={10}>
        {boardList.length === 0 && <Center>조회 결과가 없습니다.</Center>}
        {boardList.length > 0 && (
          <Table>
            <Thead>
              <Tr>
                <Th w={10}>#</Th>
                <Th>제목</Th>
                <Th w={10}>
                  <FontAwesomeIcon icon={faHeart} />
                </Th>
                <Th w={40}>
                  <FontAwesomeIcon icon={faUser} />
                </Th>
                <Th w={60}>작성 일시</Th>
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
                    {board.numberOfImages > 0 && (
                      <Badge ml={2}>
                        <Flex gap={2}>
                          <Box>
                            <FontAwesomeIcon icon={faImages} />
                          </Box>
                          <Box>{board.numberOfImages}</Box>
                        </Flex>
                      </Badge>
                    )}
                    {board.numberOfComments > 0 && (
                      <Badge ml={2}>
                        <Flex gap={2}>
                          <Box>
                            <FontAwesomeIcon icon={faComments} />
                          </Box>
                          <Box>{board.numberOfComments}</Box>
                        </Flex>
                      </Badge>
                    )}
                  </Td>
                  <Td>{board.numberOfLike}</Td>
                  <Td>{board.writer}</Td>
                  <Td>{board.inserted}</Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>
      <Box mb={10}>
        <Center>
          <Flex gap={1}>
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
      <Center mb={10}>
        <Flex gap={1}>
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
        </Flex>
      </Center>
    </Box>
  );
}
