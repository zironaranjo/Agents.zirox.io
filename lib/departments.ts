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
