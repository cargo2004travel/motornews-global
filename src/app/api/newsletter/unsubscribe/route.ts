import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { SITE_URL } from "@/config/site";

export async function GET(request: NextRequest) {
  const id = request.nextUrl.searchParams.get("id");
  if (id) {
    await prisma.newsletterSubscriber.delete({ where: { id } }).catch(() => {});
  }
  return NextResponse.redirect(`${SITE_URL}/newsletter?unsubscribed=1`);
}
