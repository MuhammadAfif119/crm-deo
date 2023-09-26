import React from "react";
import PaymentPage from "../Pages/Payment/PaymentPage";
import PaymentSummaryPage from "../Pages/Payment/PaymentSummaryPage";
import ShippingPaymentPage from "../Pages/Shipping/ShippingPaymentPage";

const PaymentRouter = [
  {
    path: "/payment/:type/:method/:id/:phone/:name/:formId",
    // path: "/payment/:type/:method/:id/:phone/:name/:formId",
    element: <PaymentPage />,
  },
  {
    path: "/payment/summary/:orderId",
    element: <PaymentSummaryPage />,
  },
];

export default PaymentRouter;
