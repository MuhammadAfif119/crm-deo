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
  FcOrganization,
  FcHome,
  FcCurrencyExchange,
  FcMindMap,
  FcShipped,
  FcContacts,
  FcManager,
  FcPieChart,
  FcPaid,
  FcIdea,
  FcTreeStructure,
  FcSportsMode,
  FcAdvertising,
  FcAssistant,
  FcDepartment,
  FcDisplay,
  FcBarChart,
  FcDocument,
  FcOpenedFolder,
  FcWorkflow,
  FcFrame,
  FcPicture,
  FcSpeaker,
  FcFilmReel,
  FcBullish,
  FcFilingCabinet,
  FcBusinessman,
  FcDiploma2,
  FcTwoSmartphones,
  FcEngineering,
  FcBusiness,
  FcViewDetails,
  FcMusic,
  FcMultipleCameras,
  FcList,
  FcRightDown2,
  FcRightUp2,
  FcTimeline,
  FcProcess,
  FcBiohazard,
  FcFactory,
  FcClearFilters,
  FcClock,
  FcStatistics,
  FcDataSheet,
} from "react-icons/fc";

export const data = [
  {
    name: "Dashboard",
    icon: FcPieChart,
    link: "/",
    description:
      "Transform financial operations, streamlining tasks, ensuring compliance while providing valuable data-driven insights for informed financial decisions.",
  },

  {
    name: "Management",
    icon: FcTreeStructure,
    link: "/management",
    description:
      "Transform financial operations, streamlining tasks, ensuring compliance while providing valuable data-driven insights for informed financial decisions.",
    submenu: [
      {
        name: "Productivity",
        icon: FcSportsMode,
        link: "https://productivity.deoapp.com/",
        description:
          "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
        submenu: [
          {
            name: "Dashboard",
            icon: FcDepartment,
            link: "https://productivity.deoapp.com/",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
          {
            name: "Scoreboard",
            icon: FcDisplay,
            link: "https://productivity.deoapp.com/scoreboard",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
          {
            name: "Kanban",
            icon: FcBarChart,
            link: "https://productivity.deoapp.com/kanban",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
          {
            name: "Docs & Files",
            icon: FcDocument,
            link: "https://productivity.deoapp.com/docs",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
          {
            name: "Digital Assets",
            icon: FcOpenedFolder,
            link: "https://productivity.deoapp.com/assets",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
          {
            name: "Mind Map",
            icon: FcMindMap,
            link: "https://productivity.deoapp.com/mindmap",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
          {
            name: "Flow chart",
            icon: FcWorkflow,
            link: "https://productivity.deoapp.com/flowchart",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
        ],
      },

      {
        name: "Calendar",
        status: "Coming Soon",
        icon: FcCalendar,
        link: "/calendar",
      },
    ],
  },

  {
    name: "Marketing",
    icon: FcAdvertising,
    link: "/marketing",
    description:
      "Transform financial operations, streamlining tasks, ensuring compliance while providing valuable data-driven insights for informed financial decisions.",
    submenu: [
      {
        name: "Social media",
        icon: FcManager,
        link: "/socialmedia",
      },

      {
        name: "Affiliate",
        icon: FcTwoSmartphones,
        link: "https://ai.deoapp.com/",
      },

      {
        name: "Landing Page",
        icon: FcFrame,
        link: "/marketing/funnel",
      },

      // {
      //   name: "AI",
      //   icon: FcMindMap,
      //   link: "https://ai.deoapp.com/",
      //   description:
      //     "Simplifies the AI journey and enables you to harness the benefits of AI for your specific needs",
      //   submenu: [
      //     {
      //       name: "Page Builder",
      //       icon: FcFrame,
      //       link: "https://ai.deoapp.com/funnel",
      //       description:
      //         "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
      //     },

      //     {
      //       name: "Text AI",
      //       icon: FcKindle,
      //       link: "https://ai.deoapp.com/folder-aissistant/:name",
      //       description:
      //         "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
      //     },

      //     {
      //       name: "Image AI",
      //       icon: FcPicture,
      //       link: "https://ai.deoapp.com/image-generator",
      //       description:
      //         "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
      //     },

      //     {
      //       name: "Audio AI",
      //       icon: FcSpeaker,
      //       link: "https://ai.deoapp.com/create-aissistant",
      //       description:
      //         "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
      //     },

      //     {
      //       name: "Video AI",
      //       icon: FcFilmReel,
      //       link: "https://ai.deoapp.com/video/templates",
      //       description:
      //         "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
      //     },

      //     {
      //       name: "Marketer AI",
      //       icon: FcBullish,
      //       link: "https://ai.deoapp.com/create-aimarketer",
      //       description:
      //         "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
      //     },

      //     {
      //       name: "Train Your AI",
      //       icon: FcReading,
      //       link: "https://ai.deoapp.com/lptrain",
      //       description:
      //         "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
      //     },

      //     {
      //       name: "Templates",
      //       icon: FcFilingCabinet,
      //       link: "https://ai.deoapp.com/template-web",
      //       description:
      //         "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
      //     },
      //   ],
      // },
    ],
  },

  {
    name: "Sales",
    icon: FcAssistant,
    link: "/sales",
    description:
      "Transform financial operations, streamlining tasks, ensuring compliance while providing valuable data-driven insights for informed financial decisions.",
    submenu: [
      {
        name: "CRM",
        icon: FcManager,
        link: "/crm",
        submenu: [
          {
            name: "Website",
            icon: FcHome,
            link: "/crm/website",
            description: "Adjust and costumize your website",
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
            link: "/pipeline",
            description:
              "Effortless Progress Tracking with our Pipeline Feature",
          },
          {
            name: "Orders",
            icon: FcInTransit,
            link: "/orders",
            description:
              "Effortless Progress Tracking with our Pipeline Feature",
          },
        ],
      },

      {
        name: "Chat",
        icon: FcSms,
        link: "/chat",
        description:
          "Real-time communication, engage with your clients seamlessly",
      },

      {
        name: "Products",
        icon: FcConferenceCall,
        link: "/product",
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
          { name: "Courses", icon: FcIdea, link: "/courses" },
        ],
      },
    ],
  },

  {
    name: "Finance",
    icon: FcMoneyTransfer,
    link: " https://anggaran-v2.web.app/",
    description:
      "The definitive finance solution, offering a comprehensive suite of tools and features to elevate your financial business.",
  },

  {
    name: "Accounting",
    icon: FcCurrencyExchange,
    link: "https://accounting-deoapps.web.app/",
    description:
      "Transform financial operations, streamlining tasks, ensuring compliance while providing valuable data-driven insights for informed financial decisions.",
  },

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
        submenu: [
          {
            name: "Attandance",
            icon: FcSurvey,
            link: "https://ai.deoapp.com/funnel",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "E-learning",
            icon: FcConferenceCall,
            link: "https://ai.deoapp.com/funnel",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "Payroll",
            icon: FcCurrencyExchange,
            link: "https://ai.deoapp.com/funnel",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "Announcement",
            icon: FcPackage,
            link: "https://ai.deoapp.com/funnel",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
        ],
      },
      {
        name: "Recruitment",
        icon: FcConferenceCall,
        link: "https://recruitment.deoapp.com/",
        submenu: [
          {
            name: "Wealth Dynamic",
            icon: FcFrame,
            link: "https://recruitment-deoapp.firebaseapp.com/wealth-dynamic#",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "Jobs",
            icon: FcBriefcase,
            link: "https://recruitment-deoapp.firebaseapp.com/jobs",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "Profile",
            icon: FcBusinessman,
            link: "https://recruitment-deoapp.firebaseapp.com/profile",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "Assesment",
            icon: FcDiploma2,
            link: "https://recruitment-deoapp.firebaseapp.com/assessments",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
        ],
      },
    ],
  },

  {
    name: "Outlet",
    icon: FcShop,
    link: "/rms",
    description:
      "Elevate restaurant operations with streamlined order and inventory management, and menu updates for enhanced efficiency and customer satisfaction.",
    submenu: [
      {
        name: "Transaction",
        icon: FcBusinessContact,
        link: "https://rms.deoapp.com/trasaction",
      },
      {
        name: "Reports",
        icon: FcRules,
        link: "https://rms.deoapp.com/reports",
      },

      {
        name: "Inventory",
        icon: FcFactory,
        link: "https://rms.deoapp.com/warehouse",
        submenu: [
          {
            name: "Menu",
            icon: FcLike,
            link: "https://rms.deoapp.com/menus",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
          {
            name: "Waste Food",
            icon: FcClearFilters,
            link: "https://rms.deoapp.com/wastefood",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
          {
            name: "Stock",
            icon: FcSurvey,
            link: "https://rms.deoapp.com/funnel",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
          {
            name: "Supplier",
            icon: FcConferenceCall,
            link: "https://rms.deoapp.com/suppliers",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
          {
            name: "Activity",
            icon: FcClock,
            link: "https://rms.deoapp.com/activity",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
        ],
      },

      {
        name: "Restaurant",
        icon: FcStatistics,
        link: "https://rms.deoapp.com/",
        submenu: [
          {
            name: "Outlets",
            icon: FcShop,
            link: "https://rms.deoapp.com/outlets",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
          {
            name: "Orders",
            icon: FcDataSheet,
            link: "https://rms.deoapp.com/orders",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
          {
            name: "Stations",
            icon: FcCalendar,
            link: "https://rms.deoapp.com/stations",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },
        ],
      },
    ],
  },

  {
    name: "Operation",
    icon: FcEngineering,
    link: "/operation",
    description:
      "All-in-one HRIS solution that simplifies HR tasks, enhances compliance, and provides valuable data-driven insights for strategic decision-making.",
    submenu: [
      {
        name: "Production",
        icon: FcProcess,
        link: "/production",
        submenu: [
          {
            name: "Line",
            icon: FcTimeline,
            link: "/production/line",
          },
        ],
      },
    ],
  },

  {
    name: "Warehouse",
    icon: FcPackage,
    link: "/warehouse",
    description:
      "Enhance warehouse operations, simplifies inventory management, order processing, and logistics tracking, ensuring efficient and error-free warehouse processes.",
    submenu: [
      {
        name: "Inbound",
        icon: FcRightDown2,
        link: "/inbound",
      },
      {
        name: "Stock",
        icon: FcViewDetails,
        link: "/stock",
        submenu: [
          {
            name: "Rak",
            icon: FcBusiness,
            link: "/stock/rak",
          },
        ],
      },
      {
        name: "Outbond",
        icon: FcRightUp2,
        link: "/outbond",
      },
    ],
  },

  {
    name: "GA",
    icon: FcPaid,
    status: "Coming Soon",
    link: "/",
    description:
      "Transform financial operations, streamlining tasks, ensuring compliance while providing valuable data-driven insights for informed financial decisions.",
  },

  {
    name: "Export Import",
    status: "Coming Soon",
    icon: FcShipped,
    link: "https://www.importir.com/",
    description:
      "Simplifies order tracking, customs compliance, and inventory management, all while providing critical data insights to enhance efficiency and reduce costs.",
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
      { name: "Project", icon: FcBriefcase, link: "/configuration/project" },
      { name: "Office / Outlet", icon: FcShop, link: "/configuration/outlet" },
    ],
  },

  // batas sampai sini
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
    name: "Website",
    icon: FcHome,
    link: "/crm/website",
    description: "Adjust and costumize your Website",
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
    name: "Orders",
    icon: FcInTransit,
    link: "/orders",
    description: "Effortless Progress Tracking with our Pipeline Feature",
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
      { name: "Project", icon: FcBriefcase, link: "/configuration/project" },
      { name: "Office / Outlet", icon: FcShop, link: "/configuration/outlet" },
    ],
  },
];

export const dataMenuProducts = [
  {
    name: "Products",
    icon: FcConferenceCall,
    link: "/product",
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
      { name: "Courses", icon: FcIdea, link: "/courses" },
    ],
  },
];

export const dataMenuProduction = [
  {
    name: "Production",
    icon: FcProcess,
    link: "/production",
    submenu: [
      {
        name: "Line",
        icon: FcTimeline,
        link: "/production/line",
      },
    ],
  },
];
