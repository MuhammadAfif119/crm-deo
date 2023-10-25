import React from 'react';
import {
  Box,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Avatar,
  useColorModeValue,
} from '@chakra-ui/react';

const userList = [
  { id: 1, name: 'Alice Johnson', avatar: 'https://via.placeholder.com/50', role: 'Admin', status: 'Active' },
  { id: 2, name: 'Bob Smith', avatar: 'https://via.placeholder.com/50', role: 'User', status: 'Inactive' },
  // Tambahkan pengguna lainnya di sini
];

function UserList() {
  return (
    <>
    <Box p={4}>
      <Text fontSize="2xl" fontWeight="bold" mb={4}>
        User List
      </Text>
      <Table variant="striped">
        <Thead>
          <Tr>
            <Th>Avatar</Th>
            <Th>Name</Th>
            <Th>Role</Th>
            <Th>Status</Th>
          </Tr>
        </Thead>
        <Tbody>
          {userList.map((user) => (
            <Tr key={user.id}>
              <Td>
                <Avatar src={user.avatar} alt={user.name} size="md" />
              </Td>
              <Td>{user.name}</Td>
              <Td>{user.role}</Td>
              <Td>{user.status}</Td>
            </Tr>
          ))}
        </Tbody>
      </Table>
    </Box>
    </>
  );
}

export default UserList;
