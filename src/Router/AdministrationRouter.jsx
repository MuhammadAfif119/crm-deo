import React from "react";
import UserLive from "../Pages/Administration/UserLive";
import UserList from "../Pages/Administration/UserList";
import BillingPage from "../Pages/Administration/BillingPage";
import HistoryPage from "../Pages/Administration/HistoryPage";
import AffiliateBillingPage from "../Pages/Administration/AffiliateBillingPage";
import DataCompanyPage from "../Pages/Administration/DataCompanyPage";
import DataCompanyDetailPage from "../Pages/Administration/DataCompanyDetailPage";

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
  {
    path: "/administration/data-company",
    element: <DataCompanyPage />,
  },
  {
    path: "/administration/data-company/:id",
    element: <DataCompanyDetailPage />,
  },
];

export default AdministrationRouter;
