import { createHmac, timingSafeEqual } from "crypto";

export const ADMIN_COOKIE_NAME = "mng_admin_session";

function secret(): string {
  return process.env.ADMIN_PASSWORD ?? "";
}

export function createSessionToken(): string {
  return createHmac("sha256", secret()).update("admin-session").digest("hex");
}

export function isValidCredentials(email: string, password: string): boolean {
  const expectedEmail = process.env.ADMIN_EMAIL ?? "";
  const expectedPassword = process.env.ADMIN_PASSWORD ?? "";
  if (!expectedEmail || !expectedPassword) return false;
  return email === expectedEmail && password === expectedPassword;
}

export function isValidSessionToken(token: string | undefined): boolean {
  if (!token || !secret()) return false;
  const expected = createSessionToken();
  const a = Buffer.from(token);
  const b = Buffer.from(expected);
  if (a.length !== b.length) return false;
  return timingSafeEqual(a, b);
}
