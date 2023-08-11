import React from "react";
import ChatPage from "../Pages/Messanger/ChatPage";
import ChatPageFirst from "../Pages/Messanger/ChatPageFirst";
import ChatUserPage from "../Pages/Messanger/ChatUserPage";

const ChatRouter = [
  {
    path: "/chat",
    element: <ChatPage />,
  },

  {
    path: "/chat-user",
    element: <ChatPageFirst />,
  },

  {
    path: "/chat-user/:id",
    element: <ChatUserPage />,
  },



];

export default ChatRouter;
