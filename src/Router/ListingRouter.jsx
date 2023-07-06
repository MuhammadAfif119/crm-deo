import React from "react";
import FormPageListing from "../Pages/Listing/FormPageListing";
import ListingPage from "../Pages/Listing/ListingPage";
import MyFeedRssPage from "../Pages/MyFeeds/MyFeedRssPage";

const ListingRouter = [
  {
    path: "/listing",
    element: <ListingPage />,
  },

  {
    path: "/new-listing",
    element: <FormPageListing />,
  },
];

export default ListingRouter;
