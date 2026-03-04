type TriggerN8nInput = {
  webhookPathOrUrl: string;
  payload: Record<string, unknown>;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta ${name} en variables de entorno.`);
  }
  return value;
}

function buildWebhookUrl(pathOrUrl: string) {
  if (/^https?:\/\//i.test(pathOrUrl)) {
    return pathOrUrl;
  }

  const baseUrl = getRequiredEnv("N8N_BASE_URL").replace(/\/$/, "");
  const normalizedPath = pathOrUrl.startsWith("/") ? pathOrUrl : `/${pathOrUrl}`;
  return `${baseUrl}${normalizedPath}`;
}

export async function triggerN8nWebhook(input: TriggerN8nInput) {
  const webhookUrl = buildWebhookUrl(input.webhookPathOrUrl);
  const apiKey = process.env.N8N_API_KEY;

  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };

  if (apiKey) {
    headers.Authorization = `Bearer ${apiKey}`;
    headers["x-n8n-api-key"] = apiKey;
  }

  const response = await fetch(webhookUrl, {
    method: "POST",
    headers,
    body: JSON.stringify(input.payload),
  });

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    const message =
      typeof data?.error === "string"
        ? data.error
        : `n8n devolvio status ${response.status}`;
    throw new Error(message);
  }

  return data;
}
