import React from "react";
import HomePage from "../Pages/Home/HomePage";
import HomePageV2 from "../Pages/Home/HomePageV2";
import HomePageWelcome from "../Pages/Home/HomePageWelcome";

const HomeRouter = [
  {
    path: "/",
    element: <HomePage />,
  },

  {
    path: "/home/dashboard",
    element: <HomePageV2 />,
  },
  {
    path: "/home",
    element: <HomePageWelcome />,
  },
];

export default HomeRouter;
