import { NextResponse } from "next/server";
import { generateKieBoardroomIllustration } from "@/lib/integrations/kie-image";

type Body = {
  prompt?: string;
  size?: "1:1" | "3:2" | "2:3";
};

const MAX_LEN = 8_000;

export const maxDuration = 180;

export async function POST(request: Request) {
  try {
    const body = (await request.json().catch(() => ({}))) as Body;
    const prompt = (body.prompt ?? "").trim();

    if (!prompt) {
      return NextResponse.json(
        { error: "Falta el texto para generar la ilustración (prompt vacío)." },
        { status: 400 },
      );
    }

    if (prompt.length > MAX_LEN) {
      return NextResponse.json(
        {
          error: `El prompt es demasiado largo (máx. ${MAX_LEN} caracteres).`,
        },
        { status: 400 },
      );
    }

    const { imageUrls, taskId } = await generateKieBoardroomIllustration({
      userPrompt: prompt,
      size: body.size,
    });

    return NextResponse.json({ imageUrls, taskId });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo generar la ilustración en este momento.";
    return NextResponse.json({ error: message }, { status: 502 });
  }
}
