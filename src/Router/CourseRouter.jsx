import React from "react";
import Courses from "../Pages/Courses/Courses";
import CreateCourse from "../Pages/Courses/CreateCourse";
import SingleCourse from "../Pages/Courses/SingleCourse";
import EditLesson from "../Pages/Courses/EditLesson";
import LmsHome from "../Pages/Products/LmsHome";

const CourseRouter = [
  {
    path: "/courses",
    element: <Courses />,
  },

  {
    path: "/lmsHome",
    element: <LmsHome />,
  },

  {
    path: "courses/create",
    element: <CreateCourse />,
  },

  {
    path: "courses/create",
    element: <CreateCourse />,
  },
  {
    path: "/courses/:id_course",
    element: <SingleCourse />,
  },
  {
    path: "/courses/:id_course/lesson/:id_lesson",
    element: <EditLesson />,
  },
];

export default CourseRouter;
