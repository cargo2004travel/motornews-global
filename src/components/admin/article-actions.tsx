"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function ArticleActions({
  id,
  status,
  featured,
}: {
  id: string;
  status: "PUBLISHED" | "HIDDEN" | "DRAFT";
  featured: boolean;
}) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function patch(data: Record<string, unknown>) {
    setLoading(true);
    await fetch(`/api/admin/articles/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(data),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <div className="flex gap-2">
      <button
        disabled={loading}
        onClick={() => patch({ status: status === "PUBLISHED" ? "HIDDEN" : "PUBLISHED" })}
        className="rounded bg-muted px-3 py-1 text-xs font-semibold hover:bg-border"
      >
        {status === "PUBLISHED" ? "Ocultar" : "Publicar"}
      </button>
      <button
        disabled={loading}
        onClick={() => patch({ featured: !featured })}
        className={`rounded px-3 py-1 text-xs font-semibold ${
          featured ? "bg-accent-yellow text-foreground" : "bg-muted text-muted-foreground"
        }`}
      >
        {featured ? "Destaque ✓" : "Destacar"}
      </button>
    </div>
  );
}
