import React from "react";
import HomePage from "../Pages/HRIS/HomePage";
import ChatPageFirst from "../Pages/Messanger/ChatPageFirst";

const HRISRouter = [
  {
    path: "/hris",
    element: <HomePage />,
  },

  // {
  //   path: "/hris-home",
  //   element: <HomePage />,
  // },

  // {
  //   path: "/recruitment",
  //   element: <ChatUserPage />,
  // },
];

export default HRISRouter;
