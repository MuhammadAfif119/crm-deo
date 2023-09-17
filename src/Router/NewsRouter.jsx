import React from "react";
import NewsPage from "../Pages/News/NewsPage";

import NewsEditPage from "../Pages/News/NewsEditPage";
import NewsCreatePage from "../Pages/News/NewsCreatePage";

const NewsRouter = [
  {
    path: "/news",
    element: <NewsPage />,
  },

  {
    path: "/news/edit/:id",
    element: <NewsEditPage />,
  },
  {
    path: "/news/create",
    element: <NewsCreatePage />,
  },
];

export default NewsRouter;
