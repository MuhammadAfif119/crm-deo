import React from "react";
import {
  Stack,
  Text,
  HStack,
  Spacer,
  Button,
  SimpleGrid,
  AvatarGroup,
  Avatar,
} from "@chakra-ui/react";
import { FcPlus } from "react-icons/fc";
import themeConfig from "../../Config/themeConfig";

const CompanyCard = ({
  companyData,
  handleOpenModalCompany,
  handleOpenModalCompanyTeam,
}) => {
  return (
    <Stack p={[1, 1, 5]}>
      <HStack>
        <Text fontWeight={"bold"} fontSize="xl">
          Company
        </Text>
        <Spacer />
      </HStack>
      {companyData?.length > 0 && (
        <SimpleGrid columns={[1, 2, 3]} gap={3}>
          {companyData?.map((x, index) => (
            <Stack
              key={index}
              p={4}
              borderRadius={"lg"}
              shadow="md"
              bgColor={"white"}
            >
              <Text textTransform={"capitalize"} fontWeight={500}>
                {x?.name}
              </Text>
              <Text>Owners: {x?.owner?.length}</Text>
              <AvatarGroup size="sm" gap="1" max={4}>
                {x?.owner?.length > 0 &&
                  x?.owner.map((y, i) => {
                    // const user = x.usersProjectData.find((userData) => userData.id === y);
                    return <Avatar key={i} name={y} />;
                  })}
              </AvatarGroup>
              <Text>Users: {x?.users?.length}</Text>
              <AvatarGroup size="sm" gap="1" max={4}>
                {x?.users?.length > 0 &&
                  x?.users.map((y, i) => <Avatar key={i} name={y} />)}
              </AvatarGroup>
              <Button
                onClick={() => handleOpenModalCompanyTeam(x)}
                shadow="md"
                variant="outline"
                borderColor="green.500"
                color="green.500"
                size={"sm"}
              >
                <HStack>
                  <Text>Lihat Team</Text>
                </HStack>
              </Button>
              <Button
                onClick={() => handleOpenModalCompany(x)}
                shadow="md"
                variant="outline"
                borderColor="green.500"
                color="green.500"
                size={"sm"}
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

export default CompanyCard;
