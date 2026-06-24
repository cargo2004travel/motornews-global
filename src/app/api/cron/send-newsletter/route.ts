import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { prisma } from "@/lib/prisma";
import { getTopArticlesOfDay } from "@/lib/newsletter";
import { buildNewsletterHtml } from "@/lib/newsletter-email";
import { SITE_URL } from "@/config/site";

export const maxDuration = 120;

function isAuthorized(request: NextRequest): boolean {
  const secret = process.env.CRON_SECRET;
  if (!secret) return false;
  const headerToken = request.headers.get("authorization")?.replace("Bearer ", "");
  const queryToken = request.nextUrl.searchParams.get("token");
  return headerToken === secret || queryToken === secret;
}

function chunk<T>(items: T[], size: number): T[][] {
  const out: T[][] = [];
  for (let i = 0; i < items.length; i += size) out.push(items.slice(i, i + size));
  return out;
}

export async function GET(request: NextRequest) {
  if (!isAuthorized(request)) {
    return NextResponse.json({ error: "Não autorizado" }, { status: 401 });
  }

  const apiKey = process.env.RESEND_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "RESEND_API_KEY não configurada" }, { status: 500 });
  }

  const articles = await getTopArticlesOfDay(10);
  if (articles.length === 0) {
    return NextResponse.json({ ok: false, error: "Nenhuma notícia disponível para enviar" });
  }

  const subscribers = await prisma.newsletterSubscriber.findMany({ select: { id: true, email: true } });
  if (subscribers.length === 0) {
    return NextResponse.json({ ok: true, sent: 0, message: "Nenhum assinante cadastrado" });
  }

  const resend = new Resend(apiKey);
  const fromAddress = process.env.NEWSLETTER_FROM_EMAIL ?? "MotorNews Global <onboarding@resend.dev>";

  let sent = 0;
  let errors = 0;

  for (const batch of chunk(subscribers, 50)) {
    const results = await Promise.allSettled(
      batch.map((subscriber) => {
        const unsubscribeUrl = `${SITE_URL}/api/newsletter/unsubscribe?id=${subscriber.id}`;
        return resend.emails.send({
          from: fromAddress,
          to: subscriber.email,
          subject: "As principais notícias de automobilismo e motociclismo de hoje",
          html: buildNewsletterHtml(articles, unsubscribeUrl),
        });
      }),
    );
    for (const r of results) {
      if (r.status === "fulfilled") sent += 1;
      else errors += 1;
    }
  }

  return NextResponse.json({ ok: true, sent, errors, totalSubscribers: subscribers.length, articles: articles.length });
}
