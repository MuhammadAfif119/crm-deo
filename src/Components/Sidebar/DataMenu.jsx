import {
  FcCalendar,
  FcComments,
  FcConferenceCall,
  FcEditImage,
  FcKindle,
  FcLineChart,
  FcNews,
  FcSettings,
  FcSms,
  FcSurvey,
  FcParallelTasks,
  FcPackage,
  FcGlobe,
  FcBusinessContact,
  FcAutomatic,
  FcBriefcase,
  FcShop,
  FcLibrary,
  FcCollaboration,
  FcCustomerSupport,
  FcFile,
  FcLike,
  FcDeployment,
  FcInTransit,
  FcEnteringHeavenAlive,
  FcRules,
  FcCloseUpMode,
  FcReading,
  FcMoneyTransfer,
  FcIdea,
  FcOrganization,
  FcHome,
} from "react-icons/fc";

export const data = [
  {
    name: "Home",
    icon: FcHome,
    link: "/home",
    description:
    "Access your profile pageview.",
  },

  {
    name: "Contacts",
    icon: FcBusinessContact,
    link: "/contacts",
    description:
      "Organize and access all your important contacts, track communications, set reminders, and ensure you never lose touch with your clients.",
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
    link: "/chat",
    description: "Real-time communication, engage with your clients seamlessly",
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
    link: "/pipelineHome",
    description: "Effortless Progress Tracking with our Pipeline Feature",
    submenu: [
      { name: "Pipeline", icon: FcEditImage, link: "/pipeline" },
      { name: "Orders", icon: FcInTransit, link: "/orders" },
    ],
  },
  {
    name: "Products",
    icon: FcConferenceCall,
    link: "/productHome",
    description:
      "Discover and Manage Your Offerings with Ease: The Product Menu",
    submenu: [
      { name: "Products", icon: FcDeployment, link: "/products" },
      { name: "Tickets", icon: FcPackage, link: "/ticket" },
      { name: "Membership", icon: FcLike, link: "/membership" },
      { name: "Forms", icon: FcSurvey, link: "/form-builder" },
      { name: "Listings", icon: FcParallelTasks, link: "/listing" },
      { name: "News", icon: FcNews, link: "/news" },
      { name: "Pages", icon: FcRules, link: "/products/articles" },
    ],
  },

  {
    name: "LMS",
    icon: FcReading,
    link: "/lmsHome",
    description: "Organize your own pageview webapp with ease",
    submenu: [
      { name: "Dashboard", icon: FcMoneyTransfer, link: "/learning/dashboard" },
      { name: "Courses", icon: FcIdea, link: "/courses" },
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
    link: "/configuration",
    description:
      "Fine-tune your CRM system to match your unique needs. Personalize workflows, data fields, and user permissions effortlessly.",
    submenu: [
      {
        name: "Themes",
        icon: FcCloseUpMode,
        link: "/themes",
      },
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
      { name: "Company", icon: FcOrganization, link: "/configuration/user" },
      { name: "Team", icon: FcCollaboration, link: "/configuration/team" },
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

  // {
  //   name: "Learning",
  //   icon: FcIdea,
  //   submenu: [
  //     { name: "Dashboard", icon: FcMoneyTransfer, link: "/learning/dashboard" },
  //     { name: "Courses", icon: FcReading, link: "/courses" },
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
