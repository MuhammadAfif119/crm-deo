import React from "react";
import IndexDomainPage from "../Pages/Configurations/Domain/IndexPage";
import NewDomainPage from "../Pages/Configurations/Domain/NewPage";
import SourcePage from "../Pages/Configurations/Integration/SourcePage";
import SourceNewPage from "../Pages/Configurations/Integration/SourceNewPage";
import ProjectPage from "../Pages/Configurations/Project/IndexPage";
import ProjectNewPage from "../Pages/Configurations/Project/NewPage";
import OutletPage from "../Pages/Configurations/Outlet/IndexPage";
import OutletNewPage from "../Pages/Configurations/Outlet/NewPage";

const PipelineRouter = [
  {
    path: "/configuration/domain",
    element: <IndexDomainPage />,
  },
  {
    path: "/configuration/domain/new",
    element: <NewDomainPage />,
  },
  {
    path: "/configuration/integration",
    element: <SourcePage />,
  },
  {
    path: "/configuration/integration/new",
    element: <SourceNewPage />,
  },
  {
    path: "/configuration/project",
    element: <ProjectPage />,
  },
  {
    path: "/configuration/project/:id",
    element: <ProjectNewPage />,
  },
  {
    path: "/configuration/outlet",
    element: <OutletPage />,
  },
  {
    path: "/configuration/outlet/:id",
    element: <OutletNewPage />,
  },
];

export default PipelineRouter;
