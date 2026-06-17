"use client";

import Link from "next/link";
import { NavbarMenu } from "../../context/site";

export default function Navbar() {
  return (
    <nav className="border-b border-slate-200 bg-white px-4 py-3 shadow-sm">
      <ul className="flex gap-6">
        {NavbarMenu.map((item) => (
          <li key={item.href}>
            <Link
              href={item.href}
              className="text-slate-700 hover:text-slate-900"
            >
              {item.label}
            </Link>
          </li>
        ))}
      </ul>
    </nav>
  );
}
