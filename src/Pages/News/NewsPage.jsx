import {
  Box,
  Button,
  Container,
  Stack,
  InputGroup,
  InputLeftElement,
  Icon,
  HStack,
  Text,
  ButtonGroup,
  Input,
  useBreakpointValue,
} from "@chakra-ui/react";
import { FiSearch } from "react-icons/fi";
import React, { useEffect, useState } from "react";
import { getCollectionWhereFirebase } from "../../Api/firebaseApi";
// import { useGlobalState } from '../../Hooks/Contexts';
// import BreadCrumbComponent from '../../Components/BreadCrumbs/BreadCrumbComponent';
import { useNavigate } from "react-router-dom";
import { NewsTableComponent } from "../../Components/Table/OffersTable";
import useUserStore from "../../Hooks/Zustand/Store";
import AddButtons from "../../Components/Buttons/AddButtons";

// import { NewsTable } from '../Offers/OffersTable';

const NewsPage = () => {
  const [news, setNews] = useState([]);

  const globalState = useUserStore();

  const projectId = globalState.currentProject;

  const navigate = useNavigate();
  const breadcrumbData = [
    { title: "Home", link: "/" },
    { title: "News", link: "/news" },
  ];

  const getNews = async () => {
    const result = await getCollectionWhereFirebase(
      "news",
      "projectsId",
      "==",
      projectId
    );
    if (result) {
      setNews(result);
      console.log(result);
    }
  };

  useEffect(() => {
    getNews();
  }, [projectId]);

  return (
    <Box p={[1, 1, 5]}>
      <AddButtons type={"News"} link={"/news/create"} />
      {/* <BreadCrumbComponent data={breadcrumbData} /> */}

      <NewsComponent news={news} getNews={getNews} />
    </Box>
  );
};

const NewsComponent = (props) => {
  const { news, getNews } = props;
  const isMobile = useBreakpointValue({
    base: true,
    md: false,
  });
  return (
    <Container
      py={{
        base: "2",
        md: "2",
      }}
      maxW="7xl"
    >
      <Box
        bg="bg-surface"
        boxShadow={{
          base: "none",
          md: "sm",
        }}
        borderRadius={{
          base: "none",
          md: "lg",
        }}
      >
        <Stack spacing="5">
          <Box
            px={{
              base: "4",
              md: "0",
            }}
            pt="2"
          >
            <Stack
              direction={{
                base: "column",
                md: "row",
              }}
              justify="space-between"
            >
              <InputGroup maxW="xs">
                <InputLeftElement pointerEvents="none">
                  <Icon as={FiSearch} color="muted" boxSize="5" />
                </InputLeftElement>
                <Input placeholder="Search" />
              </InputGroup>
            </Stack>
          </Box>
          <Box overflowX="auto">
            <NewsTableComponent data={news ? news : null} getNews={getNews} />
          </Box>
          <Box
            px={{
              base: "4",
              md: "6",
            }}
            pb="5"
          >
            <HStack spacing="3" justify="space-between">
              {!isMobile && (
                <Text color="muted" fontSize="sm">
                  Showing 1 to 5 of 42 results
                </Text>
              )}
              <ButtonGroup
                spacing="3"
                justifyContent="space-between"
                width={{
                  base: "full",
                  md: "auto",
                }}
                variant="secondary"
              >
                <Button>Previous</Button>
                <Button>Next</Button>
              </ButtonGroup>
            </HStack>
          </Box>
        </Stack>
      </Box>
    </Container>
  );
};

export default NewsPage;
