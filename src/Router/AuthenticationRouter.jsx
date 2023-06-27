import React from "react";
import { Route, Routes } from "react-router-dom";
import LoginEmail from "../Pages/Auth/LoginEmail";
import LoginPage from "../Pages/Auth/LoginPage";
import SignUpPage from "../Pages/Auth/SignUpPage";

const AuthenticationRouter = [
  // {
  //   path: "/",
  //   element: <LoginEmail />,
  // },
  {
    path: "/login",
    element: <LoginEmail />,
  },
  {
    path: "/signup",
    element: <SignUpPage />,
  },
];

export default AuthenticationRouter;
