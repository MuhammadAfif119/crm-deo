import React from "react";
import IndexDomainPage from "../Pages/Configurations/DomainPage";
import NewDomainPage from "../Pages/Configurations/DomainNewPage";
import SourcePage from "../Pages/Configurations/SourcePage";
import SourceNewPage from "../Pages/Configurations/SourceNewPage";
import ProjectPage from "../Pages/Configurations/ProjectPage";
import ProjectNewPage from "../Pages/Configurations/ProjectNewPage";
import OutletPage from "../Pages/Configurations/OutletPage";
import OutletNewPage from "../Pages/Configurations/OutletNewPage";
import UserPage from "../Pages/Configurations/UserPage";

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
  {
    path: "/configuration/user",
    element: <UserPage />,
  },
];

export default PipelineRouter;
