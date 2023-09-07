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
  FcParallelTasks,
  FcPackage,
  FcGlobe,
  FcContacts,
  FcBusinessContact,
  FcAutomatic,
  FcBriefcase,
  FcShop,
  FcLibrary,
  FcCollaboration,
  FcDisplay,
  FcCustomerSupport,
  FcFile,
  FcLike,
  FcPodiumWithSpeaker,
  FcDeployment,
  FcInTransit,
  FcEnteringHeavenAlive,
} from "react-icons/fc";

export const data = [
  {
    name: "Scoreboard",
    icon: FcDisplay,
    link: "/",
  },

  {
    name: "Contacts",
    icon: FcBusinessContact,
    link: "/contacts",
  },

  // {
  //   name: "Social Media",
  //   icon: FcPodiumWithSpeaker,
  //   submenu: [
  //     { name: "Create Post", icon: FcEditImage, link: "/create-post" },
  //     { name: "Calendar", icon: FcCalendar, link: "/calendar" },
  //     { name: "Comments", icon: FcComments, link: "/comment" },
  //     { name: "Reports", icon: FcLineChart, link: "/reports" },
  //     { name: "Social Accounts", icon: FcShare, link: "/social-account" },
  //   ],
  // },

  {
    name: "Chat",
    icon: FcSms,
    submenu: [
      { name: "Chat", icon: FcEditImage, link: "/chat" },
      // { name: "WhatsApp Settings", icon: FcSettings, link: "/chat-user" },
      // { name: "Marketplace Settings", icon: FcSettings, link: "/chat" },
      // { name: "Webchat Settings", icon: FcSettings, link: "/chat" },
    ],
  },

  {
    name: "Pipeline",
    icon: FcKindle,
    submenu: [
      { name: "Pipeline", icon: FcEditImage, link: "/pipeline" },
      { name: "Orders", icon: FcInTransit, link: "/orders" },
    ],
  },
  {
    name: "Products",
    icon: FcConferenceCall,
    submenu: [
      { name: "Products", icon: FcDeployment, link: "/products" },
      { name: "Tickets", icon: FcPackage, link: "/ticket" },
      { name: "Membership", icon: FcLike, link: "/membership" },
      { name: "Forms", icon: FcSurvey, link: "/form-builder" },
      { name: "Listings", icon: FcParallelTasks, link: "/listing" },
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
  // {
  //   name: "Pipeline",
  //   icon: FcKindle,
  //   submenu: [
  //     { name: "Pipeline", icon: FcEditImage, link: "/pipeline" },
  //     { name: "Membership", icon: FcSettings, link: "/chat" },
  //   ],
  // },
  {
    name: "Configuration",
    icon: FcSettings,
    submenu: [
      { name: "Data", icon: FcFile, link: "/configuration/data" },
      { name: "Domain", icon: FcGlobe, link: "/configuration/domain" },
      {
        name: "Integration",
        icon: FcAutomatic,
        link: "/configuration/integration",
      },
      {
        name: "Backup",
        icon: FcEnteringHeavenAlive,
        link: "/configuration/backup",
      },
      { name: "User", icon: FcConferenceCall, link: "/configuration/user" },
      { name: "Outlet", icon: FcShop, link: "/configuration/outlet" },
      { name: "Project", icon: FcBriefcase, link: "/configuration/project" },
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

export const dataApps = [
  {
    name: "AI",
    icon: FcCustomerSupport,
    link: "https://ai.deoapp.com/",
  },
  {
    name: "LMS",
    icon: FcLibrary,
    link: "https://lms.deoapp.com/",
  },
  {
    name: "HR",
    icon: FcCollaboration,
    link: "https://recruitment-deoapp.web.app/",
  },
  {
    name: "RMS",
    icon: FcShop,
    link: "https://rms.deoapp.com/",
  },
];
