import React from "react";
import HomePage from "../Pages/Home/HomePage";
import CRMHomePage from "../Pages/Home/CRMHomePage";
import HomePageV2 from "../Pages/Home/HomePageV2";
import HomePageWelcome from "../Pages/Home/HomePageWelcome";

const HomeRouter = [
  {
    path: "/",
    element: <HomePage />,
  },
  {
    path: "/crm",
    element: <CRMHomePage />,
  },

  {
    path: "/crm/pageview/dashboard",
    element: <HomePageV2 />,
  },
  {
    path: "/crm/pageview",
    element: <HomePageWelcome />,
  },
];

export default HomeRouter;
