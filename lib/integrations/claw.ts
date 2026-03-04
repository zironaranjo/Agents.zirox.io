type DelegateToClawInput = {
  taskId: string;
  agentId?: string;
  instructions: string;
  input?: unknown;
  context?: Record<string, unknown>;
};

function getRequiredEnv(name: string) {
  const value = process.env[name];
  if (!value) {
    throw new Error(`Falta ${name} en variables de entorno.`);
  }
  return value;
}

export async function delegateToClaw(payload: DelegateToClawInput) {
  const token = getRequiredEnv("CLAW_API_TOKEN");
  const explicitDelegateUrl = process.env.CLAW_DELEGATE_URL;

  const endpoint = explicitDelegateUrl
    ? explicitDelegateUrl
    : (() => {
        const baseUrl = getRequiredEnv("CLAW_API_URL");
        const delegatePath = process.env.CLAW_DELEGATE_PATH ?? "/delegate";
        return `${baseUrl.replace(/\/$/, "")}${delegatePath.startsWith("/") ? delegatePath : `/${delegatePath}`}`;
      })();

  const response = await fetch(endpoint, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(payload),
  });

  const data = (await response.json().catch(() => ({}))) as Record<string, unknown>;

  if (!response.ok) {
    const allowHeader = response.headers.get("allow");
    const rawDetail =
      typeof data?.error === "string"
        ? data.error
        : typeof data?.message === "string"
          ? data.message
          : JSON.stringify(data);

    const details = [
      `CLAW devolvio status ${response.status}.`,
      `Endpoint probado: ${endpoint}`,
      "Metodo enviado: POST",
      allowHeader ? `Metodos permitidos: ${allowHeader}` : "",
      rawDetail ? `Detalle: ${rawDetail}` : "",
    ]
      .filter(Boolean)
      .join(" ");

    throw new Error(details);
  }

  return data;
}
