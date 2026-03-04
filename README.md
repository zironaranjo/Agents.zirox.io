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

## Próximos pasos

- Persistencia de agentes en Supabase.
- CRUD real de workflows.
- Streaming de respuesta en tiempo real.

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
