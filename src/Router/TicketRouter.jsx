import React from "react";
import TicketPage from "../Pages/Ticket/TicketPage";
import FormTicketPage from "../Pages/Ticket/FormTicketPage";


const TicketRouter = [
     {
          path: "/ticket",
          element: <TicketPage />,
     },
     {
          path: '/ticket/:type',
          element: <FormTicketPage />
     }
];

export default TicketRouter;
