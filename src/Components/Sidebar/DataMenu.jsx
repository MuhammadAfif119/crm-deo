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
          }

        ]
      },

      {
        name: "Calendar",
        status: "Coming Soon",
        icon: FcCalendar,
        link: "/",
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
        name: "AI",
        icon: FcMindMap,
        link: "https://ai.deoapp.com/",
        description:
          "Simplifies the AI journey and enables you to harness the benefits of AI for your specific needs",
        submenu: [
          {
            name: "Page Builder",
            icon: FcFrame,
            link: "https://ai.deoapp.com/funnel",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "Text AI",
            icon: FcKindle,
            link: "https://ai.deoapp.com/folder-aissistant/:name",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "Image AI",
            icon: FcPicture,
            link: "https://ai.deoapp.com/image-generator",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "Audio AI",
            icon: FcSpeaker,
            link: "https://ai.deoapp.com/create-aissistant",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "Video AI",
            icon: FcFilmReel,
            link: "https://ai.deoapp.com/video/templates",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "Marketer AI",
            icon: FcBullish,
            link: "https://ai.deoapp.com/create-aimarketer",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "Train Your AI",
            icon: FcReading,
            link: "https://ai.deoapp.com/lptrain",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

          {
            name: "Templates",
            icon: FcFilingCabinet,
            link: "https://ai.deoapp.com/template-web",
            description:
              "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
          },

        ]
      },
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
          }
        ]
      },

      {
        name: "Chat",
        icon: FcSms,
        link: "/chat",
        description: "Real-time communication, engage with your clients seamlessly",
      },

      { name: "Courses", icon: FcIdea, link: "/courses" },

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

        ]
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

        ]
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

        ]
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

        ]
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
    name: "Warehouse",
    status: "Coming Soon",
    icon: FcPackage,
    link: "/",
    description:
      "Enhance warehouse operations, simplifies inventory management, order processing, and logistics tracking, ensuring efficient and error-free warehouse processes.",
  },


  {
    name: "Exim",
    status: "Coming Soon",
    icon: FcShipped,
    link: "https://www.importir.com/",
    description:
      "Simplifies order tracking, customs compliance, and inventory management, all while providing critical data insights to enhance efficiency and reduce costs.",
  },



  // batas sampai sini



  // {
  //   name: "HRIS",
  //   icon: FcCollaboration,
  //   link: "/hris",
  //   description:
  //     "All-in-one HRIS solution that simplifies HR tasks, enhances compliance, and provides valuable data-driven insights for strategic decision-making.",
  //   submenu: [
  //     {
  //       name: "HRIS",
  //       icon: FcManager,
  //       link: "https://recruitment.deoapp.com/",
  //     },
  //     {
  //       name: "Recruitment",
  //       icon: FcConferenceCall,
  //       link: "https://recruitment.deoapp.com/",
  //     },
  //   ],
  // },
  // {
  //   name: "Accounting",
  //   icon: FcCurrencyExchange,
  //   link: "https://accounting-deoapps.web.app/",
  //   description:
  //     "Transform financial operations, streamlining tasks, ensuring compliance while providing valuable data-driven insights for informed financial decisions.",
  // },
  // {
  //   name: "Finance",
  //   icon: FcMoneyTransfer,
  //   link: " https://anggaran-v2.web.app/",
  //   description:
  //     "The definitive finance solution, offering a comprehensive suite of tools and features to elevate your financial business.",
  // },

  // {
  //   name: "Productivity",
  //   icon: FcSportsMode,
  //   link: "https://productivity.deoapp.com/",
  //   description:
  //     "Elevate business efficiency, simplifying task management, collaboration, and scheduling to drive informed decisions and boost productivity.",
  // },

  // {
  //   name: "RMS",
  //   icon: FcShop,
  //   link: "/rms",
  //   description:
  //     "Elevate restaurant operations with streamlined order and inventory management, and menu updates for enhanced efficiency and customer satisfaction.",
  // },



  // {
  //   name: "CRM",
  //   icon: FcOnlineSupport,
  //   link: "/crm",
  //   description:
  //     "Optimize customer relationships, simplifies customer data management, and provides valuable insights to drive informed decisions and boost customer satisfaction.",
  //   submenu: [
  //     { name: "Pageview", icon: FcHome, link: "/crm/pageview" },
  //     { name: "Contacts", icon: FcContacts, link: "/contacts" },
  //     { name: "Pipeline", icon: FcKindle, link: "/pipelineHome" },
  //     { name: "Products", icon: FcConferenceCall, link: "/productHome" },
  //     { name: "Configuration", icon: FcSettings, link: "/configuration" },
  //   ],
  // },
  // {
  //   name: "LMS",
  //   icon: FcReading,
  //   link: "/lms",
  //   description:
  //     "Organize your own pageview webapp with ease.",
  //   submenu: [
  //     { name: "Courses", icon: FcIdea, link: "/courses" },
  //   ],
  // },

  // {
  //   name: "AI",
  //   icon: FcMindMap,
  //   link: "https://ai.deoapp.com/",
  //   description:
  //     "Simplifies the AI journey and enables you to harness the benefits of AI for your specific needs",
  // },

  // {
  //   name: "Chat",
  //   icon: FcSms,
  //   link: "/chat",
  //   description: "Real-time communication, engage with your clients seamlessly",
  // },

  // {
  //   name: "Importir",
  //   status: "Coming Soon",
  //   icon: FcShipped,
  //   link: "https://www.importir.com/",
  //   description:
  //     "Simplifies order tracking, customs compliance, and inventory management, all while providing critical data insights to enhance efficiency and reduce costs.",
  // },

  // {
  //   name: "Calendar",
  //   status: "Coming Soon",
  //   icon: FcCalendar,
  //   link: "/",
  //   description:
  //     "Optimize time management, simplifies scheduling, enhances collaboration, and provides valuable insights for increased productivity and organization.",
  // },

  // {
  //   name: "WMS",
  //   status: "Coming Soon",
  //   icon: FcPackage,
  //   link: "/",
  //   description:
  //     "Enhance warehouse operations, simplifies inventory management, order processing, and logistics tracking, ensuring efficient and error-free warehouse processes.",
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
      // { name: "Team", icon: FcCollaboration, link: "/configuration/team" },
      { name: "Project", icon: FcBriefcase, link: "/configuration/project" },
      { name: "Office / Outlet", icon: FcShop, link: "/configuration/outlet" },
    ],
  },
];
