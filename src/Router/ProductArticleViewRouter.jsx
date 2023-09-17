import React from "react";

import ProductSinglePage from "../Pages/Products/ProductSinglePage";

const ProductArticleRouter = [
  {
    path: "/products/article/view/:id",
    element: <ProductSinglePage />,
  },
];

export default ProductArticleRouter;
