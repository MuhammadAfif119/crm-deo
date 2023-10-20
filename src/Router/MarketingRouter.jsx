import React from "react";
import MarketingPage from "../Pages/Marketing/MarketingPage";
import LandingPage from "../Pages/Marketing/LandingPage";

const ManagementRouter = [
  {
    path: "/marketing",
    element: <MarketingPage />,
  },
  {
    path: "/marketing/lp-builder",
    element: <LandingPage />,
  },
];

export default ManagementRouter;
