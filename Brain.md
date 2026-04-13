# Brain - Agentes Matrix

Este documento sera la memoria viva del proyecto para mantener contexto entre sesiones.

## 1) Vision del proyecto

Construir una interfaz web para un Sistema Multiagente Jerarquico donde:

- Exista un orquestador principal (`CLAW` - OpenClaw).
- Existan agentes principales por dominio (ej. `NOVA` marketing, `PULSE` ventas).
- Cada agente principal tenga subagentes especializados.
- Los agentes se conecten con herramientas externas (`n8n`, LLMs, APIs).

## 2) Stack acordado (actual)

- Frontend: `Next.js + TypeScript + Tailwind` (carpeta `web`).
- Backend: `Supabase` (DB + auth + APIs si aplica).
- Orquestador: OpenClaw (ya existente).
- Automatizaciones: `n8n` desplegado en VPS con Dokploy.
- Despliegue: VPS Hostinger + Dokploy + subdominio de `zirox.io`.

## 3) Estado actual

- Proyecto UI inicial creado en `web`.
- Landing premium creada con:
  - Hero, KPIs, seccion Workflows y fondo visual.
  - Tipografia premium y distribucion full-width.
- Dashboard/Panel MVP creado con:
  - Lista y editor de agentes.
  - Campos de configuracion de modelo (`provider`, `model`, `systemPrompt`, `temperature`).
- Integracion OpenRouter MVP:
  - Endpoint `POST /api/agents/run`.
  - Boton "Probar agente" en `/panel`.
  - Variables de entorno documentadas con `.env.example`.
  - Boardroom (departamentos): `POST /api/boardroom/draft` genera borradores desde la UI con el mismo `OPENROUTER_API_KEY`. Modelo por defecto gratuito `meta-llama/llama-3.2-3b-instruct:free`; opcional `OPENROUTER_BOARDROOM_MODEL`. Prompt de sistema segun `departmentSlug` (`lib/boardroom-draft.ts`).
- Persistencia Supabase (fase inicial) completada:
  - Tabla `agents` creada en Supabase.
  - Script SQL versionado en `web/supabase/schema.sql`.
  - API CRUD base creada:
    - `GET/POST /api/agents`
    - `PATCH /api/agents/[id]`
  - Panel conectado para cargar/crear/guardar agentes reales.
  - Landing y canvas conectados para leer agentes desde Supabase (con fallback a mocks).
- Ejecucion end-to-end validada con CLAW:
  - Flujo probado: crear tarea -> delegar en CLAW -> consultar run.
  - Resultado confirmado: `executor=claw`, `estado=completado`.
  - Integracion ajustada a `tools/invoke` con `sessions_spawn`.
  - OpenClaw estabilizado tras remover clave invalida `heartbeat` del config.
- Rediseño visual (iteracion UX/UI) aplicado en landing:
  - Navbar estilo sistema IA con menu central y CTA "Acceso sistema".
  - Hero actualizado con titulo "Orquestación de Sistemas Multi-Agente de Próxima Generación".
  - Figura geométrica mejorada en hero con nodos/estados visuales.
  - Se respeta paleta base (cyan/emerald/slate) incorporando acento naranja.
- Nueva pagina dedicada de Workflows (`/workflows`) implementada para fase UX/UI:
  - Vista `Template Library` con categorias y cards de blueprints.
  - Vista `Workflow Builder` con canvas visual + panel lateral de configuracion.
  - Ruta legacy `/panel/workflows/nuevo` redirigida a `/workflows`.
- Backend MVP de workflows habilitado:
  - Nuevas tablas `workflows`, `workflow_runs`, `workflow_run_logs`.
  - Endpoints `GET/POST /api/workflows`, `POST /api/workflows/:id/run`, `GET /api/workflow-runs/:id`.
  - Botones `Deploy Template` y `Create from Scratch` ya crean workflows reales en Supabase.
- Iteración visual avanzada aplicada:
  - Landing reestructurada con sección hero dedicada a `CLAW` en formato full-width.
  - Se reemplaza composición por capas usando `Claw1.png` como sujeto principal.
  - Se elimina navbar superior de la landing y se mantiene CTA principal dentro del hero.
  - Se optimiza hero para mobile (encuadre, alturas `svh`, overlays y tipografía/CTAs).
- Navegación de software refinada:
  - `\`/panel\`` migra a app-shell con sidebar modular.
  - Secciones base creadas: `workflows`, `agentes`, `arquitectura`, `logs`, `settings`.
  - `\`/panel\`` ahora redirige al dashboard principal `\`/panel/agentes\``.
  - `Workflows` en sidebar redirige al builder principal `\`/workflows\``.
- Integración de diseño con Stitch completada:
  - Stitch MCP autenticado por OAuth y verificado con `doctor` (`Healthy 200`).
  - Configuración MCP agregada para Cursor (`stitch -> npx @_davideast/stitch-mcp proxy`).
  - Flujo de aprobación de diseños creado (`stitch/pending`, `stitch/approved`, `stitch/rejected`).
  - Regla de protección añadida: no implementar diseños sin aprobación explícita.
