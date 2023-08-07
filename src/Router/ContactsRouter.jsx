import React from "react";
import ContactsDetailPage from "../Pages/Contacts/ContactsDetailPage";
import ContactsPage from "../Pages/Contacts/ContactsPage";



const ContactsRouter = [
     {
          path: "/contacts",
          element: <ContactsPage />,
     },

     {
          path: "/contacts/detail/:id",
          element: <ContactsDetailPage />,
     },
];

export default ContactsRouter;
