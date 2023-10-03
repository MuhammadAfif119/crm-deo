import React from "react";
import HomePage from "../Pages/Home/HomePage";
import HomePageV2 from "../Pages/Home/HomePageV2";


const HomeRouter = [
  {
    path: "/",
    element: <HomePage />,
  },

  {
    path: "/home",
    element: <HomePageV2 />,
  },
];

export default HomeRouter;
