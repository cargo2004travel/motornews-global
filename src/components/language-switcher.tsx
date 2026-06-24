"use client";

import { useEffect, useState } from "react";
import Script from "next/script";

declare global {
  interface Window {
    googleTranslateElementInit?: () => void;
    google?: {
      translate?: {
        TranslateElement: new (options: Record<string, unknown>, elementId: string) => unknown;
      };
    };
  }
}

const LANGUAGES = [
  { code: "pt", label: "Português" },
  { code: "en", label: "Inglês" },
  { code: "es", label: "Espanhol" },
  { code: "fr", label: "Francês" },
  { code: "de", label: "Alemão" },
  { code: "zh-CN", label: "Chinês" },
];

function getGoogTransCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)googtrans=([^;]*)/);
  return match ? decodeURIComponent(match[1]) : null;
}

function clearGoogTransCookie() {
  const expire = "expires=Thu, 01 Jan 1970 00:00:00 UTC";
  document.cookie = `googtrans=; ${expire}; path=/;`;
  document.cookie = `googtrans=; ${expire}; path=/; domain=${location.hostname}`;
  document.cookie = `googtrans=; ${expire}; path=/; domain=.${location.hostname}`;
}

function setGoogTransCookie(targetCode: string) {
  const value = `/pt/${targetCode}`;
  document.cookie = `googtrans=${value}; path=/;`;
  document.cookie = `googtrans=${value}; path=/; domain=${location.hostname}`;
}

/**
 * Tradução client-side via Google Translate (widget oficial). Não traduz o
 * conteúdo armazenado no banco — apenas a página renderizada, sob demanda,
 * para os idiomas selecionados além do português original.
 *
 * O Google Translate guarda o idioma escolhido num cookie (`googtrans`) que
 * persiste entre recarregamentos. Lemos esse cookie ao montar o componente
 * para o menu sempre refletir o idioma real da página (e não ficar "preso"
 * em português visualmente enquanto o conteúdo está traduzido).
 */
export function LanguageSwitcher() {
  const [current, setCurrent] = useState("pt");

  useEffect(() => {
    const cookie = getGoogTransCookie();
    if (cookie) {
      const target = cookie.split("/")[2];
      if (target) setCurrent(target);
    }

    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "pt",
            includedLanguages: "en,fr,de,es,zh-CN",
            autoDisplay: false,
          },
          "google_translate_element",
        );
      }
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value;
    if (code === "pt") {
      clearGoogTransCookie();
    } else {
      setGoogTransCookie(code);
    }
    location.reload();
  }

  return (
    <>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div id="google_translate_element" className="hidden notranslate" translate="no" />
      <select
        onChange={handleChange}
        value={current}
        aria-label="Traduzir página"
        translate="no"
        className="notranslate rounded border border-border bg-background px-2 py-1.5 text-xs"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code} className="notranslate">
            {lang.label}
          </option>
        ))}
      </select>
    </>
  );
}
