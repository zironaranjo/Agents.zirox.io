import type { LucideIcon } from "lucide-react";
import {
  Headphones,
  Megaphone,
  MessagesSquare,
  Scale,
  Share2,
  TrendingUp,
} from "lucide-react";

export type DepartmentSlug =
  | "marketing"
  | "redes"
  | "comunidad"
  | "ventas"
  | "soporte"
  | "marca";

export type DepartmentStatus = "active" | "processing" | "idle";

export type DepartmentCard = {
  slug: DepartmentSlug;
  title: string;
  shortDescription: string;
  icon: LucideIcon;
  status: DepartmentStatus;
  agentsActive: number;
  metricLabel: string;
  metricVisual: "bars" | "progress-build" | "progress-sync" | "text" | "sentiment" | "text-audit";
};

export const DEPARTMENTS: DepartmentCard[] = [
  {
    slug: "marketing",
    title: "Marketing y crecimiento",
    shortDescription: "Briefs, calendario editorial, campañas y métricas de contenido.",
    icon: Megaphone,
    status: "active",
    agentsActive: 6,
    metricLabel: "Actividad de contenido (7 días)",
    metricVisual: "bars",
  },
  {
    slug: "redes",
    title: "Redes y publicación",
    shortDescription: "Formatos, programación y publicación multi-canal.",
    icon: Share2,
    status: "processing",
    agentsActive: 4,
    metricLabel: "Cola de publicación",
    metricVisual: "progress-build",
  },
  {
    slug: "comunidad",
    title: "Comunidad y conversación",
    shortDescription: "Respuestas, DMs, moderación y tono de marca.",
    icon: MessagesSquare,
    status: "idle",
    agentsActive: 5,
    metricLabel: "Sincronización de conversaciones",
    metricVisual: "progress-sync",
  },
  {
    slug: "ventas",
    title: "Ventas y conversión",
    shortDescription: "Leads, guiones, seguimiento y CTA al producto.",
    icon: TrendingUp,
    status: "active",
    agentsActive: 5,
    metricLabel: "Último ciclo de outbound",
    metricVisual: "text",
  },
  {
    slug: "soporte",
    title: "Soporte y experiencia (CX)",
    shortDescription: "Postventa, resolución y plantillas de atención.",
    icon: Headphones,
    status: "active",
    agentsActive: 12,
    metricLabel: "Sentimiento en tickets abiertos",
    metricVisual: "sentiment",
  },
  {
    slug: "marca",
    title: "Marca y cumplimiento",
    shortDescription: "Claims, disclaimers y revisión de riesgo en contenido.",
    icon: Scale,
    status: "active",
    agentsActive: 2,
    metricLabel: "Última auditoría de cumplimiento",
    metricVisual: "text-audit",
  },
];

export const DEPARTMENT_TITLE_BY_SLUG: Record<DepartmentSlug, string> = {
  marketing: "Marketing y crecimiento",
  redes: "Redes y publicación",
  comunidad: "Comunidad y conversación",
  ventas: "Ventas y conversión",
  soporte: "Soporte y experiencia (CX)",
  marca: "Marca y cumplimiento",
};

export function isDepartmentSlug(value: string | undefined): value is DepartmentSlug {
  return (
    value === "marketing" ||
    value === "redes" ||
    value === "comunidad" ||
    value === "ventas" ||
    value === "soporte" ||
    value === "marca"
  );
}

/** Fila de actividad / bitácora en la sala del departamento */
export type BoardroomLogRow = {
  time: string;
  level: "INFO" | "WARN" | "OK" | "DEBUG";
  levelClass: string;
  agent: string;
  agentClass: string;
  message: string;
};

export type BoardroomTask = {
  tag: string;
  tagClass: string;
  title: string;
  avatars: ("P" | "N" | "C")[];
  footer: string;
  done?: boolean;
};

export type BoardroomAgentCard = {
  name: string;
  status: string;
  statusColor: string;
  dotColor: string;
  description: string;
  image: "/Pulse.png" | "/Nova.png" | "/Claw.png";
  active: boolean;
};

