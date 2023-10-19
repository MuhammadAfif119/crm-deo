import React from "react";
import OperationPage from "../Pages/Operation/OperationPage";
import ProductionPage from "../Pages/Operation/ProductionPage";

const OperationRouter = [
  {
    path: "/operation",
    element: <OperationPage />,
  },
  {
    path: "/production",
    element: <ProductionPage />,
  },


];

export default OperationRouter;
