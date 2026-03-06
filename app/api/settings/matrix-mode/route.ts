import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

type MatrixModePayload = {
  enabled?: boolean;
};

export async function GET() {
  try {
    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("system_settings")
      .select("id,matrix_mode_enabled")
      .eq("id", "global")
      .single();

    if (error) {
      return NextResponse.json(
        { error: `No se pudo leer matrix mode: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      enabled: Boolean(data?.matrix_mode_enabled),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo leer configuración de Matrix Mode.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const body = (await request.json()) as MatrixModePayload;
    if (typeof body.enabled !== "boolean") {
      return NextResponse.json(
        { error: "Debes enviar enabled (boolean)." },
        { status: 400 },
      );
    }

    const supabase = getSupabaseServerClient();
    const { data, error } = await supabase
      .from("system_settings")
      .upsert(
        {
          id: "global",
          matrix_mode_enabled: body.enabled,
        },
        { onConflict: "id" },
      )
      .select("id,matrix_mode_enabled")
      .single();

    if (error) {
      return NextResponse.json(
        { error: `No se pudo actualizar matrix mode: ${error.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({
      enabled: Boolean(data?.matrix_mode_enabled),
    });
  } catch (error) {
    const message =
      error instanceof Error
        ? error.message
        : "No se pudo actualizar configuración de Matrix Mode.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