export type BoardroomDeptContext = {
  /** Subtítulo bajo el título del departamento */
  sessionSubtitle: string;
  /** Título del panel central de actividad */
  activityPanelTitle: string;
  /** Texto pie del panel (métricas resumidas) */
  activityFooterLeft: string;
  activityFooterMid: string;
  activityFooterRight: string;
  /** Monitor lateral: primera barra */
  resourcePrimaryLabel: string;
  resourcePrimaryPercent: number;
  /** Segunda barra */
  resourceSecondaryLabel: string;
  resourceSecondaryPercent: number;
  /** Chips bajo el monitor (texto corto) */
  integrationChips: string[];
  /** CTA inferior sidebar */
  primaryCtaLabel: string;
  agents: BoardroomAgentCard[];
  logs: BoardroomLogRow[];
  tasks: BoardroomTask[];
  /** Si true, muestra bloque “Qué quieres publicar” (Redes) */
  showPublicationComposer: boolean;
  /** Título del bloque composer */
  composerTitle?: string;
  composerPlaceholder?: string;
};

const AVATAR: Record<"P" | "N" | "C", string> = {
  P: "bg-blue-500",
  N: "bg-purple-500",
  C: "bg-orange-500",
};

export function boardroomTaskAvatarClass(key: "P" | "N" | "C"): string {
  return AVATAR[key];
}

const BOARDROOM_DEFAULT: BoardroomDeptContext = {
  sessionSubtitle:
    "Vista general: coordinación entre agentes y seguimiento de la sesión (demo).",
  activityPanelTitle: "Registro de ejecución",
  activityFooterLeft: "Eventos: 1.242",
  activityFooterMid: "Errores: 0",
  activityFooterRight: "Avisos: 12",
  resourcePrimaryLabel: "CPU / cómputo",
  resourcePrimaryPercent: 42,
  resourceSecondaryLabel: "Cuota de tokens",
  resourceSecondaryPercent: 24,
  integrationChips: ["n8n", "GitHub", "SSH"],
  primaryCtaLabel: "Desplegar y continuar",
  showPublicationComposer: false,
  agents: [
    {
      name: "Pulse",
      status: "Analizando",
      statusColor: "text-emerald-400",
      dotColor: "bg-emerald-500",
      description: "Monitorizando latencia y salud de integraciones.",
      image: "/Pulse.png",
      active: true,
    },
    {
      name: "Nova",
      status: "Planificando",
      statusColor: "text-blue-400",
      dotColor: "bg-blue-500",
      description: "Preparando siguiente bloque de trabajo.",
      image: "/Nova.png",
      active: false,
    },
    {
      name: "Claw",
      status: "En espera",
      statusColor: "text-slate-400",
      dotColor: "bg-slate-500",
      description: "Listo para orquestar cuando indiques el objetivo.",
      image: "/Claw.png",
      active: false,
    },
  ],
  logs: [
    {
      time: "14:32:01",
      level: "INFO",
      levelClass: "text-blue-400",
      agent: "Nova",
      agentClass: "text-purple-400",
      message: "Iniciando revisión de contexto compartido del proyecto activo.",
    },
    {
      time: "14:32:15",
      level: "WARN",
      levelClass: "text-orange-400",
      agent: "Pulse",
      agentClass: "text-blue-400",
      message: "Picos de latencia en API externa; reenrutando telemetría.",
    },
    {
      time: "14:33:04",
      level: "OK",
      levelClass: "text-emerald-400",
      agent: "Sistema",
      agentClass: "text-slate-400",
      message: "Verificación de cuota de tokens: uso 24%.",
    },
    {
      time: "14:33:10",
      level: "DEBUG",
      levelClass: "text-slate-500",
      agent: "Claw",
      agentClass: "text-orange-400",
      message: "Comprobando esquemas de delegación para siguiente tarea.",
    },
    {
      time: "14:34:22",
      level: "INFO",
      levelClass: "text-blue-400",
      agent: "Nova",
      agentClass: "text-purple-400",
      message: "Propuesta de prioridades generada para la sesión.",
    },
    {
      time: "14:35:12",
      level: "OK",
      levelClass: "text-emerald-400",
      agent: "Claw",
      agentClass: "text-orange-400",
      message: "Auditoría rápida de permisos: sin bloqueos.",
    },
  ],
  tasks: [
    {
      tag: "Alta",
      tagClass: "bg-orange-500/20 text-orange-400",
      title: "Definir alcance del sprint de agentes",
      avatars: ["P", "N"],
      footer: "En 2 h",
    },
    {
      tag: "Integración",
      tagClass: "bg-blue-500/20 text-blue-400",
      title: "Revisar webhook n8n en entorno staging",
      avatars: ["C"],
      footer: "Listo para empezar",
    },
    {
      tag: "Hecho",
      tagClass: "bg-slate-500/20 text-slate-400",
      title: "Checklist de variables de entorno",
      avatars: ["C"],
      footer: "Completado por Claw",
      done: true,
    },
    {
      tag: "Análisis",
      tagClass: "bg-purple-500/20 text-purple-400",
      title: "Resumen de uso por departamento",
      avatars: ["N"],
      footer: "En curso",
    },
  ],
};

