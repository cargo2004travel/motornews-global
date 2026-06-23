"use client";

import { useState, type FormEvent } from "react";

export function NewsletterForm({ compact = false }: { compact?: boolean }) {
  const [email, setEmail] = useState("");
  const [status, setStatus] = useState<"idle" | "loading" | "done" | "error">("idle");

  async function handleSubmit(e: FormEvent) {
    e.preventDefault();
    setStatus("loading");
    try {
      const res = await fetch("/api/newsletter", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      setStatus(res.ok ? "done" : "error");
    } catch {
      setStatus("error");
    }
  }

  if (status === "done") {
    return <p className="text-sm font-medium text-accent-blue">Inscrição confirmada! Obrigado.</p>;
  }

  return (
    <form onSubmit={handleSubmit} className={compact ? "flex gap-2" : "space-y-2"}>
      <input
        type="email"
        required
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="seu@email.com"
        className="w-full rounded border border-border px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-blue"
      />
      <button
        type="submit"
        disabled={status === "loading"}
        className="rounded bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-accent-red disabled:opacity-50"
      >
        {status === "loading" ? "Enviando…" : "Assinar"}
      </button>
      {status === "error" && <p className="text-xs text-accent-red">Não foi possível assinar. Tente novamente.</p>}
    </form>
  );
}
