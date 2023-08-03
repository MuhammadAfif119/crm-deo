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
  FcCloseUpMode,
  FcPodiumWithSpeaker,
  FcParallelTasks,
  FcPackage,
  FcDatabase,
  FcGlobe,
  FcContacts,
  FcBusinessContact,
  FcAutomatic,
  FcBriefcase,
  FcShop
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
  // {
  //   name: "Social Media",
  //   icon: FcPodiumWithSpeaker,
  //   submenu: [
  //     { name: "Create Post", icon: FcEditImage, link: "/" },
  //     { name: "Calendar", icon: FcCalendar, link: "/calendar" },
  //     { name: "Comments", icon: FcComments, link: "/comment" },
  //     { name: "Reports", icon: FcLineChart, link: "/reports" },
  //     { name: "Social Accounts", icon: FcShare, link: "/social-account" },
  //   ],
  // },
  {
    name: "Dashboard",
    icon: FcDatabase,
    link: '/'
  },
  {
    name: "Contacts",
    icon: FcBusinessContact,
    link: '/contacts'
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
    name: "Products",
    icon: FcConferenceCall,
    submenu: [
      { name: "Form", icon: FcSurvey, link: "/form-builder" },
      { name: "Tickets", icon: FcPackage, link: "/ticket" },
      { name: "Listing", icon: FcParallelTasks, link: "/listing" },
      { name: "News", icon: FcNews, link: "/news" },
    ],
  },
  // {
  //   name: "Form",
  //   icon: FcSurvey,
  //   submenu: [
  //     { name: "Form", icon: FcCalendar, link: "/form-builder" },
  //   ],
  // },

  // {
  //   name: "Listing",
  //   icon: FcConferenceCall,
  //   submenu: [
  //     { name: "Listing", icon: FcEditImage, link: "/listing" },
  //   ],
  // },
  // {
  //   name: "News",
  //   icon: FcNews,
  //   submenu: [
  //     { name: "News", icon: FcEditImage, link: "/news" },
  //   ],
  // },
  {
    name: "Pipeline",
    icon: FcKindle,
    submenu: [
      { name: "Pipeline", icon: FcEditImage, link: "/pipeline" },
      { name: "Membership", icon: FcSettings, link: "/chat" },
    ],
  },
  {
    name: "Configuration",
    icon: FcSettings,
    submenu: [
      { name: "Domain", icon: FcGlobe, link: "/configuration/domain" },
      { name: "Integration", icon: FcAutomatic, link: "/configuration/integration" },
      { name: "Project", icon: FcBriefcase, link: "/configuration/project" },
      { name: "Outlet", icon: FcShop, link: "/configuration/outlet" },
    ],
  },


  // {
  //   name: "Event",
  //   icon: FcCloseUpMode,
  //   submenu: [
  //     { name: "Ticketing", icon: FcEditImage, link: "/ticket" },
  //   ],
  // },
];
