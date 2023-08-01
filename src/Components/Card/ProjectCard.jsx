import React, { useEffect, useState } from 'react';
import { Stack, Text, HStack, Spacer, Button, SimpleGrid, AvatarGroup, Avatar, useToast, Box } from '@chakra-ui/react';
import { FcPlus } from 'react-icons/fc';
import themeConfig from '../../Config/themeConfig';
import useUserStore from '../../Hooks/Zustand/Store';
import { getDataApi } from '../../Api/axiosWithNoBarier';
import _axios from '../../Api/AxiosBarrier';
import { IoNotificationsOutline } from 'react-icons/io5';
import { getSingleDocumentFirebase } from '../../Api/firebaseApi';

const ProjectCard = ({ projectData, handleOpenModalProject, handleOpenModaProjectTeam }) => {

  const globalState = useUserStore();

  const [topicsList, setTopicList] = useState([])

  const toast = useToast()

  const getNotifActive =  async () => {
        try {
      const result = await getSingleDocumentFirebase('users', globalState.uid)
      setTopicList(result.topics)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    getNotifActive()
  
    return () => {
    }
  }, [globalState.currentCompany])
  


  const handleNotif = async (projectId, bool) => {


    const data = {
      topic: `${globalState.currentCompany}-${projectId}`,
      user_id: globalState.uid,
      type: bool ? "subscribe" : "unsubscribe"
    }
    try {
      const response = await _axios.post('/notificationSubOrUnSub', data);
      if (response.status === true) {
        toast({
          title: "Deoapp.com",
          description: `success ${bool ? "subscribe" : "unsubscribe"} notification`,
          status: "success",
          position: "top-right",
          isClosable: true,
        });
      }
      getNotifActive()
      //         console.log(response);
    } catch (error) {
      console.log(error, 'ini error')
      toast({
        title: "Deoapp.com",
        description: error.message,
        status: "error",
        position: "top-right",
        isClosable: true,
      });
    }

  }


  return (
    <Stack p={[1, 1, 5]}>
      <HStack>
        <Text fontWeight={'bold'} fontSize='xl'>
          Projects
        </Text>
        <Spacer />


      </HStack>
      {projectData.length > 0 && (
        <SimpleGrid columns={[1, 2, 3]} gap={3}>
          {projectData.map((x, index) => {

              const isActive = topicsList.includes(`${globalState.currentCompany}-${x.id}`);

            return(
            <Stack key={index} p={4} bgColor={"white"} borderRadius={'lg'} shadow='md'>
              <HStack>
                <Text textTransform={'capitalize'} fontWeight={500}>
                  {x?.name}
                </Text>
                <Spacer />
                <Box bgColor={isActive ? "green.100" : "white"} onClick={ isActive ? () => handleNotif(x.id, false) : () => handleNotif(x.id, true)} p={1} borderRadius='full' borderWidth={1} cursor='pointer'>
                 <IoNotificationsOutline size={17}/>
                </Box>
              </HStack>
              <Text>Managers: {x?.managers?.length}</Text>
              <AvatarGroup size='sm' gap='1' max={4}>
                {x?.managers?.length > 0 &&
                  x?.managers.map((y, i) => {
                    const user = x.usersProjectData.find((userData) => userData.id === y);
                    return <Avatar key={i} name={user?.name} />;
                  })}
              </AvatarGroup>
              <Text>Users: {x?.usersProjectData?.length}</Text>
              <AvatarGroup size='sm' gap='1' max={4}>
                {x?.usersProjectData?.length > 0 &&
                  x?.usersProjectData.map((y, i) => <Avatar key={i} name={y?.name} />)}
              </AvatarGroup>
              <Button
                onClick={() => handleOpenModaProjectTeam(x)}
                shadow='md'
                variant='outline'
                borderColor='green.500'
                color='green.500'
                size={'sm'}
              >
                <HStack>
                  <Text>Lihat Team</Text>
                </HStack>
              </Button>
              <Button
                onClick={() => handleOpenModalProject(x)}
                shadow='md'
                variant='outline'
                borderColor='green.500'
                color='green.500'
                size={'sm'}
              >
                <HStack>
                  <FcPlus />
                  <Text>Users</Text>
                </HStack>
              </Button>
            </Stack>
          )})}
        </SimpleGrid>
      )}
    </Stack>
  );
};

export default ProjectCard;
