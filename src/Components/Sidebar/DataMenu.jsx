import {
  FcCalendar,
  FcComments,
  FcConferenceCall,
  FcEditImage,
  FcKindle,
  FcLineChart,
  FcNews,
  FcSettings,
  FcShare,
  FcSms,
  FcSurvey,
  FcCloseUpMode
} from "react-icons/fc";

export const data = [

  // {
  //   name: "Chat",
  //   icon: FcSms,
  //   submenu: [
  //     { name: "Chat", icon: FcEditImage, link: "/chat" },
  //     { name: "WhatsApp Settings", icon: FcSettings, link: "/chat" },
  //     { name: "Marketplace Settings", icon: FcSettings, link: "/chat" },
  //     { name: "Webchat Settings", icon: FcSettings, link: "/chat" },
  //   ],
  // },
  {
    name: "Social Media",
    icon: FcConferenceCall,
    submenu: [
      { name: "Create Post", icon: FcEditImage, link: "/" },
      { name: "Calendar", icon: FcCalendar, link: "/calendar" },
      { name: "Comments", icon: FcComments, link: "/comment" },
      { name: "Reports", icon: FcLineChart, link: "/reports" },
      { name: "Social Accounts", icon: FcShare, link: "/social-account" },
    ],
  },
  {
    name: "Form",
    icon: FcSurvey,
    submenu: [
      { name: "Form", icon: FcCalendar, link: "/form-builder" },
    ],
  },

  {
    name: "Listing",
    icon: FcConferenceCall,
    submenu: [
      { name: "Listing", icon: FcEditImage, link: "/listing" },
    ],
  },
  {
    name: "News",
    icon: FcNews,
    submenu: [
      { name: "News", icon: FcEditImage, link: "/news" },
    ],
  },
  {
    name: "Pipeline",
    icon: FcKindle,
    submenu: [
      { name: "Pipeline", icon: FcEditImage, link: "/pipeline" },
      { name: "Membership", icon: FcSettings, link: "/chat" },
    ],
  },
  {
    name: "Event",
    icon: FcCloseUpMode,
    submenu: [
      { name: "Ticketing", icon: FcEditImage, link: "/ticket" },
    ],
  },
];
