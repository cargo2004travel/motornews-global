import { NextRequest, NextResponse } from "next/server";
import { z } from "zod";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";

const bodySchema = z.object({ email: z.string().email() });

async function notifyAdminOfNewSubscriber(email: string) {
  const apiKey = process.env.RESEND_API_KEY;
  const adminEmail = process.env.ADMIN_EMAIL;
  if (!apiKey || !adminEmail) return;

  try {
    const resend = new Resend(apiKey);
    const fromAddress = process.env.NEWSLETTER_FROM_EMAIL ?? "MotorNews Global <onboarding@resend.dev>";
    await resend.emails.send({
      from: fromAddress,
      to: adminEmail,
      subject: "Novo assinante da newsletter",
      html: `<p>Novo e-mail cadastrado na newsletter do MotorNews Global:</p><p><strong>${email}</strong></p>`,
    });
  } catch {
    // Não bloqueia o cadastro do assinante se o e-mail de aviso falhar.
  }
}

export async function POST(request: NextRequest) {
  const json = await request.json().catch(() => null);
  const parsed = bodySchema.safeParse(json);
  if (!parsed.success) {
    return NextResponse.json({ error: "E-mail inválido" }, { status: 400 });
  }

  await prisma.newsletterSubscriber.upsert({
    where: { email: parsed.data.email },
    create: { email: parsed.data.email },
    update: {},
  });

  await notifyAdminOfNewSubscriber(parsed.data.email);

  return NextResponse.json({ ok: true });
}
