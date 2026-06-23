import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { prisma } from "@/lib/prisma";
import { isAdminRequest } from "@/lib/require-admin";
import { ArticleStatus } from "@/generated/prisma/client";

const patchSchema = z.object({
  status: z.enum([ArticleStatus.PUBLISHED, ArticleStatus.HIDDEN]).optional(),
  featured: z.boolean().optional(),
});

export async function PATCH(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  if (!(await isAdminRequest())) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const { id } = await params;
  const json = await request.json().catch(() => null);
  const parsed = patchSchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "Dados inválidos" }, { status: 400 });
  }

  const article = await prisma.article.update({ where: { id }, data: parsed.data });
  return NextResponse.json({ ok: true, article });
}
