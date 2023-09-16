import React from "react";
import NewsPage from "../Pages/News/NewsPage";

import CreateNewsPage from "../Pages/News/CreateNewsPage";
import ProductSinglePage from "../Pages/Products/ProductSinglePage";

const ProductArticleRouter = [
  {
    path: "/products/article/view/:id",
    element: <ProductSinglePage />,
  },
];

export default ProductArticleRouter;
