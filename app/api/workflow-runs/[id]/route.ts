import { NextResponse } from "next/server";
import { getSupabaseServerClient } from "@/lib/supabase/server";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await params;
    const supabase = getSupabaseServerClient();

    const [{ data: run, error: runError }, { data: logs, error: logsError }] =
      await Promise.all([
        supabase.from("workflow_runs").select("*").eq("id", id).single(),
        supabase
          .from("workflow_run_logs")
          .select("*")
          .eq("workflow_run_id", id)
          .order("created_at", { ascending: true }),
      ]);

    if (runError || !run) {
      return NextResponse.json(
        { error: `No se pudo leer workflow run: ${runError?.message ?? "no encontrado"}` },
        { status: 404 },
      );
    }

    if (logsError) {
      return NextResponse.json(
        { error: `No se pudieron leer logs del run: ${logsError.message}` },
        { status: 500 },
      );
    }

    return NextResponse.json({ run, logs: logs ?? [] });
  } catch (error) {
    const message =
      error instanceof Error ? error.message : "No se pudo leer workflow run.";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
