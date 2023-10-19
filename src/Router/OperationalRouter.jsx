import React from "react";
import OperationalHome from "../Pages/Opeationals/OperationalHome";
import ProductionPage from "../Pages/Opeationals/ProductionPage";

const OperationalRouter = [
  {
    path: "/operational",
    element: <OperationalHome />,
  },

  {
    path: "/operational/productions",
    element: <ProductionPage />,
  },
];

export default OperationalRouter;
