import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    const { data, error } = await supabase
      .from("task_runs")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      return NextResponse.json(
        { error: `No se pudo leer run: ${error.message}` },
        { status: 404 },
      );
    }

    return NextResponse.json({ run: data });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo leer la ejecucion.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
