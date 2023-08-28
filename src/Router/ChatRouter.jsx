import React from "react";
import ChatPage from "../Pages/Messanger/ChatPage";
import ChatPageFirst from "../Pages/Messanger/ChatPageFirst";

const ChatRouter = [
  {
    path: "/chat",
    element: <ChatPage />,
  },

  {
    path: "/chat-user/:module/:companyId/:projectId",
    element: <ChatPageFirst />,
  },

  // {
  //   path: "/chat-user/:id",
  //   element: <ChatUserPage />,
  // },



];

export default ChatRouter;
