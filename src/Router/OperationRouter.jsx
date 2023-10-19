import React from "react";
import LineProductionPage from "../Pages/Operation/LineProductionPage";
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
  {
    path: "/production/line",
    element: <LineProductionPage />,
  },




];

export default OperationRouter;