const BOARDROOM_BY_SLUG: Record<DepartmentSlug, BoardroomDeptContext> = {
  marketing: {
    ...BOARDROOM_DEFAULT,
    sessionSubtitle:
      "Briefs, piezas creativas y campañas: un solo contexto para que Nova, Pulse y Claw alineen mensaje y formato.",
    activityPanelTitle: "Actividad del equipo de marketing",
    resourcePrimaryLabel: "Contenido en borrador",
    resourcePrimaryPercent: 58,
    resourceSecondaryLabel: "Campañas activas",
    resourceSecondaryPercent: 35,
    integrationChips: ["Drive", "n8n", "Meta Ads"],
    primaryCtaLabel: "Lanzar ronda de creatividades",
    agents: [
      {
        name: "Nova",
        status: "Redactando",
        statusColor: "text-purple-400",
        dotColor: "bg-purple-500",
        description: "Borrador de hilos y copies para campaña.",
        image: "/Nova.png",
        active: true,
      },
      {
        name: "Pulse",
        status: "Midiendo",
        statusColor: "text-emerald-400",
        dotColor: "bg-emerald-500",
        description: "Extrayendo KPIs de la última semana.",
        image: "/Pulse.png",
        active: false,
      },
      {
        name: "Claw",
        status: "Orquestando",
        statusColor: "text-orange-400",
        dotColor: "bg-orange-500",
        description: "Prioriza entregables según calendario.",
        image: "/Claw.png",
        active: false,
      },
    ],
    logs: [
      {
        time: "09:12",
        level: "INFO",
        levelClass: "text-blue-400",
        agent: "Nova",
        agentClass: "text-purple-400",
        message: "Brief recibido: lanzamiento Q2 — generando 3 variantes de claim.",
      },
      {
        time: "09:18",
        level: "OK",
        levelClass: "text-emerald-400",
        agent: "Claw",
        agentClass: "text-orange-400",
        message: "Orden de trabajo fijado: primero email, luego social.",
      },
      {
        time: "09:24",
        level: "INFO",
        levelClass: "text-blue-400",
        agent: "Pulse",
        agentClass: "text-blue-400",
        message: "Engagement últimos 7 días adjunto al contexto del proyecto.",
      },
    ],
    tasks: [
      {
        tag: "Campaña",
        tagClass: "bg-orange-500/20 text-orange-400",
        title: "Secuencia de emails para nurturing",
        avatars: ["N", "C"],
        footer: "Revisión mañana",
      },
      {
        tag: "Social",
        tagClass: "bg-blue-500/20 text-blue-400",
        title: "Calendario de posts semana 15",
        avatars: ["N", "P"],
        footer: "En curso",
      },
    ],
    activityFooterLeft: "Piezas: 18",
    activityFooterMid: "Pendientes revisión: 2",
    activityFooterRight: "Aprobados: 14",
    showPublicationComposer: false,
  },
  redes: {
    ...BOARDROOM_DEFAULT,
    sessionSubtitle:
      "Aquí coordinas formatos, calendario y publicación (LinkedIn, Instagram, etc.). Escribe tu pedido abajo y el equipo prepara el borrador con el contexto del proyecto.",
    activityPanelTitle: "Qué está haciendo el equipo ahora",
    resourcePrimaryLabel: "Cola de publicaciones programadas",
    resourcePrimaryPercent: 68,
    resourceSecondaryLabel: "Borradores listos para revisar",
    resourceSecondaryPercent: 40,
    integrationChips: ["LinkedIn", "Instagram", "n8n"],
    primaryCtaLabel: "Añadir a la cola de publicación",
    showPublicationComposer: true,
    composerTitle: "Nueva publicación (ej. LinkedIn)",
    composerPlaceholder:
      "Ej.: Post sobre el lanzamiento de nuestra integración con n8n, tono profesional, 200 palabras, CTA a la web...",
    agents: [
      {
        name: "Nova",
        status: "Redactando",
        statusColor: "text-purple-400",
        dotColor: "bg-purple-500",
        description: "Estructura del post y primer borrador.",
        image: "/Nova.png",
        active: true,
      },
      {
        name: "Pulse",
        status: "Revisando",
        statusColor: "text-emerald-400",
        dotColor: "bg-emerald-500",
        description: "Límite de caracteres, hashtags y formato LinkedIn.",
        image: "/Pulse.png",
        active: false,
      },
      {
        name: "Claw",
        status: "En espera",
        statusColor: "text-slate-400",
        dotColor: "bg-slate-500",
        description: "Aprueba orden: borrador → revisión → cola o copiar.",
        image: "/Claw.png",
        active: false,
      },
    ],
    logs: [
      {
        time: "10:05",
        level: "INFO",
        levelClass: "text-blue-400",
        agent: "Nova",
        agentClass: "text-purple-400",
        message: "Borrador LinkedIn v1 generado (1.180 caracteres, gancho + 3 párrafos + CTA).",
      },
      {
        time: "10:07",
        level: "OK",
        levelClass: "text-emerald-400",
        agent: "Pulse",
        agentClass: "text-blue-400",
        message: "Formato validado: saltos de línea y emojis acordes a guía de marca.",
      },
      {
        time: "10:08",
        level: "INFO",
        levelClass: "text-blue-400",
        agent: "Nova",
        agentClass: "text-purple-400",
        message: "Variante corta lista (700 caracteres) para copiar en comentario fijado.",
      },
      {
        time: "10:10",
        level: "WARN",
        levelClass: "text-orange-400",
        agent: "Claw",
        agentClass: "text-orange-400",
        message: "Publicación automática desactivada: revisa y copia manualmente o conecta n8n.",
      },
      {
        time: "10:11",
        level: "OK",
        levelClass: "text-emerald-400",
        agent: "Sistema",
        agentClass: "text-slate-400",
        message: "Borrador guardado en contexto del proyecto «Redes — abril».",
      },
    ],
    tasks: [
      {
        tag: "LinkedIn",
        tagClass: "bg-blue-500/20 text-blue-400",
        title: "Post semanal: producto + opinión del fundador",
        avatars: ["N", "P"],
        footer: "Borrador listo",
      },
      {
        tag: "Instagram",
        tagClass: "bg-pink-500/20 text-pink-400",
        title: "Carrusel 5 slides — tips de automatización",
        avatars: ["N"],
        footer: "En diseño de copy",
      },
      {
        tag: "Hecho",
        tagClass: "bg-slate-500/20 text-slate-400",
        title: "Historia IG: anuncio de mantenimiento",
        avatars: ["P"],
        footer: "Publicado",
        done: true,
      },
      {
        tag: "Cola",
        tagClass: "bg-amber-500/20 text-amber-400",
        title: "Thread X / Twitter — hilo técnico corto",
        avatars: ["N", "C"],
        footer: "Programado",
      },
    ],
    activityFooterLeft: "Borradores hoy: 4",
    activityFooterMid: "En revisión: 1",
    activityFooterRight: "Listos para publicar: 2",
  },
  comunidad: {
    ...BOARDROOM_DEFAULT,
    sessionSubtitle:
      "Respuestas coherentes con el tono de marca: DMs, comentarios y moderación ligera.",
    activityPanelTitle: "Actividad de comunidad",
    resourcePrimaryLabel: "Conversaciones abiertas",
    resourcePrimaryPercent: 55,
    resourceSecondaryLabel: "Respuestas sugeridas pendientes",
    resourceSecondaryPercent: 30,
    integrationChips: ["Instagram", "TikTok", "Bandeja DMs"],
    primaryCtaLabel: "Sincronizar bandejas",
    agents: [
      {
        name: "Pulse",
        status: "Respondiendo",
        statusColor: "text-emerald-400",
        dotColor: "bg-emerald-500",
        description: "Propuestas de respuesta para comentarios recientes.",
        image: "/Pulse.png",
        active: true,
      },
      {
        name: "Nova",
        status: "Tono",
        statusColor: "text-purple-400",
        dotColor: "bg-purple-500",
        description: "Ajusta mensaje según guía de voz.",
        image: "/Nova.png",
        active: false,
      },
      {
        name: "Claw",
        status: "Escalando",
        statusColor: "text-orange-400",
        dotColor: "bg-orange-500",
        description: "Marca casos que pasan a humano o a Legal.",
        image: "/Claw.png",
        active: false,
      },
    ],
    logs: [
      {
        time: "11:02",
        level: "INFO",
        levelClass: "text-blue-400",
        agent: "Pulse",
        agentClass: "text-blue-400",
        message: "12 comentarios nuevos clasificados (pregunta / feedback / spam).",
      },
      {
        time: "11:06",
        level: "OK",
        levelClass: "text-emerald-400",
        agent: "Nova",
        agentClass: "text-purple-400",
        message: "3 borradores de respuesta listos, tono cercano aprobado.",
      },
    ],
    tasks: [
      {
        tag: "DMs",
        tagClass: "bg-orange-500/20 text-orange-400",
        title: "Consultas de precios en Instagram",
        avatars: ["P", "N"],
        footer: "5 pendientes",
      },
      {
        tag: "Moderación",
        tagClass: "bg-slate-500/20 text-slate-400",
        title: "Revisar hilo con mención negativa",
        avatars: ["C"],
        footer: "Urgente",
      },
    ],
    activityFooterLeft: "Respuestas: 28",
    activityFooterMid: "Escalados: 1",
    activityFooterRight: "Pendientes: 5",
    showPublicationComposer: false,
  },
  ventas: {
    ...BOARDROOM_DEFAULT,
    sessionSubtitle:
      "Scripts, seguimientos y mensajes que acerquen al cierre sin romper el tono de marca.",
    activityPanelTitle: "Pipeline y mensajes",
    resourcePrimaryLabel: "Leads calientes",
    resourcePrimaryPercent: 45,
    resourceSecondaryLabel: "Secuencias activas",
    resourceSecondaryPercent: 62,
    integrationChips: ["CRM", "n8n", "Email"],
    primaryCtaLabel: "Generar seguimiento del día",
    agents: [
      {
        name: "Pulse",
        status: "Priorizando",
        statusColor: "text-emerald-400",
        dotColor: "bg-emerald-500",
        description: "Ordena leads por intención y recencia.",
        image: "/Pulse.png",
        active: true,
      },
      {
        name: "Nova",
        status: "Copys",
        statusColor: "text-purple-400",
        dotColor: "bg-purple-500",
        description: "DMs y emails de seguimiento.",
        image: "/Nova.png",
        active: false,
      },
      {
        name: "Claw",
        status: "Estrategia",
        statusColor: "text-orange-400",
        dotColor: "bg-orange-500",
        description: "Define siguiente mejor acción por cuenta.",
        image: "/Claw.png",
        active: false,
      },
    ],
    logs: [
      {
        time: "08:45",
        level: "INFO",
        levelClass: "text-blue-400",
        agent: "Pulse",
        agentClass: "text-blue-400",
        message: "8 oportunidades marcadas para contacto hoy.",
      },
      {
        time: "08:52",
        level: "OK",
        levelClass: "text-emerald-400",
        agent: "Nova",
        agentClass: "text-purple-400",
        message: "Plantilla de segundo toque lista (variante B más corta).",
      },
    ],
    tasks: [
      {
        tag: "Outreach",
        tagClass: "bg-blue-500/20 text-blue-400",
        title: "Secuencia LinkedIn — sector retail",
        avatars: ["N", "P"],
        footer: "Activa",
      },
      {
        tag: "Demo",
        tagClass: "bg-orange-500/20 text-orange-400",
        title: "Guion llamada descubrimiento 15 min",
        avatars: ["C"],
        footer: "Por enviar",
      },
    ],
    activityFooterLeft: "Touchpoints: 34",
    activityFooterMid: "Citas: 2",
    activityFooterRight: "Por contactar: 8",
    showPublicationComposer: false,
  },
  soporte: {
    ...BOARDROOM_DEFAULT,
    sessionSubtitle:
      "Resolución rápida con macros inteligentes y escalado claro cuando haga falta un humano.",
    activityPanelTitle: "Tickets y respuestas",
    resourcePrimaryLabel: "SLA del día",
    resourcePrimaryPercent: 72,
    resourceSecondaryLabel: "Base de respuestas",
    resourceSecondaryPercent: 88,
    integrationChips: ["Helpdesk", "n8n", "Correo"],
    primaryCtaLabel: "Generar informe de cola",
    agents: [
      {
        name: "Nova",
        status: "Redactando",
        statusColor: "text-purple-400",
        dotColor: "bg-purple-500",
        description: "Respuestas empáticas y paso a paso.",
        image: "/Nova.png",
        active: true,
      },
      {
        name: "Pulse",
        status: "Clasificando",
        statusColor: "text-emerald-400",
        dotColor: "bg-emerald-500",
        description: "Etiqueta urgencia y tipo de incidencia.",
        image: "/Pulse.png",
        active: false,
      },
      {
        name: "Claw",
        status: "Escalado",
        statusColor: "text-orange-400",
        dotColor: "bg-orange-500",
        description: "Tickets sensibles a supervisión.",
        image: "/Claw.png",
        active: false,
      },
    ],
    logs: [
      {
        time: "15:20",
        level: "OK",
        levelClass: "text-emerald-400",
        agent: "Nova",
        agentClass: "text-purple-400",
        message: "Macro «reset de contraseña» aplicada con personalización.",
      },
      {
        time: "15:22",
        level: "WARN",
        levelClass: "text-orange-400",
        agent: "Claw",
        agentClass: "text-orange-400",
        message: "Ticket #4412 escalado: posible reclamo legal.",
      },
    ],
    tasks: [
      {
        tag: "Urgente",
        tagClass: "bg-orange-500/20 text-orange-400",
        title: "Cliente sin acceso tras pago",
        avatars: ["N", "P"],
        footer: "< 1 h",
      },
      {
        tag: "FAQ",
        tagClass: "bg-blue-500/20 text-blue-400",
        title: "Actualizar artículo «primeros pasos»",
        avatars: ["N"],
        footer: "Backlog",
      },
    ],
    activityFooterLeft: "Resueltos: 47",
    activityFooterMid: "Abiertos: 12",
    activityFooterRight: "SLA OK: 96%",
    showPublicationComposer: false,
  },
  marca: {
    ...BOARDROOM_DEFAULT,
    sessionSubtitle:
      "Revisión de claims, riesgos y alineación con políticas antes de que el contenido salga a redes.",
    activityPanelTitle: "Revisiones y cumplimiento",
    resourcePrimaryLabel: "Contenidos en revisión",
    resourcePrimaryPercent: 33,
    resourceSecondaryLabel: "Checklist legal",
    resourceSecondaryPercent: 90,
    integrationChips: ["Drive", "Políticas", "Histórico"],
    primaryCtaLabel: "Ejecutar checklist de publicación",
    agents: [
      {
        name: "Claw",
        status: "Auditando",
        statusColor: "text-orange-400",
        dotColor: "bg-orange-500",
        description: "Cruce con guías internas y umbrales de riesgo.",
        image: "/Claw.png",
        active: true,
      },
      {
        name: "Nova",
        status: "Ajustando",
        statusColor: "text-purple-400",
        dotColor: "bg-purple-500",
        description: "Suaviza claims y añade disclaimers.",
        image: "/Nova.png",
        active: false,
      },
      {
        name: "Pulse",
        status: "Registro",
        statusColor: "text-emerald-400",
        dotColor: "bg-emerald-500",
        description: "Traza versión aprobada para auditoría.",
        image: "/Pulse.png",
        active: false,
      },
    ],
    logs: [
      {
        time: "16:01",
        level: "INFO",
        levelClass: "text-blue-400",
        agent: "Claw",
        agentClass: "text-orange-400",
        message: "Post de LinkedIn: sin promesas numéricas no verificadas.",
      },
      {
        time: "16:04",
        level: "OK",
        levelClass: "text-emerald-400",
        agent: "Nova",
        agentClass: "text-purple-400",
        message: "Disclaimer añadido en pie de copy para testimonios.",
      },
    ],
    tasks: [
      {
        tag: "Legal",
        tagClass: "bg-violet-500/20 text-violet-400",
        title: "Revisión contrato influencer Q2",
        avatars: ["C"],
        footer: "En revisión",
      },
      {
        tag: "Marca",
        tagClass: "bg-slate-500/20 text-slate-400",
        title: "Actualizar tono en crisis (doc interno)",
        avatars: ["N"],
        footer: "Borrador",
      },
    ],
    activityFooterLeft: "Aprobados: 6",
    activityFooterMid: "Con observaciones: 1",
    activityFooterRight: "Bloqueados: 0",
    showPublicationComposer: false,
  },
};

export function getBoardroomContext(slug: DepartmentSlug | undefined): BoardroomDeptContext {
  if (slug && BOARDROOM_BY_SLUG[slug]) {
    return BOARDROOM_BY_SLUG[slug];
  }
  return BOARDROOM_DEFAULT;
}
