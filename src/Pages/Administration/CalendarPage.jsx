import React, { useState } from "react";
import moment from "moment"; // Import moment library
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Grid,
  GridItem,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(moment());

  const daysInMonth = () => {
    const firstDay = moment(currentMonth).startOf("month");
    const lastDay = moment(currentMonth).endOf("month");

    const days = [];

    const startOffset = (firstDay.day() + 7) % 7;

    for (let i = 0; i < startOffset; i++) {
      days.push(null);
    }

    for (let day = moment(firstDay); day.isSameOrBefore(lastDay); day.add(1, 'day')) {
      days.push(day.format("YYYY-MM-DD"));
    }

    console.log(days);
    return days;
  };

  const prevMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, 'month'));
  };

  const nextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, 'month'));
  };

  console.log(currentMonth);
  
  return (
    <Box p={4}>
      <Flex align="center" justify="space-between" mb={4}>
        <IconButton icon={<ChevronLeftIcon />} onClick={prevMonth} />
        <Text fontSize="xl" fontWeight="bold">
          {currentMonth.format("MMMM YYYY")}
        </Text>
        <IconButton icon={<ChevronRightIcon />} onClick={nextMonth} />
      </Flex>
      <Grid templateColumns="repeat(7, 1fr)">
        {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
          <Box border={"1px solid"} key={day}>
            <GridItem textAlign="center" fontWeight="bold">
              {day}
            </GridItem>
          </Box>
        ))}
        {daysInMonth().map((day, index) => (
          <Box border={"1px solid"} key={index}>
            <GridItem textAlign="center" p={"25%"} gap={0.5}>
              {day && (
                <Text
                  variant="outline"
                  size="sm"
                  colorScheme={
                    moment(day, "DD/MM/YYYY").month() === currentMonth.month() ? "teal" : "gray"
                  }
                >
                  {moment(day, "DD/MM/YYYY").date()}
                </Text>
              )}
            </GridItem>
          </Box>
        ))}
      </Grid>
    </Box>
  );
};

export default Calendar;
