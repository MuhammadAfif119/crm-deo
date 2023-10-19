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
import ChatRouter from "./ChatRouter";
import MembershipRouter from "./MembershipRouter";
import ProductRouter from "./ProductRouter";
import ThemesRouter from "./ThemesRouter";
import CourseRouter from "./CourseRouter";
import HRISRouter from "./HRISRouter";
import RMSRouter from "./RMSRouter";
import ManagementRouter from "./ManagementRouter";
import MarketingRouter from "./MarketingRouter";
import SalesRouter from "./SalesRouter";
import OperationalRouter from "./OperationalRouter";
import WarehouseRouter from "./WarehouseRouter";
// import SettingRouter from "./SettingRouter";

function MainRouter() {
  const allRouter = [
    ...HRISRouter,
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
    ...ContactsRouter,
    ...ChatRouter,
    ...MembershipRouter,
    ...ProductRouter,
    ...ThemesRouter,
    ...CourseRouter,
    ...RMSRouter,
    ...ManagementRouter,
    ...MarketingRouter,
    ...SalesRouter,
    ...OperationalRouter,
    ...WarehouseRouter,
  ];
  return (
    <Routes>
      {allRouter.map((item, index) => {
        return <Route key={index} path={item.path} element={item.element} />;
      })}
    </Routes>
  );
}

export default MainRouter;
