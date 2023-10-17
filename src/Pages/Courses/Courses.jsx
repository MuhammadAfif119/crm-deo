import {
  Heading,
  Input,
  InputGroup,
  InputLeftElement,
  Select,
  Box,
  Button,
  Container,
  Stack,
  useBreakpointValue,
} from "@chakra-ui/react";
import React, { useEffect, useState } from "react";
import BreadCrumbComponent from "../../Components/BreadCrumbs/BreadCrumbComponent";
import { FiPlus, FiSearch } from "react-icons/fi";
import BasicCardComponent from "../../Components/Card/BasicCardComponent";
import { useNavigate } from "react-router-dom";
import {
  getCollectionFirebase,
  getCollectionFirebaseV2,
} from "../../Api/firebaseApi";
import useUserStore from "../../Hooks/Zustand/Store";
import { param } from "jquery";
import {
  collection,
  limit,
  onSnapshot,
  orderBy,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../Config/firebase";

const Courses = () => {
  const [datas, setDatas] = useState([]);
  const [update, setUpdate] = useState(false);
  const globalState = useUserStore();
  const { currentProject } = globalState;
  const [last, setLast] = useState();
  const [dataLimit, setDataLimit] = useState(10);

  const data = [
    { title: "Home", link: "/" },
    { title: "Courses", link: "/courses" },
  ];

  const navigate = useNavigate();

  const getData = async () => {
    // const conditions = [
    //   { field: "projectsId", operator: "==", value: currentProject },
    // ];
    // const sortBy = { field: "createdAt", direction: "asc" };
    // const limitValue = 5;

    // try {
    //   const res = await getCollectionFirebase(
    //     "courses",
    //     conditions,
    //     sortBy,
    //     limitValue
    //   );
    //   setDatas(res);

    //   const lastVisible = res[res?.length - 1]?.createdAt;
    //   setLast(lastVisible);
    // } catch (error) {
    //   console.log(error, "ini error");
    // }

    const q = query(
      collection(db, "courses"),
      where("projectsId", "==", globalState?.currentProject),
      orderBy("createdAt", "asc"),
      limit(5)
    );
    const unsubscribe = onSnapshot(q, (querySnapshot) => {
      const courseArr = [];
      querySnapshot.forEach((doc) => {
        courseArr.push({ ...doc.data(), id: doc.id });
      });
      setDatas(courseArr);

      const lastVisible = courseArr[courseArr?.length - 1]?.createdAt;
      setLast(lastVisible);
    });
  };

  const fetchNext = async () => {
    const conditions = [
      { field: "projectsId", operator: "==", value: currentProject },
    ];
    const sortBy = { field: "createdAt", direction: "asc" };
    const limitValue = 10;

    try {
      const nextData = await getCollectionFirebaseV2(
        "courses",
        { conditions },
        { sortBy },
        { limitValue },
        { startAfterData: last }
      );
      setDatas([...datas, ...nextData]);
      const lastVisible = nextData[nextData?.length - 1]?.createdAt;
      setLast(lastVisible);
    } catch (error) {
      console.log(error);
    }
  };

  const handleNavigation = (item) => {
    navigate(`/courses/${item.id}`);
  };

  useEffect(() => {
    getData();
  }, [currentProject]);

  return (
    <>
      <Heading>Courses</Heading>
      <BreadCrumbComponent data={data} />
      <Container
        py={{
          base: "4",
          md: "8",
        }}
        px={{
          base: "0",
          md: 8,
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
                md: "6",
              }}
              pt="5"
            >
              <Stack
                direction={{
                  base: "column",
                  md: "row",
                }}
                justify="space-between"
              >
                {/* <InputGroup w="fit-content">
									<InputLeftElement
										pointerEvents="none"
										children={
											<FiSearch color="gray.300" />
										}
									/>
									<Input
										type="search-course"
										placeholder="Search"
									/>
								</InputGroup>
								<Select w="fit-content">
									{course?.map((item, id) => (
										<option key={id}>
											{item.title}
										</option>
									))}
								</Select>
								<Select w="fit-content">
									{category?.map((item, id) => (
										<option key={id}>
											{item.title}
										</option>
									))}
								</Select>
								<Select w="fit-content">
									{author?.map((item, id) => (
										<option key={id}>
											{item.title}
										</option>
									))}
								</Select> */}
                <Button
                  leftIcon={<FiPlus />}
                  colorScheme="green"
                  onClick={() => navigate("/courses/create")}
                >
                  Add Course
                </Button>
              </Stack>
            </Box>
            <Box>
              {datas?.map((item, i) => (
                <BasicCardComponent
                  key={i}
                  data={item}
                  update={update}
                  setUpdate={setUpdate}
                  getData={getData}
                  setDatas={setDatas}
                  datas={datas}
                  navigation={() => handleNavigation(item)}
                />
              ))}
            </Box>
            <Box
              px={{
                base: "4",
                md: "6",
              }}
              pb="5"
            >
              {/* <HStack spacing="3" justify="space-between">
								{!isMobile && (
									<Text color="muted" fontSize="sm">
										Showing 0 of {datas?.length} results
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
							</HStack> */}
              {datas?.length < 5 ? null : (
                // <Button onClick={fetchNext}>Next</Button>
                <Box align={"center"}>
                  <Button colorScheme={"blue"} onClick={fetchNext}>
                    Next
                  </Button>
                </Box>
              )}
            </Box>
          </Stack>
        </Box>
      </Container>
    </>
  );
};

export default Courses;
