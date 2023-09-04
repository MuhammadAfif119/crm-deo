import React from "react";
import PaymentPage from "../Pages/Payment/PaymentPage";
import PaymentSummaryPage from "../Pages/Payment/PaymentSummaryPage";

const PaymentRouter = [
  {
    path: "/payment/:type/:method/:id/:phone/:name",
    element: <PaymentPage />,
  },
  {
    path: "/payment/summary/:orderId",
    element: <PaymentSummaryPage />,
  },

];

export default PaymentRouter;
