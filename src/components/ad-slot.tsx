"use client";

import { useEffect, useRef } from "react";

const ADSENSE_CLIENT_ID = process.env.NEXT_PUBLIC_ADSENSE_CLIENT_ID;

/**
 * Slot de anúncio do Google AdSense. Só renderiza algo quando
 * NEXT_PUBLIC_ADSENSE_CLIENT_ID estiver configurado — sem isso, fica vazio
 * (não quebra o layout enquanto a conta AdSense não for aprovada).
 */
export function AdSlot({
  slotId,
  format = "auto",
  className,
}: {
  slotId: string;
  format?: string;
  className?: string;
}) {
  const ref = useRef<HTMLModElement>(null);
  const pushed = useRef(false);

  useEffect(() => {
    const isPlaceholder = /^(.)\1+$/.test(slotId) || slotId === "1234567890" || !/^\d+$/.test(slotId);
    if (!ADSENSE_CLIENT_ID || isPlaceholder || pushed.current) return;
    pushed.current = true;
    try {
      (window as unknown as { adsbygoogle?: unknown[] }).adsbygoogle ??= [];
      (window as unknown as { adsbygoogle: unknown[] }).adsbygoogle.push({});
    } catch {
      // ignora erros de carregamento do AdSense (ex.: bloqueador de anúncios)
    }
  }, [slotId]);

  const isPlaceholder = /^(.)\1+$/.test(slotId) || slotId === "1234567890" || !/^\d+$/.test(slotId);

  if (!ADSENSE_CLIENT_ID || isPlaceholder) {
    return <div className={className} />;
  }

  return (
    <ins
      ref={ref}
      className={`adsbygoogle block ${className ?? ""}`}
      style={{ display: "block" }}
      data-ad-client={ADSENSE_CLIENT_ID}
      data-ad-slot={slotId}
      data-ad-format={format}
      data-full-width-responsive="true"
    />
  );
}
