import React from "react";
import FormPageListing from "../Pages/Listing/FormPageListing";
import ListingPage from "../Pages/Listing/ListingPage";
import MyFeedRssPage from "../Pages/MyFeeds/MyFeedRssPage";
import ProductPage from "../Pages/Products/ProductPage";
import FormPageProduct from "../Pages/Products/FormPageProduct";

const ListingRouter = [
  {
    path: "/products",
    element: <ProductPage />,
  },

  {
    path: "/products/:type",
    element: <FormPageProduct />,
  },
];

export default ListingRouter;
