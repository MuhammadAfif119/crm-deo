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
  FcSelfie,
  FcSelfServiceKiosk,
  FcCurrencyExchange,
  FcSportsMode,
  FcOnlineSupport,
  FcMindMap,
  FcShipped,
  FcContacts,
  FcManager,
} from "react-icons/fc";

export const data = [
  {
    name: "HRIS",
    icon: FcCollaboration,
    link: "/hris",
    description:
      "All-in-one HRIS solution that simplifies HR tasks, enhances compliance, and provides valuable data-driven insights for strategic decision-making.",
    submenu: [
      {
        name: "HRIS",
        icon: FcManager,
        link: "https://recruitment.deoapp.com/",
      },
      {
        name: "Recruitment",
        icon: FcConferenceCall,
        link: "https://recruitment.deoapp.com/",
      },
    ],
  },
  {
    name: "Accounting",
    icon: FcCurrencyExchange,
    link: " https://anggaran-v2.web.app/",
    description:
      "Transform financial operations, streamlining tasks, ensuring compliance while providing valuable data-driven insights for informed financial decisions.",
  },
  {
    name: "Finance",
    icon: FcMoneyTransfer,
    link: " https://anggaran-v2.web.app/",
    description:
      "The definitive finance solution, offering a comprehensive suite of tools and features to elevate your financial business.",
  },

  {
    name: "Productivity",
    icon: FcSportsMode,
    link: "https://productivity.deoapp.com/",
    description:
      "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
  },

  {
    name: "RMS",
    icon: FcShop,
    link: "https://rms.deoapp.com/",
    description:
      "Elevate restaurant operations with streamlined order and inventory management, and menu updates for enhanced efficiency and customer satisfaction.",
  },

  {
    name: "CRM",
    icon: FcOnlineSupport,
    link: "/crm",
    description:
      "Optimize customer relationships, simplifies customer data management, and provides valuable insights to drive informed decisions and boost customer satisfaction.",
  },
  {
    name: "AI",
    icon: FcMindMap,
    link: "https://ai.deoapp.com/",
    description:
      "Simplifies the AI journey and enables you to harness the benefits of AI for your specific needs",
  },

  {
    name: "Importir",
    status: "Coming Soon",
    icon: FcShipped,
    link: "https://www.importir.com/",
    description:
      "Simplifies order tracking, customs compliance, and inventory management, all while providing critical data insights to enhance efficiency and reduce costs.",
  },

  {
    name: "Chat",
    icon: FcSms,
    link: "/chat",
    description: "Real-time communication, engage with your clients seamlessly",
    // submenu: [
    //   { name: "Chat", icon: FcEditImage, link: "/chat" },
    //   { name: "WhatsApp Settings", icon: FcSettings, link: "/chat-user" },
    //   { name: "Marketplace Settings", icon: FcSettings, link: "/chat" },
    //   { name: "Webchat Settings", icon: FcSettings, link: "/chat" },
    // ],
  },

  {
    name: "Calendly",
    status: "Coming Soon",
    icon: FcCalendar,
    link: "/",
    description:
      "Optimize time management, simplifies scheduling, enhances collaboration, and provides valuable insights for increased productivity and organization.",
    // submenu: [
    //   { name: "Chat", icon: FcEditImage, link: "/chat" },
    //   { name: "WhatsApp Settings", icon: FcSettings, link: "/chat-user" },
    //   { name: "Marketplace Settings", icon: FcSettings, link: "/chat" },
    //   { name: "Webchat Settings", icon: FcSettings, link: "/chat" },
    // ],
  },

  {
    name: "WMS",
    status: "Coming Soon",
    icon: FcPackage,
    link: "/",
    description:
      "Enhance warehouse operations, simplifies inventory management, order processing, and logistics tracking, ensuring efficient and error-free warehouse processes.",
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

  // {
  //   name: "Chat",
  //   icon: FcSms,
  //   link: "/chat",
  //   description: "Real-time communication, engage with your clients seamlessly",
  //   submenu: [
  //     { name: "Chat", icon: FcEditImage, link: "/chat" },
  // { name: "WhatsApp Settings", icon: FcSettings, link: "/chat-user" },
  // { name: "Marketplace Settings", icon: FcSettings, link: "/chat" },
  // { name: "Webchat Settings", icon: FcSettings, link: "/chat" },
  //   ],
  // },

  // {
  //   name: "Pipeline",
  //   icon: FcKindle,
  //   link: "/pipelineHome",
  //   description: "Effortless Progress Tracking with our Pipeline Feature",
  //   submenu: [
  //     { name: "Pipeline", icon: FcEditImage, link: "/pipeline" },
  //     { name: "Orders", icon: FcInTransit, link: "/orders" },
  //   ],
  // },
  // {
  //   name: "Products",
  //   icon: FcConferenceCall,
  //   link: "/productHome",
  //   description:
  //     "Discover and Manage Your Offerings with Ease: The Product Menu",
  //   submenu: [
  //     { name: "Products", icon: FcDeployment, link: "/products" },
  //     { name: "Tickets", icon: FcPackage, link: "/ticket" },
  //     { name: "Membership", icon: FcLike, link: "/membership" },
  //     { name: "Forms", icon: FcSurvey, link: "/form-builder" },
  //     { name: "Listings", icon: FcParallelTasks, link: "/listing" },
  //     { name: "News", icon: FcNews, link: "/news" },
  //     { name: "Pages", icon: FcRules, link: "/products/articles" },
  //   ],
  // },

  // {
  //   name: "LMS",
  //   icon: FcReading,
  //   link: "/lmsHome",
  //   description: "Organize your own pageview webapp with ease",
  //   submenu: [
  //     // { name: "Dashboard", icon: FcMoneyTransfer, link: "/learning/dashboard" },
  //     { name: "Courses", icon: FcIdea, link: "/courses" },
  //   ],
  // },
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
  // {
  //   name: "Configuration",
  //   icon: FcSettings,
  //   link: "/configuration",
  //   description:
  //     "Fine-tune your CRM system to match your unique needs. Personalize workflows, data fields, and user permissions effortlessly.",
  //   submenu: [
  //     {
  //       name: "Themes",
  //       icon: FcCloseUpMode,
  //       link: "/themes",
  //     },
  //     { name: "Data", icon: FcFile, link: "/configuration/data" },
  //     { name: "Domain", icon: FcGlobe, link: "/configuration/domain" },
  //     {
  //       name: "Integration",
  //       icon: FcAutomatic,
  //       link: "/configuration/integration",
  //     },
  //     {
  //       name: "Backup",
  //       icon: FcEnteringHeavenAlive,
  //       link: "/configuration/backup",
  //     },
  //     { name: "Company", icon: FcOrganization, link: "/configuration/user" },
  //     { name: "Team", icon: FcCollaboration, link: "/configuration/team" },
  //     { name: "Project", icon: FcBriefcase, link: "/configuration/project" },
  //     { name: "Outlet", icon: FcShop, link: "/configuration/outlet" },
  //   ],
  // },

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

export const dataMenuCRM = [
  {
    name: "Pageview",
    icon: FcHome,
    link: "/crm/pageview",
    description: "Adjust and costumize your pageview",
    // submenu: [
    //   { name: "Pipeline", icon: FcEditImage, link: "/pipeline" },
    //   { name: "Orders", icon: FcInTransit, link: "/orders" },
    // ],
  },
  {
    name: "Contacts",
    icon: FcContacts,
    link: "/contacts",
    description: "Effortless Get In Touch with your costumers",
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
      // { name: "Dashboard", icon: FcMoneyTransfer, link: "/learning/dashboard" },
      { name: "Courses", icon: FcIdea, link: "/courses" },
    ],
  },

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
];
