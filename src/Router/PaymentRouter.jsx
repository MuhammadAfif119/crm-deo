import React from "react";
import PaymentSummaryPage from "../Pages/Payment/PaymentSummaryPage";
import PaymentTicketPage from "../Pages/Payment/PaymentTicketPage";

const PaymentRouter = [
  {
    path: "/payment/:type/:method/:id/:phone/:name",
    element: <PaymentTicketPage />,
  },
  {
    path: "/payment/summary/:orderId",
    element: <PaymentSummaryPage />,
  },

];

export default PaymentRouter;
