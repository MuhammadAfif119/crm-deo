import React from "react";
import NewsPage from "../Pages/News/NewsPage";

import CreateNewsPage from "../Pages/News/CreateNewsPage";

const NewsRouter = [
     {
          path: "/news",
          element: <NewsPage />,
     },

     {
          path: "/news/:type",
          element: <CreateNewsPage />,
     },
];

export default NewsRouter;
