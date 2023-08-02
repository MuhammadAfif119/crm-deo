import React from "react";
import { Route, Routes } from "react-router-dom";
import CalendarRouter from "./CalendarRouter";
import SocialBuildRouter from "./SocialBuildRouter";
import CommentRouter from "./CommentRouter";
import ReportsRouter from "./ReportsRouter";
import SocialAccountRouter from "./SocialAccountRouter";
import HomeRouter from "./HomeRouter";
import PipelineRouter from "./PipelineRouter";
import SettingRouter from "./SettingRouter";
import FormRouter from "./FormRouter";
import ListingRouter from "./ListingRouter";
import NewsRouter from "./NewsRouter";
import TicketRouter from "./TicketRouter";
import ConfigurationRouter from "./ConfigurationRouter";
import ContactsRouter from "./ContactsRouter";
// import SettingRouter from "./SettingRouter";

function MainRouter() {
  const allRouter = [
    ...HomeRouter,
    ...CalendarRouter,
    ...SocialBuildRouter,
    ...CommentRouter,
    ...ReportsRouter,
    ...SocialAccountRouter,
    ...PipelineRouter,
    ...SettingRouter,
    ...FormRouter,
    ...ListingRouter,
    ...NewsRouter,
    ...TicketRouter,
    ...ConfigurationRouter,
    ...ContactsRouter
  ];
  return (
    <Routes>
      {/* <Route path="setting/*" element={<SettingRouter />} /> */}

      {allRouter.map((item, index) => {
        return <Route key={index} path={item.path} element={item.element} />;
      })}
    </Routes>
  );
}

export default MainRouter;
