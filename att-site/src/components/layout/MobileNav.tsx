"use client";

import { useEffect, useRef, useState } from "react";
import Link from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import { mobileNav } from "@/data/nav";
import { mobileNavEs, ui, type Locale } from "@/data/i18n";
import { CloseIcon, MenuIcon } from "@/components/ui/Icons";

/** Menu button + panel for small screens. Closes on navigation, Escape, and returns focus to the button. */
export function MobileNav({ locale = "en" }: { locale?: Locale }) {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const buttonRef = useRef<HTMLButtonElement>(null);
  const panelRef = useRef<HTMLDivElement>(null);

  // Close the panel whenever the route changes.
  const [lastPath, setLastPath] = useState(pathname);
  if (pathname !== lastPath) {
    setLastPath(pathname);
    setOpen(false);
  }

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") {
        setOpen(false);
        buttonRef.current?.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    panelRef.current?.querySelector<HTMLElement>("a")?.focus();
    return () => document.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <div className="lg:hidden">
      <button
        ref={buttonRef}
        type="button"
        className="icon-btn"
        aria-expanded={open}
        aria-controls="mobile-menu"
        onClick={() => setOpen((o) => !o)}
      >
        {open ? <CloseIcon /> : <MenuIcon />}
        <span className="sr-only">{open ? ui[locale].menuClose : ui[locale].menuOpen}</span>
      </button>
      <div id="mobile-menu" ref={panelRef} hidden={!open} className="mobile-menu">
        <nav aria-label={locale === "es" ? "Menú móvil" : "Mobile"}>
          {(locale === "es" ? mobileNavEs : mobileNav).map((group) => (
            <div key={group.heading} className="py-3">
              <p className="mobile-menu-heading">{group.heading}</p>
              <ul>
                {group.links.map((l) => (
                  <li key={l.href}>
                    <Link
                      href={l.href}
                      className="mobile-menu-link"
                      aria-current={pathname === l.href ? "page" : undefined}
                      onClick={() => setOpen(false)}
                    >
                      {l.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </nav>
      </div>
    </div>
  );
}
