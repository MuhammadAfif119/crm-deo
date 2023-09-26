import React from "react";
import PipelinePage from "../Pages/Pipeline/PipelinePage";
import PipelineCreatePage from "../Pages/Pipeline/PipelineCreatePage";
import PipelineViewPage from "../Pages/Pipeline/PipelineViewPage";
import OrderPage from "../Pages/Pipeline/OrderPage";
import PipelineHome from "../Pages/Pipeline/PipelineHome";

const PipelineRouter = [
  {
    path: "/pipeline",
    element: <PipelinePage />,
  },
  {
    path: "/pipelineHome",
    element: <PipelineHome />,
  },
  {
    path: "/pipeline/create",
    element: <PipelineCreatePage />,
  },

  {
    path: "/pipeline/view/:id",
    element: <PipelineViewPage />,
  },

  {
    path: "/orders",
    element: <OrderPage />,
  },
];

export default PipelineRouter;
