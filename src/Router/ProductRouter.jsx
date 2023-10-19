import React from "react";
import FormPageListing from "../Pages/Listing/FormPageListing";
import ListingPage from "../Pages/Listing/ListingPage";
import MyFeedRssPage from "../Pages/MyFeeds/MyFeedRssPage";
import ProductPage from "../Pages/Products/ProductPage";
import FormPageProduct from "../Pages/Products/FormPageProduct";
import ProductArticlePage from "../Pages/Products/ProductArticlePage";
import ProductSinglePage from "../Pages/Products/ProductSinglePage";
import ShippingPaymentPage from "../Pages/Shipping/ShippingPaymentPage";
import ProductEditSinglePage from "../Pages/Products/ProductEditSinglePage";
import ProductArticleCreatePage from "../Pages/Products/ProductArticleCreatePage";
import ProductHome from "../Pages/Products/ProductHome";

const ListingRouter = [
  {
    path: "/products",
    element: <ProductPage />,
  },
  {
    path: "/product",
    element: <ProductHome />,
  },
  {
    path: "/products/:type",
    element: <FormPageProduct />,
  },

  {
    path: "/products/articles",
    element: <ProductArticlePage />,
  },
  {
    path: "/products/articles/create",
    element: <ProductArticleCreatePage />,
  },
  {
    path: "/products/article/edit/:id",
    element: <ProductEditSinglePage />,
  },
  {
    path: "/payment/shipping/data",
    element: <ShippingPaymentPage />,
  },
];

export default ListingRouter;
