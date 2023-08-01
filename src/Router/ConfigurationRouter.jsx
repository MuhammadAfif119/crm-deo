import React from "react";
import IndexDomainPage from "../Pages/Configurations/Domain/IndexPage";
import NewDomainPage from "../Pages/Configurations/Domain/NewPage";

const PipelineRouter = [
  {
    path: "/configuration/domain",
    element: <IndexDomainPage />,
  },
  {
    path: "/configuration/domain/new",
    element: <NewDomainPage />,
  },
];

export default PipelineRouter;
