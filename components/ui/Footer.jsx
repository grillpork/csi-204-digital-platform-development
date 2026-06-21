"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { FooterMenu } from "../../context/site";

export default function Footer() {
  const pathname = usePathname();

  // Hide footer on docs pages
  if (pathname?.startsWith("/docs")) {
    return null;
  }

  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
      <ul className="flex flex-wrap gap-4">
        {FooterMenu.map((item) => (
          <li key={item.label}>
            <Link href={item.href} className="hover:text-slate-900">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}
