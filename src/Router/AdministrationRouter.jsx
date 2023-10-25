import React from "react";
import UserLive from "../Pages/Administration/UserLive";
import UserList from "../Pages/Administration/UserList";
import AdministrationPage from "../Pages/Administration/AdministrationPage";

const AdministrationRouter = [
  {
    path: "/administration",
    element: <AdministrationPage/>,
  },
  {
    path: "/administration/user-live",
    element: <UserLive />,
  },
  {
    path: "/administration/user-list",
    element: <UserList />,
  },
];

export default AdministrationRouter;
