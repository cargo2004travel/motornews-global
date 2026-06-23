import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/require-admin";

const createSchema = z.object({
  name: z.string().min(1),
  url: z.string().url(),
  rssUrl: z.string().url(),
  country: z.string().min(1),
  language: z.string().min(1),
  category: z.string().min(1),
});

export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const json = await request.json().catch(() => null);
  const parsed = createSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: parsed.error.message }, { status: 400 });
  }

  const source = await prisma.source.create({ data: { ...parsed.data, active: true } });
  return NextResponse.json({ ok: true, source });
}
