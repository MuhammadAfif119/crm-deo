import React from "react";
import CalendarInputPage from "../Pages/Calendar/CalendarInputPage";
import CalendarManagementPage from "../Pages/Calendar/CalendarManagementPage";
import CalendarPage from "../Pages/Calendar/CalendarPage";
import CalendarViewPage from "../Pages/Calendar/CalendarViewPage";

const CalendarRouter = [
  {
    path: "/calendar-socialmedia",
    element: <CalendarPage />,
  },

  {
    path: "/calendar",
    element: <CalendarManagementPage />,
  },

  {
    path: "/calendar/input",
    element: <CalendarInputPage />,
  },

  {
    path: "/calendar/view",
    element: <CalendarViewPage />,
  },
];

export default CalendarRouter;
