import React from "react";
import UserLive from "../Pages/Administration/UserLive";
import UserList from "../Pages/Administration/UserList";
import BillingPage from "../Pages/Administration/BillingPage";
import HistoryPage from "../Pages/Administration/HistoryPage";
import AffiliateBillingPage from "../Pages/Administration/AffiliateBillingPage";

const AdministrationRouter = [
  {
    path: "/administration/user-live",
    element: <UserLive />,
  },
  {
    path: "/administration/user-list",
    element: <UserList />,
  },
  {
    path: "/administration/billing",
    element: <BillingPage />,
  },
  {
    path: "/administration/history",
    element: <HistoryPage />,
  },
  {
    path: "/administration/affiliate-billing",
    element: <AffiliateBillingPage />,
  },
];

export default AdministrationRouter;
