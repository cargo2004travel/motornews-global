import { NextRequest, NextResponse } from "next/server";
import { runNewsImport } from "@/lib/news-importer";

export const maxDuration = 300;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const headerToken = request.headers.get("authorization")?.replace("Bearer ", "");
  const queryToken = request.nextUrl.searchParams.get("token");
  return headerToken === secret || queryToken === secret;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const sourceLimitParam = request.nextUrl.searchParams.get("sourceLimit");
  const sourceNameFilter = request.nextUrl.searchParams.get("source") ?? undefined;

  try {
    const { summaries, totalImported } = await runNewsImport({
      sourceLimit: sourceLimitParam ? Number(sourceLimitParam) : undefined,
      sourceNameFilter,
    });
    return NextResponse.json({
      ok: true,
      totalImported,
      executedAt: new Date().toISOString(),
      summaries,
    });
  } catch (err) {
    return NextResponse.json(
      { ok: false, error: err instanceof Error ? err.message : String(err) },
      { status: 500 },
    );
  }
}

export async function POST(request: NextRequest) {
  return GET(request);
}
