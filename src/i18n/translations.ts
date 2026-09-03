export type Language = "es" | "en";

export const translations = {
  es: {
    common: {
      startNow: "Solicitar acceso",
      login: "Iniciar sesión",
      viewPlatform: "Ver plataforma",
      comingSoon: "Próximamente",
    },
    nav: {
      home: "Inicio",
      platform: "Plataforma",
      distribution: "Distribución",
      services: "Servicios",
      resources: "Recursos",
      pricing: "Precios",
      contact: "Contacto",
      dashboard: "Dashboard",
      analytics: "Analíticas",
      artists: "Artistas",
      blog: "Blog",
      support: "Soporte",
      faq: "Preguntas frecuentes",
      platformDesc: "Gestiona todo desde un lugar",
      analyticsDesc: "Información y análisis",
      artistsDesc: "Gestión de artistas y roles",
      blogDesc: "Artículos y guías",
      supportDesc: "Ayuda cuando la necesitas",
      faqDesc: "Preguntas frecuentes",
    },
    hero: {
      label: "Plataforma todo-en-uno para artistas independientes",
      headline1: "Tu música.",
      headline2: "Tu carrera.",
      headline3: "Tu negocio.",
      description:
        "Organiza tu proyecto musical con una plataforma profesional diseñada para artistas independientes.",
      cta1: "Solicitar acceso",
      cta2: "Conocer más",
    },
    platforms: {
      trustedBy: "Pensada para acompañar tu proyecto en plataformas digitales",
      distributionLabel: "Tu proyecto musical, listo para crecer.",
      andMore: "y más destinos digitales.",
    },
    services: {
      sectionLabel: "Un espacio para crecer",
      headline: "Herramientas profesionales para organizar tu proyecto musical.",
      items: [
        {
          title: "Proyecto centralizado",
          description:
            "Organiza la información importante de tu proyecto desde un solo espacio.",
        },
        {
          title: "Información organizada",
          description:
            "Mantén tus datos y próximos objetivos claros y accesibles.",
        },
        {
          title: "Gestión profesional",
          description:
            "Trabaja con una estructura pensada para proyectos musicales independientes.",
        },
        {
          title: "Colaboración organizada",
          description:
            "Prepara la información de tu equipo y tu proyecto para cada etapa.",
        },
        {
          title: "Proceso de acceso",
          description:
            "Solicita acceso y permite que nuestro equipo conozca tu proyecto.",
        },
        {
          title: "Planificación musical",
          description:
            "Da estructura a tus próximos lanzamientos y decisiones importantes.",
        },
      ],
    },
    howItWorks: {
      sectionLabel: "Cómo funciona",
      headline: "Un proceso claro en 4 pasos.",
      steps: [
        {
          title: "Solicita acceso",
          description: "Cuéntanos sobre tu proyecto artístico mediante nuestra solicitud.",
        },
        {
          title: "Evaluamos tu proyecto",
          description: "Nuestro equipo revisa la información y el perfil artístico.",
        },
        {
          title: "Recibe tu invitación",
          description: "Si tu proyecto es aprobado, recibirás una invitación para continuar el proceso.",
        },
        {
          title: "Firma y comienza",
          description: "Completa tu incorporación, crea tu cuenta y accede a la plataforma.",
        },
      ],
    },
    capabilities: {
      sectionLabel: "Plataforma completa",
      headline: "Una base profesional para tu proyecto musical.",
      items: [
        {
          title: "Proyecto organizado",
          description:
            "Una estructura clara para centralizar la información de tu proyecto.",
        },
        {
          title: "Gestión centralizada",
          description:
            "Herramientas pensadas para mantener tu operación musical ordenada.",
        },
        {
          title: "Proceso transparente",
          description:
            "Conoce cada etapa del proceso de evaluación e incorporación.",
        },
        {
          title: "Software profesional",
          description:
            "Diseñado para artistas independientes que quieren crecer con estructura.",
        },
      ],
      brand: "Hecho para proyectos reales.",
      brandSub: "Con una estructura profesional.",
    },
    dashboardPreview: {
      sectionLabel: "Panel profesional",
      headline1: "Tu plataforma,",
      headline2: "tus datos,",
      headline3: "tu control.",
      description:
        "Un espacio de trabajo intuitivo y moderno para organizar tu proyecto musical.",
      highlights: [
        "Vista general de tu proyecto",
        "Módulos organizados por área",
        "Acciones claras y sencillas",
        "Diseñado para móviles",
      ],
    },
    finalCTA: {
      headline: "¿Listo para dar el siguiente paso?",
      description:
        "Solicita acceso y cuéntanos sobre tu proyecto musical.",
      button: "Solicitar acceso",
    },
    footer: {
      description:
        "Espacio profesional para organizar y hacer crecer tu proyecto musical.",
      newsletter: {
        title: "Newsletter",
        description: "Suscríbete para recibir noticias, actualizaciones y consejos.",
        placeholder: "Tu correo electrónico",
        ariaLabel: "Newsletter — próximamente disponible",
      },
      copyright: "© 2025 NP Music Group. Todos los derechos reservados.",
      madeWith: "Hecho con",
      forCommunity: "para la comunidad independiente.",
      sections: {
        platform: "Plataforma",
        resources: "Recursos",
        company: "Empresa",
      },
      links: {
        artists: "Artistas",
        releases: "Lanzamientos",
        distribution: "Distribución",
        revenue: "Ingresos",
        analytics: "Analíticas",
        blog: "Blog",
        support: "Soporte",
        faq: "Preguntas frecuentes",
        status: "Estado del sistema",
        about: "Sobre nosotros",
        contact: "Contacto",
        terms: "Términos de servicio",
        privacy: "Política de privacidad",
      },
    },
    dashboard: {
      modules: {
        central: "Central",
        profile: "Mi perfil",
        artists: "Artistas",
        releases: "Lanzamientos",
        distribution: "Distribución",
        revenue: "Ingresos",
        analytics: "Analíticas",
        contracts: "Contratos",
        messaging: "Mensajes",
        invitations: "Invitaciones",
        permissions: "Permisos",
        activity: "Actividad",
        settings: "Configuración",
        requests: "Solicitudes",
        accounts: "Cuentas",
        npControl: "NP Control",
        releasesReceived: "Recibidos / Pendientes",
      },
      recentActivity: "Actividad reciente",
      viewAll: "Ver todo",
      noActivity: "Sin actividad aún",
      noActivityDesc: "Las acciones del equipo y lanzamientos aparecerán aquí.",
      revenueEmpty: "Los ingresos aparecerán aquí",
      stats: {
        artists: "Artistas",
        releases: "Lanzamientos",
        revenue: "Ingresos",
        requests: "Solicitudes",
      },
      months: ["Ene", "Feb", "Mar", "Abr", "May", "Jun", "Jul", "Ago"],
      inDevelopment: {
        title: "Módulo en desarrollo",
        description: "Este módulo se encuentra en desarrollo y estará disponible próximamente.",
        badge: "Próximamente",
      },
      modulePage: {
        status: "Apartado pendiente",
        description: "Este apartado todavía no tiene datos conectados, pero ya está listo para integrarse.",
        backToCentral: "Volver a Central",
      },
      header: {
        logout: "Cerrar sesión",
        loggingOut: "Saliendo…",
        language: "Idioma",
      },
      sidebar: {
        platform: "Plataforma",
        management: "Gestión",
        finance: "Finanzas",
        system: "Sistema",
      },
    },
  },

  en: {
    common: {
      startNow: "Request access",
      login: "Sign in",
      viewPlatform: "View platform",
      comingSoon: "Coming soon",
    },
    nav: {
      home: "Home",
      platform: "Platform",
      distribution: "Distribution",
      services: "Services",
      resources: "Resources",
      pricing: "Pricing",
      contact: "Contact",
      dashboard: "Dashboard",
      analytics: "Analytics",
      artists: "Artists",
      blog: "Blog",
      support: "Support",
      faq: "FAQ",
      platformDesc: "Manage everything in one place",
      analyticsDesc: "Information and analysis",
      artistsDesc: "Artist and role management",
      blogDesc: "Articles and guides",
      supportDesc: "Help when you need it",
      faqDesc: "Frequently asked questions",
    },
    hero: {
      label: "All-in-one platform for independent artists",
      headline1: "Your music.",
      headline2: "Your career.",
      headline3: "Your business.",
      description:
        "Organize your music project with a professional platform designed for independent artists.",
      cta1: "Request access",
      cta2: "Learn more",
    },
    platforms: {
      trustedBy: "Designed to support your project across digital platforms",
      distributionLabel: "Your music project, ready to grow.",
      andMore: "and more digital destinations.",
    },
    services: {
      sectionLabel: "A space to grow",
      headline: "Professional tools to organize your music project.",
      items: [
        {
          title: "Centralized project",
          description:
            "Organize your project's important information in one place.",
        },
        {
          title: "Organized information",
          description:
            "Keep your data and upcoming goals clear and accessible.",
        },
        {
          title: "Professional management",
          description:
            "Work with a structure designed for independent music projects.",
        },
        {
          title: "Organized collaboration",
          description:
            "Prepare your team and project information for each stage.",
        },
        {
          title: "Access process",
          description:
            "Request access and let our team learn about your project.",
        },
        {
          title: "Music planning",
          description:
            "Bring structure to your upcoming releases and important decisions.",
        },
      ],
    },
    howItWorks: {
      sectionLabel: "How it works",
      headline: "A clear 4-step process.",
      steps: [
        {
          title: "Request access",
          description: "Tell us about your artistic project through our application.",
        },
        {
          title: "We evaluate your project",
          description: "Our team reviews your information and artistic profile.",
        },
        {
          title: "Receive your invitation",
          description: "If your project is approved, you will receive an invitation to continue.",
        },
        {
          title: "Sign and begin",
          description: "Complete onboarding, create your account and access the platform.",
        },
      ],
    },
    capabilities: {
      sectionLabel: "Complete platform",
      headline: "A professional foundation for your music project.",
      items: [
        {
          title: "Organized project",
          description: "A clear structure for centralizing your project information.",
        },
        {
          title: "Centralized management",
          description: "Tools designed to keep your music operation organized.",
        },
        {
          title: "Transparent process",
          description: "Know each stage of the evaluation and onboarding process.",
        },
        {
          title: "Professional software",
          description: "Designed for independent artists who want to grow with structure.",
        },
      ],
      brand: "Built for real projects.",
      brandSub: "With a professional structure.",
    },
    dashboardPreview: {
      sectionLabel: "Professional panel",
      headline1: "Your platform,",
      headline2: "your data,",
      headline3: "your control.",
      description:
        "An intuitive and modern workspace for organizing your music project.",
      highlights: [
        "Overview of your project",
        "Modules organized by area",
        "Clear and simple actions",
        "Designed for mobile",
      ],
    },
    finalCTA: {
      headline: "Ready to take the next step?",
      description:
        "Request access and tell us about your music project.",
      button: "Request access",
    },
    footer: {
      description:
        "A professional space to organize and grow your music project.",
      newsletter: {
        title: "Newsletter",
        description: "Subscribe to receive news, updates and tips.",
        placeholder: "Your email address",
        ariaLabel: "Newsletter — coming soon",
      },
      copyright: "© 2025 NP Music Group. All rights reserved.",
      madeWith: "Made with",
      forCommunity: "for the independent community.",
      sections: {
        platform: "Platform",
        resources: "Resources",
        company: "Company",
      },
      links: {
        artists: "Artists",
        releases: "Releases",
        distribution: "Distribution",
        revenue: "Revenue",
        analytics: "Analytics",
        blog: "Blog",
        support: "Support",
        faq: "FAQ",
        status: "System status",
        about: "About us",
        contact: "Contact",
        terms: "Terms of service",
        privacy: "Privacy policy",
      },
    },
    dashboard: {
      modules: {
        central: "Central",
        profile: "My profile",
        artists: "Artists",
        releases: "Releases",
        distribution: "Distribution",
        revenue: "Revenue",
        analytics: "Analytics",
        contracts: "Contracts",
        messaging: "Messages",
        invitations: "Invitations",
        permissions: "Permissions",
        activity: "Activity",
        settings: "Settings",
        requests: "Requests",
        accounts: "Accounts",
        npControl: "NP Control",
        releasesReceived: "Received / Pending",
      },
      recentActivity: "Recent activity",
      viewAll: "View all",
      noActivity: "No activity yet",
      noActivityDesc: "Team actions and releases will appear here.",
      revenueEmpty: "Revenue will appear here",
      stats: {
        artists: "Artists",
        releases: "Releases",
        revenue: "Revenue",
        requests: "Requests",
      },
      months: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug"],
      inDevelopment: {
        title: "Module under development",
        description: "This module is currently under development and will be available soon.",
        badge: "Coming soon",
      },
      modulePage: {
        status: "Pending section",
        description: "This section is not connected to live data yet, but it is ready for integration.",
        backToCentral: "Back to Central",
      },
      header: {
        logout: "Sign out",
        loggingOut: "Signing out…",
        language: "Language",
      },
      sidebar: {
        platform: "Platform",
        management: "Management",
        finance: "Finance",
        system: "System",
      },
    },
  },
} as const;

export type Translations = (typeof translations)[Language];
