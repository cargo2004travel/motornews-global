"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export function SourceToggle({ id, active }: { id: string; active: boolean }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function toggle() {
    setLoading(true);
    await fetch(`/api/admin/sources/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ active: !active }),
    });
    setLoading(false);
    router.refresh();
  }

  return (
    <button
      onClick={toggle}
      disabled={loading}
      className={`rounded px-3 py-1 text-xs font-semibold ${
        active ? "bg-accent-blue text-white" : "bg-muted text-muted-foreground"
      }`}
    >
      {active ? "Ativa" : "Inativa"}
    </button>
  );
}
