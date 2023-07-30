import React from "react";
import { SettingAccountPage } from "../Pages/Settings/SettingAccountPage";
import SettingPasswordPage from "../Pages/Settings/SettingPasswordPage";



const SettingRouter = [
  {
    path: "/change-password",
    element: (
        <SettingPasswordPage />
    ),
  },
  {
    path: "/settings",
    element: (
        <SettingAccountPage />
    ),
  },
];

export default SettingRouter;
