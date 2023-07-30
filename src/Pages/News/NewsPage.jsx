import {
    Box, 
    Button, 
    Flex, 
    Heading, 
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
    Spacer,
} from '@chakra-ui/react'
import { FiSearch } from 'react-icons/fi'
import React, { useEffect, useState } from 'react'
import { getCollectionWhereFirebase } from '../../Api/firebaseApi';
// import { useGlobalState } from '../../Hooks/Contexts';
// import BreadCrumbComponent from '../../Components/BreadCrumbs/BreadCrumbComponent';
import { useNavigate } from 'react-router-dom';
import { NewsTableComponent } from '../../Components/Table/OffersTable';
import useUserStore from "../../Hooks/Zustand/Store";
import { FcPlus } from 'react-icons/fc';

// import { NewsTable } from '../Offers/OffersTable';

const NewsPage = () => {
    const [news, setNews] = useState([]);

    const globalState = useUserStore();

    const projectId = globalState.currentProject


    const navigate = useNavigate();
    const breadcrumbData = [
        { title: 'Home', link: '/' },
        { title: 'News', link: '/news' },
    ];

    const getNews = async () => {
        const result = await getCollectionWhereFirebase('news', 'projectsId', '==', projectId);
        if (result) {
            setNews(result)
        };
    };

    useEffect(() => {
        getNews();
    }, [projectId]);


    return (
        <>
            <HStack
                p={[1, 1, 5]}
            >
                <Heading size='md'>News</Heading>
                <Spacer />
                <Button onClick={() => navigate('/news/create')} bgColor={'white'} shadow='md' variant='outline' borderColor='#F05A28' color='#F05A28'>
                    <HStack>
                        <FcPlus />
                        <Text>News</Text>
                    </HStack>
                </Button>
            </HStack>
          
            {/* <BreadCrumbComponent data={breadcrumbData} /> */}

           <NewsComponent news={news} getNews={getNews}/>
        </>
    )
}


const NewsComponent = (props) => {
    const { news, getNews } = props;
    const isMobile = useBreakpointValue({
        base: true,
        md: false,
    })
    return (

        <Container
            py={{
                base: '2',
                md: '2',
            }}
            maxW='7xl'
        >
            <Box
                bg="bg-surface"
                boxShadow={{
                    base: 'none',
                    md: 'sm',
                }}
                borderRadius={{
                    base: 'none',
                    md: 'lg',
                }}
            >
                <Stack spacing="5">
                    <Box
                        px={{
                            base: '4',
                            md: '0',
                        }}
                        pt="2"
                    >
                        <Stack
                            direction={{
                                base: 'column',
                                md: 'row',
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
                            base: '4',
                            md: '6',
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
                                    base: 'full',
                                    md: 'auto',
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
        </Container >
    )
}

export default NewsPage
