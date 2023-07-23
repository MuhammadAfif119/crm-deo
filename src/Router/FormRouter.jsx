import React from "react";
import FormBuilderPage from "../Pages/Form/FormBuilderPage";
import FormPageV2 from "../Pages/Form/FormPageV2";

const FormRouter = [
  {
    path: "/form-builder",
    element: <FormPageV2 />,
  },
  {
    path: "/form-builder/:id",
    element: <FormBuilderPage />,
  },
];

export default FormRouter;
