"use client";

import Link from "@/components/ui/AppLink";
import { usePathname } from "next/navigation";
import type { NavLink } from "@/data/nav";

/** Desktop primary navigation; marks the current section with aria-current. */
export function NavLinks({ links }: { links: NavLink[] }) {
  const pathname = usePathname();
  return (
    <nav aria-label="Primary" className="hidden lg:block">
      <ul className="flex items-center gap-1">
        {links.map((l) => {
          const current = pathname === l.href ? "page" : pathname.startsWith(`${l.href}/`) ? "true" : undefined;
          return (
            <li key={l.href}>
              <Link href={l.href} className="nav-link" aria-current={current}>
                {l.label}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
