"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <nav className="w-full bg-gray-900 text-white px-6 py-4 flex items-center justify-between shadow-md">
      {/* Logo */}
      <Link href="/" className="text-2xl font-bold hover:text-gray-300">
        🎨 ScribbleClone
      </Link>

      {/* Nav Links */}
      <div className="space-x-6">
        <Link href="/" className="hover:text-gray-300">
          Home
        </Link>
        <Link href="/room/123" className="hover:text-gray-300">
          Play
        </Link>
        <Link href="/about" className="hover:text-gray-300">
          About
        </Link>
      </div>
    </nav>
  );
}
