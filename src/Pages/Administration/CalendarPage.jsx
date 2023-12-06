import React, { useEffect, useState } from "react";
import moment from "moment"; // Import moment library
import {
  Box,
  Flex,
  Text,
  IconButton,
  Button,
  Grid,
  GridItem,
  Modal,
  ModalOverlay,
  ModalContent,
  chakra,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  useDisclosure,
  Card,
  CardBody,
  CardFooter,
  Image,
  useToast,
  Link,
  Stack,
} from "@chakra-ui/react";
import { ChevronLeftIcon, ChevronRightIcon } from "@chakra-ui/icons";
import axios from "axios";

const Calendar = () => {
  const [currentMonth, setCurrentMonth] = useState(moment());
  const [data, setData] = useState([]);
  const [selectedTime, setSelectedTime] = useState(null);
  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isOpenModal2,
    onOpen: onOpenModal2,
    onClose: onCloseModal2,
  } = useDisclosure();
  const toast = useToast()

  const fetchData = async () => {
    try {
      const response = await axios.get('https://new-apiv2.importir.com/api/seminar/event-acquisition/next-one-month?event_type=entrepreneur');
      setData(response.data);
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };


  useEffect(() => {
    fetchData();
  }, [])

  const generateVanilla = (companyId) => {
    const calendarVanilla = `
    <!DOCTYPE html>
    <html lang="en">
      <head>
        <meta charset="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
        <script src="https://momentjs.com/downloads/moment.min.js"></script>
        <script src="https://cdn.jsdelivr.net/npm/axios/dist/axios.min.js"></script>
        <style>
          body {
            font-family: "Arial", sans-serif;
            background-color: #f8f8f8;
            margin: 0;
            padding: 0;
          }
    
          #calendar {
            width: 80%;
            margin-left: auto;
            margin-right: auto;
            overflow: hidden;
            background-color: #fff;
          }
    
          #calendar-header {
            margin-left: auto;
            margin-right: auto;
            width: 80%;
            display: flex;
            justify-content: space-between;
            align-items: center;
            background-color: #3498db;
            color: white;
            border-radius: 10px 10px 0 0;
          }
    
          #calendar-header button {
            cursor: pointer;
            background-color: #2980b9;
            color: white;
            border: none;
            padding: 12px;
            margin: 11px;
            border-radius: 5px;
          }
    
          #calendar-header button:hover {
            background-color: #2575a7;
          }
    
          #calendar-header span {
            flex-grow: 1;
            text-align: center;
            font-weight: bold;
          }
    
          #calendar-days {
            display: flex;
            justify-content: space-between;
            background-color: #3498db;
            color: white;
          }
    
          .today {
            background-color: #54b1ee;
            color: white;
          }
    
          .day {
            flex-grow: 1;
            height: 40px;
            line-height: 40px;
            text-align: center;
          }
    
          #calendar-body {
            display: grid;
            grid-template-columns: repeat(7, 1fr);
          }
    
          .day-container {
            position: relative;
            height: 160px;
          }
    
          .day-number {
            width: 100%;
            height: 160px;
            /* line-height: 50px; */
            text-align: center;
            position: relative;
            overflow: none;
            border: 1px solid #ccc;
            cursor: pointer;
          }
    
          .event-card {
            position: absolute;
            top: 40px;
            margin-left: 2%;
            width: 98%;
            height: 40%;
            border-radius: 5px;
            overflow: hidden;
            text-align: center;
            background-color: #3498db;
            color: white;
          }
    
          .event-content {
            display: flex;
            align-items: center;
            padding: 5px;
          }
    
          .event-image {
            width: 30%;
            height: 40px;
            margin-right: 5px;
            border-radius: 50%;
          }
    
          .event-text {
            flex-grow: 1;
            font-size: 8px;
          }
    
          .empty {
            width: 100%;
            height: 160px;
            line-height: 50px;
            text-align: center;
            border: 1px solid #ccc;
            position: relative;
            overflow: hidden;
          }
    
          #table {
            display: none;
            margin-right: auto;
            margin-left: auto;
            width: 80%;
            margin-top: 20px;
          }
    
          #calendar-title {
            padding: 10px;
            display: flex;
            flex-direction: column;
            align-items: center;
          }
    
          #toggle-button {
            cursor: pointer;
            background-color: #2980b9;
            color: white;
            border: none;
            border-radius: 5px;
            margin-top: 7px;
          }
    
          #toggle-button:hover {
            background-color: #2575a7;
          }
    
          #event-table {
            width: 100%;
            border-collapse: collapse;
            margin-top: 20px;
          }
    
          #event-table th,
          #event-table td {
            border: 1px solid #ccc;
            padding: 8px;
            text-align: left;
          }
    
          @media only screen and (max-width: 1000px) {
            .event-text{
              font-size: 45%;
            }
          }
    
          @media only screen and (max-width: 600px) {
            #calendar {
              width: 100%;
            }
    
            #calendar-header {
              width: 100%;
            }
    
            .event-card {
              width: full;
              padding: 0;
              left: 3%;
            }
    
            .event-content {
              display: inline;
            }
    
            .event-image {
              margin-top: 10%;
              left: 0;
              width: 80%;
            }
    
            .event-text {
              display: none;
            }
    
            .day {
              font-size: 12px;
            }
    
            .day-container {
              height: 80px;
            }
    
            .empty {
              height: 80px;
            }
    
            .day-number {
              height: 80px;
              line-height: 30px;
            }
    
            .event-card {
              height: 30px;
            }
    
            .event-image {
              top: 0;
              height: 20px;
            }
    
            .more-link {
              font-size: 8px;
            }
    
            #table {
              width: 100%;
            }
          }
        </style>
        <title>Calendar</title>
      </head>
      <body>
        <div id="calendar-header">
          <button onclick="prevMonth()"><</button>
          <div id="calendar-title">
            <span id="currentMonth"></span>
            <button id="toggle-button" onclick="toggleView()">Toggle View</button>
          </div>
          <button onclick="nextMonth()">></button>
        </div>
        <div id="calendar">
          <div id="calendar-days">
            <div class="day">Sun</div>
            <div class="day">Mon</div>
            <div class="day">Tue</div>
            <div class="day">Wed</div>
            <div class="day">Thu</div>
            <div class="day">Fri</div>
            <div class="day">Sat</div>
          </div>
          <div id="calendar-body"></div>
        </div>
        <div id="table">
          <table id="event-table">
            <thead>
              <tr>
                <th>Title</th>
                <th>Date</th>
                <th>City</th>
                <th>Link</th>
              </tr>
            </thead>
            <tbody id="event-table-body"></tbody>
          </table>
        </div>
    
        <script>
          let currentMonth = moment();
          let events = [];
          let currentView = "calendar";
    
          function toggleView() {
            const calendar = document.getElementById("calendar");
            const table = document.getElementById("table");
    
            if (currentView === "calendar") {
              calendar.style.display = "none";
              table.style.display = "block";
              currentView = "table";
            } else {
              calendar.style.display = "block";
              table.style.display = "none";
              currentView = "calendar";
            }
          }
    
          async function fetchData() {
            try {
              const response = await axios.get(
                "https://new-apiv2.importir.com/api/seminar/event-acquisition/next-one-month?event_type=entrepreneur${companyId}"
              );
              if (response && response.data) {
                events = response.data;
                displayData(events);
              } else {
                console.error("Invalid response data:", response);
              }
            } catch (error) {
              console.error("Error fetching data:", error.message);
            }
          }
    
          function displayData(data) {
            const filteredData = data.filter((event) => {
              const eventMonth = moment(event.event_date).month();
              const currentMonthIndex = currentMonth.month();
              return eventMonth === currentMonthIndex;
            });
    
            updateCalendar(filteredData);
    
            const eventTableBody = document.getElementById("event-table-body");
            eventTableBody.innerHTML = "";
    
            console.log(filteredData, "lolol");
            filteredData.forEach((event) => {
              const row = document.createElement("tr");
              row.innerHTML =
                "<td>" +
                event.event_title +
                "</td><td>" +
                event.event_date +
                "</td><td>" +
                event.event_city +
                "</td><td>" +
                event.event_link +
                "</td>";
              eventTableBody.appendChild(row);
            });
          }
    
          function updateCalendar(data) {
            const calendarHeader = document.getElementById("currentMonth");
            const calendarBody = document.getElementById("calendar-body");
    
            calendarHeader.textContent = currentMonth.format("MMMM YYYY");
    
            calendarBody.innerHTML = "";
    
            const today = moment();
            const firstDay = moment(currentMonth).startOf("month");
            const lastDay = moment(currentMonth).endOf("month");
            const startDay = firstDay.day();
            const endDay = lastDay.date();
    
            for (let i = 0; i < startDay; i++) {
              const emptyDay = document.createElement("div");
              emptyDay.classList.add("empty");
              calendarBody.appendChild(emptyDay);
            }
    
            for (let day = 1; day <= endDay; day++) {
              const dayContainer = document.createElement("div");
              dayContainer.classList.add("day-container");
    
              const dayNumber = document.createElement("div");
              dayNumber.classList.add("day-number");
              dayNumber.textContent = day;
    
              const eventDate = moment(currentMonth).date(day);
              const matchingEvents = data.filter((event) =>
                moment(event.event_date).isSame(eventDate, "day")
              );
    
              if (today.isSame(eventDate, "day") || matchingEvents.length > 0) {
                if (today.isSame(eventDate, "day")) {
                  dayNumber.classList.add("today");
                }
    
                dayNumber.addEventListener("click", () => {
                  handleDayClick(eventDate);
                });
    
                matchingEvents.forEach((event) => {
                  const eventCard = document.createElement("div");
                  eventCard.classList.add("event-card");
    
                  const eventContent = document.createElement("div");
                  eventContent.classList.add("event-content");
    
                  // Elemen untuk gambar
                  const image = document.createElement("img");
                  image.src = event.event_image;
                  image.alt = "Event Image";
                  image.classList.add("event-image");
    
                  // Elemen untuk teks
                  const text = document.createElement("div");
                  text.classList.add("event-text");
                  text.innerHTML = "<strong>" + event.event_title + "</strong><br>";
    
                  const date = document.createElement("div");
                  date.classList.add("event-date");
                  date.textContent = moment(event.event_date).format(
                    "MMMM DD, YYYY"
                  );
    
                  const link = document.createElement("a");
                  link.classList.add("event-link");
                  link.href = event.event_link;
    
                  eventContent.appendChild(image);
                  eventContent.appendChild(text);
                  eventCard.appendChild(eventContent);
                  dayContainer.appendChild(dayNumber);
                  dayContainer.appendChild(eventCard);
                });
              } else {
                dayNumber.classList.add("empty");
              }
    
              dayContainer.appendChild(dayNumber);
              calendarBody.appendChild(dayContainer);
            }
          }
    
          function updateTable(data, selectedDate) {
            const eventTableBody = document.getElementById("event-table-body");
            eventTableBody.innerHTML = "";
    
            const filteredData = data.filter((event) =>
              moment(event.event_date).isSame(selectedDate, "day")
            );
    
            filteredData.forEach((event) => {
              const row = document.createElement("tr");
              row.innerHTML =
                "<td>" +
                event.event_title +
                "</td><td>" +
                event.event_date +
                "</td><td>" +
                event.event_city +
                "</td><td>" +
                event.event_link +
                "</td>";
              eventTableBody.appendChild(row);
            });
          }
    
          function handleDayClick(selectedDate) {
            const calendar = document.getElementById("calendar");
            const table = document.getElementById("table");
    
            if (currentView === "calendar") {
              calendar.style.display = "none";
              table.style.display = "block";
              currentView = "table";
    
              updateTable(events, selectedDate);
            } else {
              calendar.style.display = "block";
              table.style.display = "none";
              currentView = "calendar";
            }
          }
    
          function prevMonth() {
            currentMonth = moment(currentMonth).subtract(1, "month");
            fetchData();
          }
    
          function nextMonth() {
            currentMonth = moment(currentMonth).add(1, "month");
            fetchData();
          }
    
          fetchData();
        </script>
      </body>
    </html> `

    return calendarVanilla
  }

  const [code, setCode] = useState(generateVanilla());

  let hasilGabungan = {};

  data.forEach(obj => {
    const waktu = obj.event_date;
    const title = obj.event_title;
    const image = obj.event_image;

    if (hasilGabungan[waktu]) {
      hasilGabungan[waktu].push({ date: obj.event_date, title: obj.event_title, image: obj.event_image });
    } else {
      hasilGabungan[waktu] = [{ date: obj.event_date, title: obj.event_title, image: obj.event_image }];
    }
  });

  let arrayHasil = Object.keys(hasilGabungan).map(waktu => ({
    waktu: waktu,
    data: hasilGabungan[waktu]
  }));


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
    return days;
  };

  const handleClick = (stats) => {
    setSelectedTime(stats); 
    onOpen(); 
  };

  const handleEmbed = () => {
    const embedCode = generateVanilla(" ");
    setCode(embedCode);
    navigator.clipboard.writeText(embedCode);
    toast({
      title: 'Copy Complete',
      description: "Code copy to Clipboard",
      status: 'success',
      duration: 5000,
      isClosable: true,
    })
  };


  const selectedEventDate = data.filter(obj => obj.event_date === selectedTime);
  const prevMonth = () => {
    setCurrentMonth(moment(currentMonth).subtract(1, 'month'));
  };

  const nextMonth = () => {
    setCurrentMonth(moment(currentMonth).add(1, 'month'));
  };

  // console.log(data, "data")
  // console.log(selectedTime, "selected time")
  // console.log(arrayHasil, "array hasil")

  return (
    <>
      <Box p={[0,0,4]} marginTop={["28%","0","0"]} marginLeft={["-10%", "0", "0"]}>
        <Flex align="center" justify="space-between" mb={4}>
          <IconButton icon={<ChevronLeftIcon />} onClick={prevMonth} />
          <Text fontSize={["sm", "md", "lg"]} fontWeight="bold">
            {currentMonth.format("MMMM YYYY")}
          </Text>
          <IconButton icon={<ChevronRightIcon />} onClick={nextMonth} />
        </Flex>
        <Grid templateColumns={["repeat(7, 1fr)", "repeat(7, 1fr)", "repeat(7, 1fr)"]}>
          {["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"].map((day) => (
            <Box border={"1px solid"} key={day}>
              <GridItem textAlign="center" fontWeight="bold">
                {day}
              </GridItem>
            </Box>
          ))}
          {daysInMonth().map((day, index) => (
            <Box
              key={index}
              border="1px solid"
              style={{
                backgroundColor:
                  moment(day, "YYYY-MM-DD").isSame(moment(), "day") ? "teal" : null,
              }}
            >
              <GridItem textAlign="center" px={["0%","5%","5%"]} py="17%" gap={0.5} height={["180px","220px", "260px"]}>
                {day && (
                  <>
                    <Text variant="outline" size="sm">
                      {moment(day, "YYYY-MM-DD").date()}
                    </Text>
                    {arrayHasil.map((entry, entryIndex) => (
                      <div key={entryIndex} >
                        {entry.waktu === moment(day, "YYYY-MM-DD").format("YYYY-MM-DD") ? (
                          <div>
                            {entry.data.slice(0, 2).map((event, eventIndex) => (
                              <Card
                                key={eventIndex}
                                direction="row"
                                onClick={() => handleClick(event.date)}
                                colorScheme="teal"
                                overflow="hidden"
                                size="md"
                                w={"full"}
                                maxH={"65px"}
                                marginRight="60%"
                                marginTop={"5px"}
                                cursor={"pointer"}
                                objectFit="cover"
                              >
                                <Image
                                  maxH={"5%"}
                                  maxWidth={["100%","30%","30%"]}
                                  src={event.image}
                                  objectFit="cover"
                                  borderRadius="full"
                                />
                                <Stack>
                                  <CardBody>
                                    <Text fontSize={["0","sm","sm"]} marginLeft={"-20%"}>
                                      {event.title}
                                    </Text>
                                  </CardBody>
                                </Stack>
                              </Card>
                            ))}
                            {entry.data.length > 2 && (
                              <Link color="teal" fontSize="sm">
                                +{entry.data.length - 2} more
                              </Link>
                            )}
                          </div>
                        ) : null}
                      </div>
                    ))}
                  </>
                )}
              </GridItem>
            </Box>
          ))}



        </Grid >
      </Box >

      <Button onClick={onOpenModal2}>Embed Calendar</Button>
      <Modal isOpen={isOpenModal2} size={"xl"} onClose={onCloseModal2}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Embed Code</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Box
              bgColor={"black"}
            >
              <p style={{ color: 'white' }}>{code}</p>
            </Box>

          </ModalBody>
          <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onCloseModal2}>
              Close
            </Button>
            <Button onClick={handleEmbed}>
              Embed Code
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Event</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedEventDate.map((x, index) => (
              <Card maxW='md' key={index}>
                <CardBody>
                  <Image
                    objectFit='cover'
                    src={x.event_image}
                  />
                  <Box
                    border="none"
                    padding={[0, 2, 4]}
                    borderRadius="md"
                    display="grid"
                    gridTemplateColumns="max-content max-content 1fr"
                    gridGap="2"
                  >
                    <chakra.p fontSize={["sm", "md", "md"]} fontFamily={"Sans-serif"}>
                      Event Name
                    </chakra.p>
                    <chakra.p fontSize={["sm", "md", "md"]} fontFamily={"Sans-serif"}>
                      :
                    </chakra.p>
                    <chakra.p fontSize={["md", "md", "lg"]} fontFamily={"Sans-serif"}>
                      {x.event_title}
                    </chakra.p>
                    <chakra.p fontSize={["sm", "md", "md"]} fontFamily={"Sans-serif"}>
                      Date
                    </chakra.p>
                    <chakra.p fontSize={["sm", "md", "md"]} fontFamily={"Sans-serif"}>
                      :
                    </chakra.p>
                    <chakra.p fontSize={["md", "md", "lg"]} fontFamily={"Sans-serif"}>
                      {x.event_date}, {x.start_hour} WIB
                    </chakra.p>
                    <chakra.p fontSize={["sm", "md", "md"]} fontFamily={"Sans-serif"}>
                      Location
                    </chakra.p>
                    <chakra.p fontSize={["sm", "md", "md"]} fontFamily={"Sans-serif"}>
                      :
                    </chakra.p>
                    <chakra.p fontSize={["md", "md", "lg"]} fontFamily={"Sans-serif"}>
                      {x.event_city}
                    </chakra.p>
                    <chakra.p fontSize={["sm", "md", "md"]} fontFamily={"Sans-serif"}>
                      Link
                    </chakra.p>
                    <chakra.p fontSize={["sm", "md", "md"]} fontFamily={"Sans-serif"}>
                      :
                    </chakra.p>
                    <chakra.p fontSize={["md", "md", "lg"]} fontFamily={"Sans-serif"}>
                      {x.event_link}
                    </chakra.p>
                  </Box>
                </CardBody>
                <CardFooter />
              </Card>
            ))}
          </ModalBody>
          <ModalFooter>
            <Button colorScheme='blue' mr={3} onClick={onClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  );
};

export default Calendar;