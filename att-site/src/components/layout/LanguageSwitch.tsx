"use client";

import Link from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { counterpartPath, ui, type Locale } from "@/data/i18n";

/** Link to the same page in the other language (or that language's home page when there is no counterpart). */
export function LanguageSwitch({ locale }: { locale: Locale }) {
  const pathname = usePathname();
  const to: Locale = locale === "es" ? "en" : "es";
  return (
    <Link href={counterpartPath(pathname, to)} lang={ui[locale].switchLang} hrefLang={to === "es" ? "es-US" : "en-US"} className="lang-switch">
      {ui[locale].switchLabel}
    </Link>
  );
}
