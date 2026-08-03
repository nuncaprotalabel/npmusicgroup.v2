export type Language = "es" | "en";

export const translations = {
  es: {
    common: {
      startNow: "Comenzar ahora",
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
      analyticsDesc: "Datos en tiempo real",
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
        "Distribuye tu música en todas las plataformas digitales, gestiona tu carrera y genera ingresos reales con herramientas profesionales diseñadas para artistas independientes.",
      cta1: "Distribuye tu música",
      cta2: "Conocer más",
    },
    platforms: {
      trustedBy: "Distribución en las principales plataformas del mundo",
      distributionLabel: "Distribución sin límites — Llega a más lugares.",
      andMore: "y más.",
    },
    services: {
      sectionLabel: "Todo lo que necesitas",
      headline: "Herramientas profesionales para artistas independientes.",
      items: [
        {
          title: "Distribución Global",
          description:
            "Lleva tu música a plataformas digitales en todo el mundo de forma automática y sin complicaciones.",
        },
        {
          title: "Ingresos Transparentes",
          description:
            "Datos en tiempo real sobre streams y rendimiento. Sin sorpresas, sin letra pequeña.",
        },
        {
          title: "Gestión de Artistas",
          description:
            "Administra artistas, roles y permisos de forma segura y transparente desde un solo panel.",
        },
        {
          title: "Contratos Digitales",
          description:
            "Crea, firma y gestiona todos los contratos y acuerdos con tu equipo desde un solo lugar.",
        },
        {
          title: "Invitaciones",
          description:
            "Invita a colaboradores y miembros del equipo con permisos específicos.",
        },
        {
          title: "Lanzamientos",
          description:
            "Publica y gestiona tus lanzamientos con control total y visibilidad en tiempo real.",
        },
      ],
    },
    howItWorks: {
      sectionLabel: "Cómo funciona",
      headline: "En solo 4 simples pasos.",
      steps: [
        {
          title: "Regístrate",
          description: "Crea tu cuenta de forma rápida y segura.",
        },
        {
          title: "Sube tu música",
          description: "Sube tus lanzamientos y completa la información del release.",
        },
        {
          title: "Distribuimos",
          description: "Tu música llega a todas las plataformas digitales del mundo.",
        },
        {
          title: "Gana ingresos",
          description: "Recibe tus pagos de forma segura, transparente y puntual.",
        },
      ],
    },
    capabilities: {
      sectionLabel: "Plataforma completa",
      headline: "Todo lo que tu negocio musical necesita.",
      items: [
        {
          title: "Distribución global",
          description:
            "Tu música en las principales plataformas digitales del mundo.",
        },
        {
          title: "Gestión centralizada",
          description:
            "Artistas, lanzamientos, contratos y equipo desde un solo lugar.",
        },
        {
          title: "Ingresos en tiempo real",
          description:
            "Visualiza y gestiona tus ingresos con total transparencia.",
        },
        {
          title: "Software profesional",
          description:
            "Construido para sellos y artistas que operan como empresas.",
        },
      ],
      brand: "Hecho para artistas reales.",
      brandSub: "Por artistas reales.",
    },
    dashboardPreview: {
      sectionLabel: "Panel profesional",
      headline1: "Tu plataforma,",
      headline2: "tus datos,",
      headline3: "tu control.",
      description:
        "Un panel intuitivo y moderno que te permite gestionar todo tu negocio musical desde un solo lugar.",
      highlights: [
        "Vista general en tiempo real",
        "Módulos independientes por área",
        "Acciones rápidas y sencillas",
        "Diseñado para móviles",
      ],
    },
    finalCTA: {
      headline: "¿Listo para llevar tu música al siguiente nivel?",
      description:
        "Construye tu legado musical con herramientas profesionales diseñadas para artistas independientes.",
      button: "Comenzar ahora",
    },
    footer: {
      description:
        "Plataforma integral para artistas independientes. Distribución, gestión y crecimiento en un solo lugar.",
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
      startNow: "Get started",
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
      analyticsDesc: "Real-time data",
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
        "Distribute your music to all digital platforms, manage your career and generate real income with professional tools designed for independent artists.",
      cta1: "Distribute your music",
      cta2: "Learn more",
    },
    platforms: {
      trustedBy: "Distribution across the world's leading platforms",
      distributionLabel: "Limitless distribution — Reach more places.",
      andMore: "and more.",
    },
    services: {
      sectionLabel: "Everything you need",
      headline: "Professional tools for independent artists.",
      items: [
        {
          title: "Global Distribution",
          description:
            "Get your music to digital platforms worldwide, automatically and without hassle.",
        },
        {
          title: "Transparent Revenue",
          description:
            "Real-time data on streams and performance. No surprises, no fine print.",
        },
        {
          title: "Artist Management",
          description:
            "Manage artists, roles and permissions securely and transparently from one panel.",
        },
        {
          title: "Digital Contracts",
          description:
            "Create, sign and manage all contracts and agreements with your team in one place.",
        },
        {
          title: "Invitations",
          description:
            "Invite collaborators and team members with specific permissions.",
        },
        {
          title: "Releases",
          description:
            "Publish and manage your releases with full control and real-time visibility.",
        },
      ],
    },
    howItWorks: {
      sectionLabel: "How it works",
      headline: "In just 4 simple steps.",
      steps: [
        {
          title: "Sign up",
          description: "Create your account quickly and securely.",
        },
        {
          title: "Upload your music",
          description: "Upload your releases and complete the release information.",
        },
        {
          title: "We distribute",
          description: "Your music reaches all digital platforms worldwide.",
        },
        {
          title: "Earn revenue",
          description: "Receive your payments securely, transparently and on time.",
        },
      ],
    },
    capabilities: {
      sectionLabel: "Complete platform",
      headline: "Everything your music business needs.",
      items: [
        {
          title: "Global distribution",
          description: "Your music on the world's leading digital platforms.",
        },
        {
          title: "Centralized management",
          description: "Artists, releases, contracts and team in one place.",
        },
        {
          title: "Real-time revenue",
          description: "View and manage your revenue with full transparency.",
        },
        {
          title: "Professional software",
          description: "Built for labels and artists who operate like businesses.",
        },
      ],
      brand: "Built for real artists.",
      brandSub: "By real artists.",
    },
    dashboardPreview: {
      sectionLabel: "Professional panel",
      headline1: "Your platform,",
      headline2: "your data,",
      headline3: "your control.",
      description:
        "An intuitive and modern panel that lets you manage your entire music business from one place.",
      highlights: [
        "Real-time overview",
        "Independent modules by area",
        "Quick and easy actions",
        "Designed for mobile",
      ],
    },
    finalCTA: {
      headline: "Ready to take your music to the next level?",
      description:
        "Build your musical legacy with professional tools designed for independent artists.",
      button: "Get started",
    },
    footer: {
      description:
        "Comprehensive platform for independent artists. Distribution, management and growth in one place.",
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

export type Translations = typeof translations.es;
