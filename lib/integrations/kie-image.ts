const KIE_BASE_DEFAULT = "https://api.kie.ai";

export type KieImageSize = "1:1" | "3:2" | "2:3";

type KieEnvelope<T> = {
  code: number;
  msg: string;
  data: T | null;
};

type GenerateData = {
  taskId: string;
};

type RecordInfoData = {
  taskId?: string;
  status?: string;
  errorMessage?: string;
  response?: {
    resultUrls?: string[];
  };
};

function getKieApiKey(): string {
  const key = process.env.KIE_API_KEY?.trim();
  if (!key) {
    throw new Error(
      "Falta KIE_API_KEY en variables de entorno del servidor (kie.ai).",
    );
  }
  return key;
}

function kieBaseUrl(): string {
  return (process.env.KIE_API_BASE?.trim() || KIE_BASE_DEFAULT).replace(
    /\/$/,
    "",
  );
}

function sleep(ms: number) {
  return new Promise((r) => setTimeout(r, ms));
}

export function buildBoardroomIllustrationPrompt(userPrompt: string): string {
  const style =
    "Ilustración profesional para redes sociales (LinkedIn), estilo limpio e infográfico, colores equilibrados, sin texto pequeño ni letras ilegibles. ";
  const trimmed = userPrompt.trim();
  const maxUser = 5_500;
  return style + (trimmed.length > maxUser ? trimmed.slice(0, maxUser) : trimmed);
}

export async function kieCreateGpt4oImageTask(params: {
  prompt: string;
  size: KieImageSize;
}): Promise<string> {
  const apiKey = getKieApiKey();
  const res = await fetch(
    `${kieBaseUrl()}/api/v1/gpt4o-image/generate`,
    {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        prompt: params.prompt,
        size: params.size,
        uploadCn: false,
      }),
    },
  );

  const rawText = await res.text();
  let data: KieEnvelope<GenerateData>;
  try {
    data = JSON.parse(rawText) as KieEnvelope<GenerateData>;
  } catch {
    throw new Error(
      `KIE respondió sin JSON válido (HTTP ${res.status}). ${rawText.slice(0, 200)}`,
    );
  }

  if (data.code !== 200 || !data.data?.taskId) {
    const hint = data.msg || `HTTP ${res.status}`;
    throw new Error(`KIE no pudo crear la tarea de imagen: ${hint}`);
  }

  return data.data.taskId;
}

export async function kieGetGpt4oImageRecord(taskId: string): Promise<RecordInfoData> {
  const apiKey = getKieApiKey();
  const url = `${kieBaseUrl()}/api/v1/gpt4o-image/record-info?taskId=${encodeURIComponent(taskId)}`;
  const res = await fetch(url, {
    method: "GET",
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  const rawText = await res.text();
  let data: KieEnvelope<RecordInfoData>;
  try {
    data = JSON.parse(rawText) as KieEnvelope<RecordInfoData>;
  } catch {
    throw new Error(
      `KIE (detalle) respondió sin JSON válido (HTTP ${res.status}). ${rawText.slice(0, 200)}`,
    );
  }

  if (data.code !== 200 || data.data == null) {
    throw new Error(data.msg || `KIE record-info HTTP ${res.status}`);
  }

  return data.data;
}

export async function kiePollGpt4oImageUntilDone(
  taskId: string,
  options?: { maxWaitMs?: number; intervalMs?: number },
): Promise<string[]> {
  const maxWaitMs = options?.maxWaitMs ?? 120_000;
  const intervalMs = options?.intervalMs ?? 2_500;
  const deadline = Date.now() + maxWaitMs;

  while (Date.now() < deadline) {
    await sleep(intervalMs);
    const record = await kieGetGpt4oImageRecord(taskId);
    const status = record.status;

    if (status === "SUCCESS") {
      const urls = record.response?.resultUrls?.filter(
        (u) => typeof u === "string" && u.length > 0,
      );
      if (urls?.length) return urls;
      throw new Error("KIE completó la tarea pero no devolvió URLs de imagen.");
    }

    if (status === "CREATE_TASK_FAILED" || status === "GENERATE_FAILED") {
      const msg = record.errorMessage?.trim();
      throw new Error(
        msg || `Generación de imagen fallida (${status ?? "desconocido"}).`,
      );
    }

    // GENERATING o indefinido: seguir
  }

  throw new Error(
    "Tiempo de espera agotado generando la imagen en KIE. Reintenta en unos segundos.",
  );
}

export async function generateKieBoardroomIllustration(params: {
  userPrompt: string;
  size?: KieImageSize;
}): Promise<{ imageUrls: string[]; taskId: string }> {
  const size =
    (process.env.KIE_IMAGE_SIZE?.trim() as KieImageSize | undefined) ||
    params.size ||
    "1:1";

  const allowed: KieImageSize[] = ["1:1", "3:2", "2:3"];
  const safeSize = allowed.includes(size) ? size : "1:1";

  const prompt = buildBoardroomIllustrationPrompt(params.userPrompt);
  const taskId = await kieCreateGpt4oImageTask({ prompt, size: safeSize });
  const imageUrls = await kiePollGpt4oImageUntilDone(taskId);
  return { imageUrls, taskId };
}