- Workflow Builder reorganizado para reducir confusión:
  - Categorías consolidadas: `Triggers`, `Agents`, `Social Channels`, `Automation & Apps`.
  - `Social Channels` agrupado por plataforma (LinkedIn, Instagram, TikTok, YouTube, Facebook).
  - `Node Settings` migrado a tabs: `Config`, `Mapping`, `Validation`.
- Modo Matrix implementado para ejecución secuencial real:
  - Cola de tareas pendientes en orden de creación (sin saltos).
  - Selector de agente integrado para ejecución manual y ejecución por cola.
  - Delegación manual bloqueable cuando Matrix Mode está activo.
  - Persistencia global de Matrix Mode en Supabase (`system_settings`) con fallback local.
  - Nuevos endpoints:
    - `GET /api/tasks` (con filtro por estado y límite)
    - `POST /api/tasks/matrix/execute`
    - `GET/PATCH /api/settings/matrix-mode`

## 4) Arquitectura funcional (resumen)

1. Usuario crea o asigna una tarea desde la UI.
2. `CLAW` analiza y delega en agentes principales.
3. Cada agente principal usa sus subagentes y herramientas.
4. Resultados regresan al orquestador.
5. La UI muestra estado, logs y resultado consolidado.

### Arquitectura de integracion (definida)

1. Frontend (`agents.zirox.io`) envia tareas y acciones a una API propia.
2. API coordina integraciones con:
   - Orquestador `CLAW`.
   - Workflows de `n8n`.
   - Proveedores LLM (OpenRouter, etc).
3. API guarda estado y logs en Supabase.
4. Frontend consulta/escucha estado para monitoreo en tiempo real.

Nota: se evita conectar frontend directamente a n8n/CLAW para mantener seguridad y control.

## 5) Modelo inicial de entidades

- `agents`: definicion de agentes principales y subagentes.
- `agent_relations`: jerarquia padre/hijo.
- `agent_tools`: herramientas permitidas por agente.
- `tasks`: tareas enviadas por usuarios.
- `task_runs`: ejecuciones por agente/subagente.
- `run_logs`: eventos y trazas de ejecucion.

## 6) Roadmap propuesto

### Fase 1 - UI base
- [x] Crear proyecto Next.js.
- [x] Crear dashboard MVP.
- [x] Implementar canvas visual con React Flow.
- [x] Panel de configuracion de agente.
- [x] Crear landing visual con seccion Workflows.

### Fase 2 - Persistencia
- [x] Conectar proyecto a Supabase.
- [x] CRUD base de agentes (crear/listar/actualizar) via API.
- [ ] CRUD completo de subagentes y relaciones jerarquicas.
- [ ] Guardar relaciones jerarquicas y herramientas.
- [x] Guardar ejecuciones y estado de tareas (`task_runs` + `tasks`).
- [x] Persistir configuración global de ejecución (`system_settings.matrix_mode_enabled`).

### Fase 3 - Ejecucion
- [x] Integrar orquestador OpenClaw (delegacion y run completado).
- [x] Integrar workflows de n8n (trigger desde API).
- [~] Estado/logs en tiempo real en UI (auto-polling de runs listo; falta timeline/historial avanzado).
- [x] Integrar prueba directa con OpenRouter desde backend.
- [x] Crear endpoints base de integracion API para n8n + CLAW.
- [x] Implementar Modo Matrix secuencial con ejecución en cola y control de errores.

### Fase 4 - Deploy y dominio
- [x] Desplegar frontend en Dokploy.
- [x] Configurar subdominio y acceso operativo en VPS.
- [x] Configurar SSL.
- [x] Definir variables de entorno de produccion (base).
- [ ] (Opcional recomendado) separar API en `api-agents.zirox.io`.

## 7) Convenciones de trabajo

- Toda decision importante se registra aqui antes o despues de implementarla.
- No borrar contexto historico; agregar nuevas entradas con fecha.
- Si cambiamos arquitectura, anotar motivo y trade-off.

## 7.1) Enfoque actual de trabajo

- Fase activa: mejora de experiencia visual e interfaz de usuario (UX/UI).
- Regla temporal: priorizar diseño, layout, jerarquia visual, microinteracciones y usabilidad.
- Si detectamos nuevas funciones en referencias de diseño:
  - primero documentarlas en este `Brain.md`,
  - luego planificar su implementación funcional por fases.
- Evitar mezclar desarrollo funcional profundo mientras estemos en fase de refinamiento visual, salvo ajustes mínimos necesarios para soportar la UI.

## 8) Bitacora de decisiones

### 2026-03-04
- Se decide empezar por UI primero.
- Se define Supabase para backend.
- Se confirma orquestador OpenClaw y n8n en VPS Dokploy.
- Se crea `Brain.md` como memoria principal del proyecto.
- Se implementa landing visual premium y panel funcional.
- Se habilita flujo MVP de ejecucion de agente con OpenRouter.
- Se define estrategia de despliegue en VPS Hostinger (Dokploy + subdominio).
- Se decide arquitectura con API propia para integrar n8n y CLAW.
- Se conecta panel con Supabase para persistencia real de `agents`.
- Se sincroniza landing/workflows con datos reales de `agents` en Supabase.
- Se implementan endpoints base:
  - `POST /api/tasks`
  - `POST /api/claw/delegate`
  - `POST /api/integrations/n8n/trigger`
  - `GET /api/runs/:id`
