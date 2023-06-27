import React from "react";
import { Route, Routes } from "react-router-dom";
import { SettingAccountPage } from "../Pages/Settings/SettingAccountPage";
import SettingsPage from "../Pages/Settings/SettingsPage";

function SettingRouter() {
  return (
    <Routes>
      <Route path="/" element={<SettingsPage />} />
      <Route path="/account" element={<SettingAccountPage />} />
    </Routes>
  );
}

export default SettingRouter;
