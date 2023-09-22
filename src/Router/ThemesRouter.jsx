import React from "react";
import CurrentThemes from "../Pages/Products/CurrentThemePage";
import ThemesEditPage from "../Pages/Products/ThemesEditPage";

const ThemesRouter = [
     {
          path: "/themes",
          element: <CurrentThemes />,
     },

     {
          path: "/themes/edit",
          element: <ThemesEditPage />,
     },
];

export default ThemesRouter;
