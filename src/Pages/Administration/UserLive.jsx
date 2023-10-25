import React from 'react';
import {
  Box,
  Text,
  Flex,
  Avatar,
  SimpleGrid,
  useColorModeValue,
} from '@chakra-ui/react';

const activeUsers = [
  { id: 1, name: 'John Doe', avatar: 'https://via.placeholder.com/50' },
  { id: 2, name: 'Jane Smith', avatar: 'https://via.placeholder.com/50' },
  // Tambahkan pengguna aktif lainnya di sini
];

function UserLive() {
  return (
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        User Live
      </Text>
      <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
        {activeUsers.map((user) => (
          <UserCard key={user.id} user={user} />
        ))}
      </SimpleGrid>
    </Box>
  );
}

function UserCard({ user }) {
  return (
    <Flex
      bg={useColorModeValue('white', 'gray.700')}
      p={4}
      borderRadius="md"
      boxShadow="md"
    >
      <Avatar src={user.avatar} alt={user.name} size="md" />
      <Box ml={3}>
        <Text fontSize="lg" fontWeight="bold">
          {user.name}
        </Text>
        <Text color="gray.500">Active</Text>
      </Box>
    </Flex>
  );
}

export default UserLive;
