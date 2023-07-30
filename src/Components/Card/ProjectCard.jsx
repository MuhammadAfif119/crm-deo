import React from 'react';
import { Stack, Text, HStack, Spacer, Button, SimpleGrid, AvatarGroup, Avatar } from '@chakra-ui/react';
import { FcPlus } from 'react-icons/fc';
import themeConfig from '../../Config/themeConfig';

const ProjectCard = ({ projectData, handleOpenModalProject, handleOpenModaProjectTeam }) => {
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
          {projectData.map((x, index) => (
            <Stack key={index}  p={4} bgColor={"white"} borderRadius={'lg'} shadow='md'>
              <Text textTransform={'capitalize'} fontWeight={500}>
                {x?.name}
              </Text>
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
          ))}
        </SimpleGrid>
      )}
    </Stack>
  );
};

export default ProjectCard;
