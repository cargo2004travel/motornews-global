"use client";

import { useRouter } from "next/navigation";
import { useState, type FormEvent } from "react";
import { CATEGORIES } from "@/config/taxonomy";

export function AddSourceForm() {
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSubmit(e: FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);
    setError(null);
    const formData = new FormData(e.currentTarget);
    const payload = Object.fromEntries(formData.entries());

    const res = await fetch("/api/admin/sources", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    setLoading(false);
    if (res.ok) {
      e.currentTarget.reset();
      router.refresh();
    } else {
      const data = await res.json().catch(() => ({}));
      setError(data.error ?? "Erro ao adicionar fonte");
    }
  }

  return (
    <form onSubmit={handleSubmit} className="grid gap-3 rounded border border-border p-4 sm:grid-cols-2">
      <input name="name" placeholder="Nome do veículo" required className="rounded border border-border px-3 py-2 text-sm" />
      <input name="url" placeholder="https://site.com" required type="url" className="rounded border border-border px-3 py-2 text-sm" />
      <input name="rssUrl" placeholder="https://site.com/feed" required type="url" className="rounded border border-border px-3 py-2 text-sm" />
      <input name="country" placeholder="País" required className="rounded border border-border px-3 py-2 text-sm" />
      <input name="language" placeholder="Idioma (ex: pt-BR)" required className="rounded border border-border px-3 py-2 text-sm" />
      <select name="category" required className="rounded border border-border px-3 py-2 text-sm">
        {CATEGORIES.map((c) => (
          <option key={c.slug} value={c.name}>
            {c.name}
          </option>
        ))}
      </select>
      <div className="sm:col-span-2">
        {error && <p className="mb-2 text-sm text-accent-red">{error}</p>}
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-foreground px-4 py-2 text-sm font-semibold text-white hover:bg-accent-red disabled:opacity-50"
        >
          {loading ? "Adicionando…" : "Adicionar fonte"}
        </button>
      </div>
    </form>
  );
}
