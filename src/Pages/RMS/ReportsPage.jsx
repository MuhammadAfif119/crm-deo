import { Grid, Heading, Stack } from "@chakra-ui/react";
import React from "react";
import ChartsPieOrder from "../../Components/Charts/ChartsPieOrder";
import ChartsLineOrder from "../../Components/Charts/ChartsLineOrder";
import BackButtons from "../../Components/Buttons/BackButtons";

const ReportsPage = () => {
  return (
    <>
      <BackButtons />
      <Stack p={5} bg={"white"} mt={5}>
        <Heading>Reports in this outlet</Heading>
        <Stack w="full">
          <Grid templateColumns={{ base: "1fr", md: "1fr 2fr" }} gap={3}>
            <Stack
              overflow={"auto"}
              spacing={2}
              borderTopWidth={3}
              borderBottomWidth={3}
              borderColor="green.500"
              py={4}
              px={2}
              borderRadius="md"
              shadow="md"
            >
              <ChartsPieOrder />
            </Stack>

            <Stack
              overflow={"auto"}
              spacing={2}
              borderTopWidth={3}
              borderBottomWidth={3}
              borderColor="green.500"
              py={4}
              px={2}
              borderRadius="md"
              shadow="md"
            >
              <ChartsLineOrder />
            </Stack>
          </Grid>
        </Stack>
      </Stack>
    </>
  );
};

export default ReportsPage;
