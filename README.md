## Agentes Matrix Web

Frontend para visualizar y configurar agentes del sistema multiagente.

## Desarrollo local

1. Instalar dependencias:

```bash
npm install
```

2. Configurar variables de entorno:

```bash
cp .env.example .env.local
```

Luego edita `.env.local` y coloca tu key:

```bash
OPENROUTER_API_KEY=tu_api_key_de_openrouter
```

3. Ejecutar:

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000).

## OpenRouter (MVP)

- En `/panel` puedes editar `provider`, `model`, `system prompt` y `temperature`.
- Botón `Probar agente` llama al endpoint backend:
  - `POST /api/agents/run`
- El frontend nunca expone la key; la llamada a OpenRouter ocurre del lado servidor.

## Supabase (persistencia de agentes)

1. En Supabase SQL Editor ejecuta el script:
   - `supabase/schema.sql`
2. Configura en tu entorno:
   - `SUPABASE_URL`
   - `SUPABASE_ANON_KEY`
   - `SUPABASE_SERVICE_ROLE_KEY`
3. Reinicia/redeploy para que `/panel` use carga y guardado real de agentes.

## Endpoints base de orquestacion

- `POST /api/tasks` crea una tarea en `tasks`.
- `POST /api/claw/delegate` delega una tarea a tu API de CLAW y registra `task_runs`.
- `POST /api/integrations/n8n/trigger` dispara un webhook n8n y registra `task_runs` (si envias `taskId`).
- `GET /api/runs/:id` consulta estado/salida de una ejecucion.

En `/panel` existe un bloque visual de orquestacion para ejecutar este flujo desde UI.

Nota de configuración CLAW:

- Opción A: usar `CLAW_API_URL` + `CLAW_DELEGATE_PATH`.
- Opción B (preferida cuando no conoces el path): usar `CLAW_DELEGATE_URL` con URL completa.
- Si `CLAW_DELEGATE_URL` existe, tiene prioridad sobre las otras dos.

## Próximos pasos

- Persistencia de agentes en Supabase.
- CRUD real de workflows.
- Streaming de respuesta en tiempo real.

## Deploy en Dokploy (VPS)

Configuración recomendada:

- Provider: `Git` (GitHub repo)
- Branch: `main`
- Build Type: `Dockerfile`
- Dockerfile Path: `./Dockerfile`
- Port interno: `3000`

Variables de entorno mínimas:

- `OPENROUTER_API_KEY`
- `NODE_ENV=production`

Si usas Supabase/n8n/CLAW en producción, agrega también:

- `SUPABASE_URL`
- `SUPABASE_ANON_KEY`
- `SUPABASE_SERVICE_ROLE_KEY` (solo backend)
- `N8N_BASE_URL`
- `N8N_API_KEY`
- `CLAW_API_URL`
- `CLAW_API_TOKEN`

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
