import React from "react";
import HomePageRMS from "../Pages/RMS/HomePageRMS";
import RMSPageview from "../Pages/RMS/RMSPageview";
import ReportsPage from "../Pages/RMS/ReportsPage";

const RMSRouter = [
  {
    path: "/rms",
    element: <HomePageRMS />,
  },
  {
    path: "/rms/dashboard/:id",
    element: <RMSPageview />,
  },
  {
    path: "/rms/reports/:id",
    element: <ReportsPage />,
  },
];

export default RMSRouter;
