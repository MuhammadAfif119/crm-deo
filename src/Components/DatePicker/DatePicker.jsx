import "react-date-range/dist/styles.css"; // main css file
import "react-date-range/dist/theme/default.css"; // theme css file
import React, { useState } from "react";
import { addDays } from "date-fns";
import { DateRangePicker } from "react-date-range";

const DatePicker = ({ onDateChange }) => {
  const [date, setDate] = useState([
    {
      startDate: new Date(),
      endDate: addDays(new Date(), 7),
      key: "selection",
    },
  ]);

  const handleDateRangeChange = (item) => {
    setDate([item.selection]);
    onDateChange(item.selection); // Pass the date range to the parent component
  };

  return (
    <>
      <DateRangePicker
        onChange={handleDateRangeChange}
        ranges={date}
        maxDate={addDays(new Date(), 0)}
        moveRangeOnFirstSelection={false}
        showPreview={true}
        direction="vertical"
        preventSnapRefocus={true}
        calendarFocus="backwards"
      />
    </>
  );
};

export default DatePicker;