- Se agregan tablas `tasks` y `task_runs` al esquema SQL.
- Se agrega UI de orquestacion en `/panel` para crear tarea, delegar y consultar runs.
- Se valida en produccion la delegacion real a CLAW con estado final `completado`.
- Se corrige configuracion de OpenClaw eliminando clave `heartbeat` incompatible.
- Se define nueva prioridad de trabajo: iterar interfaz y experiencia visual con referencias de diseño (capturas), documentando funciones detectadas antes de implementarlas.
- Se implementa auto-polling de runs en panel (cada 3s, con pausa/reanudar y stop en estado terminal).
- Se aplica nueva direccion visual de referencia en landing (navbar + hero + geometria).
- Se crea la pagina separada de workflows con enfoque de producto visual (libreria + constructor).
- Se implementa base funcional del motor de workflows con ejecucion secuencial por nodo (`n8n`/`CLAW`) y registro de logs por run.

### 2026-03-05
- Se rediseña la sección `workflows` para aproximarla al look & feel de editor profesional (iconos, paneles y drag&drop visual).
- Se corrige error de build por `key` inválida en mapa de componentes de workflows.
- Se crea sección de agentes principales en landing con retratos de `CLAW`, `NOVA`, `PULSE` y capacidades operativas.
- Se ajusta encuadre individual de retratos para evitar cortes (incluyendo control específico de `NOVA`/`PULSE`).
- Se implementa `CLAW Hero` cinematográfico y se itera composición visual hasta versión full-bleed con sujeto recortado.
- Se integra `Claw1.png` como capa frontal principal del hero para mayor calidad visual.
- Se optimiza hero para móvil con layout y tamaños responsivos.
- Se elimina navegación superior de landing para simplificar foco visual y mantener CTA central.
- Se crea app-shell de `\`/panel\`` con sidebar de navegación por módulos.

### 2026-03-06
- Se crea base de trabajo autónomo del agente con:
  - reglas de proyecto (`.cursor/rules`),
  - skills de proyecto (`.cursor/skills`),
  - skills globales (`~/.cursor/skills`),
  - estructura de tickets (`tasks/`) y comando reutilizable `matrix-init`.
- `matrix-init` se amplía para incluir flujo de aprobación de diseño con carpeta `stitch/`.
- Se conecta Stitch MCP por OAuth y se valida integración con estado saludable (`Healthy 200`).
- Se prueba generación de pantallas en Stitch (hero desktop y mobile) y se documenta propuesta en `stitch/pending`.
- Se reorganiza Workflow Builder para claridad operacional:
  - categorías de paleta normalizadas,
  - social por plataforma,
  - settings por tabs.
- Se implementa Modo Matrix funcional:
  - ejecución secuencial de tareas pendientes,
  - selector real de agentes,
  - ejecución por `claw` / `agent` / `n8n`,
  - switch global ON/OFF con persistencia en Supabase.

## 9) Proxima accion inmediata

Consolidar y endurecer el Modo Matrix ya implementado:

- Aplicar migración SQL en Supabase para `system_settings` en todos los entornos.
- Añadir historial visual de cola Matrix (timeline + reintentos por tarea).
- Incorporar reintento selectivo de tareas fallidas desde UI.
- Endurecer seguridad (rotación de tokens expuestos y plan de RLS en Supabase).
- Definir versión final de navegación: mantener `\`/workflows\`` dedicado o integrarlo plenamente al app-shell de `\`/panel\``.

### Prioridad visual inmediata (activa)

- Revisar capturas de diseño que comparta el usuario.
- Extraer patrones visuales clave (grid, tipografía, densidad, componentes).
- Traducir esos patrones a un sistema visual consistente en la UI actual.
- Registrar en este documento cualquier funcionalidad nueva observada para posterior desarrollo.

#### Funcionalidades detectadas en referencias (pendientes funcionales)

- Navegación superior por secciones (`Workflows`, `Agentes`, `Arquitectura`, `Logs`) con estados activos.
- Modo/etiqueta de protocolo activo (`V4.0`) con posibles estados operativos.
- Figura de red/orquestación en hero con nodos de estado en vivo.
- Métricas de alto nivel en hero (uptime, latencia, agentes activos) conectadas a datos reales.
- Biblioteca de templates por categorias con despliegue rapido (`Deploy Template`).
- Constructor visual de workflow con modo de edicion y panel contextual por nodo.
- Mapping de entradas/salidas por nodo (schema de variables entre nodos).
- Consola de logs de ejecucion embebida en el editor.

## 10) Variables de entorno objetivo (produccion)

- `OPENROUTER_API_KEY`
- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo backend)
- `N8N_BASE_URL`
- `N8N_API_KEY` o token equivalente
- `CLAW_API_URL`
- `CLAW_API_TOKEN`
