import React from "react";
import TicketPage from "../Pages/Ticket/TicketPage";
import FormTicketPage from "../Pages/Ticket/FormTicketPage";
import WarehouseHome from "../Pages/Warehouses/WarehouseHome";
import WarehouseAddressPage from "../Pages/Warehouses/WarehouseAddressPage";

const WarehouseRouter = [
  {
    path: "/warehouse",
    element: <WarehouseHome />,
  },
  {
    path: "/warehouse/address",
    element: <WarehouseAddressPage />,
  },
];

export default WarehouseRouter;
