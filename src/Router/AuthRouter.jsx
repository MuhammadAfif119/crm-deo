import React from "react";
import { Route, Routes } from "react-router-dom";
import AuthenticationRouter from "./AuthenticationRouter";
import ChatRouter from "./ChatRouter";
import PaymentRouter from "./PaymentRouter";


function AuthRouter() {
  const authRouter = [...AuthenticationRouter, ...ChatRouter, ...PaymentRouter];
  return (
    <Routes>
      {authRouter.map((item, index) => {
        return <Route key={index} path={item.path} element={item.element} />;
      })}
    </Routes>
  );
}

export default AuthRouter;
