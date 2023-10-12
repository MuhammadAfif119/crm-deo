import React from "react";
import HomePageRMS from "../Pages/RMS/HomePageRMS";
import RMSPageview from "../Pages/RMS/RMSPageview";

const RMSRouter = [
  {
    path: "/rms",
    element: <HomePageRMS />,
  },
  {
    path: "/rms/dashboard/:id",
    element: <RMSPageview />,
  },
];

export default RMSRouter;
