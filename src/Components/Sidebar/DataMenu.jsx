import {
  FcCalendar,
  FcComments,
  FcConferenceCall,
  FcEditImage,
  FcKindle,
  FcLineChart,
  FcSettings,
  FcShare,
  FcSms,
  FcSurvey,
} from "react-icons/fc";

export const data = [
  {
    name: "Pipeline",
    icon: FcKindle,
    submenu: [
      { name: "Pipeline", icon: FcEditImage, link: "/pipeline" },
      { name: "Settings", icon: FcSettings, link: "/chat" },
    ],
  },
  {
    name: "Chat",
    icon: FcSms,
    submenu: [
      { name: "Chat", icon: FcEditImage, link: "/chat" },
      { name: "WhatsApp Settings", icon: FcSettings, link: "/chat" },
      { name: "Marketplace Settings", icon: FcSettings, link: "/chat" },
      { name: "Webchat Settings", icon: FcSettings, link: "/chat" },
    ],
  },
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
      { name: "Form", icon: FcCalendar, link: "/form" },
      { name: "Settings", icon: FcComments, link: "/settings" },
    ],
  },
];
