import React from "react";
import MarketingPage from "../Pages/Marketing/MarketingPage";
import LandingPageFunnel from "../Pages/Marketing/LandingPageFunnel";
import LandingPage from "../Pages/Marketing/LandingPage";
import LandingPageFunnelView from "../Pages/Marketing/LandingPageFunnelView";

const ManagementRouter = [
  {
    path: "/marketing",
    element: <MarketingPage />,
  },
  {
    path: "/marketing/funnel",
    element: <LandingPageFunnel />,
  },
  {
    path: "/marketing/funnel/view/:id",
    element: <LandingPageFunnelView />,
  },
  {
    path: "/marketing/funnel/create/:id/lp-builder/:pageId",
    element: <LandingPage />,
  },
];

export default ManagementRouter;
