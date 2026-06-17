"use client";

import Link from "next/link";
import { FooterMenu } from "../../context/site";

export default function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-slate-50 px-4 py-6 text-sm text-slate-600">
      <ul className="flex flex-wrap gap-4">
        {FooterMenu.map((item) => (
          <li key={item.href}>
            <Link href={item.href} className="hover:text-slate-900">
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </footer>
  );
}
