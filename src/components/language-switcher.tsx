"use client";

import { useEffect } from "react";
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
  { code: "en", label: "English" },
  { code: "fr", label: "Français" },
  { code: "de", label: "Deutsch" },
  { code: "es", label: "Español" },
  { code: "it", label: "Italiano" },
  { code: "zh-CN", label: "中文" },
];

/**
 * Tradução client-side via Google Translate (widget oficial). Não traduz o
 * conteúdo armazenado no banco — apenas a página renderizada, sob demanda,
 * para os 6 idiomas pedidos além do português original.
 */
export function LanguageSwitcher() {
  useEffect(() => {
    window.googleTranslateElementInit = () => {
      if (window.google?.translate) {
        new window.google.translate.TranslateElement(
          {
            pageLanguage: "pt",
            includedLanguages: "en,fr,de,es,it,zh-CN",
            autoDisplay: false,
          },
          "google_translate_element",
        );
      }
    };
  }, []);

  function handleChange(e: React.ChangeEvent<HTMLSelectElement>) {
    const code = e.target.value;
    const combo = document.querySelector<HTMLSelectElement>("#google_translate_element select");
    if (combo) {
      combo.value = code === "pt" ? "" : code;
      combo.dispatchEvent(new Event("change"));
    }
  }

  return (
    <>
      <Script
        src="https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit"
        strategy="afterInteractive"
      />
      <div id="google_translate_element" className="hidden" />
      <select
        onChange={handleChange}
        defaultValue="pt"
        aria-label="Traduzir página"
        className="rounded border border-border bg-background px-2 py-1.5 text-xs"
      >
        {LANGUAGES.map((lang) => (
          <option key={lang.code} value={lang.code}>
            {lang.label}
          </option>
        ))}
      </select>
    </>
  );
}
