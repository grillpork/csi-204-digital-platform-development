"use client";

import Link from "next/link";
import { NavbarMenu } from "../../context/site";
import CartDrawer from "./CartDrawer";

export default function Navbar() {
  return (
    <nav className="fixed w-full px-4 py-6 z-30">
      <ul className="flex justify-around">
        <div className="text-white text-2xl font-bold">
          The Shirtsy
        </div>
        <div className="flex items-center gap-10">
          {NavbarMenu.map((item) => (
            <li key={item.label}>
              <Link
                href={item.href}
                className="text-white text-md hover:text-slate-200"
              >
                {item.label}
              </Link>
            </li>
          ))}

        </div>
        <div className="flex gap-6 items-center">
          <CartDrawer />
        </div>
      </ul>
    </nav>
  );
}
