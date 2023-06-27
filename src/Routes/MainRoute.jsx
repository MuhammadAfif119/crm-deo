import React, { useContext } from "react";
import { Route, Routes } from "react-router-dom";
import CalendarPage from "../Pages/Calendar/CalendarPage";
import CommentsPage from "../Pages/Comments/CommentsPage";
import HelpPage from "../Pages/HelpPage";
import InformationPage from "../Pages/InformationPage";
import MyFeedRssPage from "../Pages/MyFeeds/MyFeedRssPage";
import LoginEmail from "../Pages/Auth/LoginEmail";
import SignUpPage from "../Pages/Auth/SignUpPage";
import ReportsPage from "../Pages/Reports/ReportsPage";
import SocialAccountPage from "../Pages/SocialAccounts/SocialAccountPage";
import SocialBuildPage from "../Pages/Posts/SocialBuildPage";
import TermConditionPage from "../Pages/TermConditionPage";
// import PricingPage from '../Pages/PricingPage'
import PricingDetail from "../Pages/PricingDetail";

function MainRoute() {
  return (
    <Routes>
      <Route path="/login" element={<LoginEmail />} />
      <Route path="/signup" element={<SignUpPage />} />
      <Route path="/" element={<SocialBuildPage />} />
      <Route path="/social-account" element={<SocialAccountPage />} />
      <Route path="/my-feed" element={<MyFeedRssPage />} />
      <Route path="/comments" element={<CommentsPage />} />
      <Route path="/calendar" element={<CalendarPage />} />
      <Route path="/reports" element={<ReportsPage />} />
      <Route path="/pricing/:detail" element={<PricingDetail />} />

      <Route path="/termcondition" element={<TermConditionPage />} />
      <Route path="/help" element={<HelpPage />} />
      <Route path="/information" element={<InformationPage />} />
    </Routes>
  );
}

export default MainRoute;
