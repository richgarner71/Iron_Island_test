"use client";

import Link from "next/link";
import React from "react";

export default function TopMenu() {
  return (
    <header className="w-full sticky top-0 z-40 bg-gray-900/90 backdrop-blur supports-[backdrop-filter]:bg-gray-900/70 border-b border-gray-800">
      <div className="max-w-6xl mx-auto px-4 py-2 flex items-center justify-between">
        {/* Left nav */}
        <nav className="flex items-center gap-2">
          <Link
            href="/"
            className="px-3 py-2 rounded-md text-sm font-semibold text-gray-200 hover:text-white hover:bg-gray-800"
          >
            Home
          </Link>
          <button
            data-nav="roster"
            className="px-3 py-2 rounded-md text-sm font-semibold text-gray-200 hover:text-white hover:bg-gray-800"
            onClick={() => {
              // Dispatch a custom event so the page can react without routing
              window.dispatchEvent(new CustomEvent("nav:go", { detail: { to: "roster" } }));
            }}
          >
            Roster
          </button>
          <button
            data-nav="equipment"
            className="px-3 py-2 rounded-md text-sm font-semibold text-gray-200 hover:text-white hover:bg-gray-800"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("nav:go", { detail: { to: "equipment" } }));
            }}
          >
            Equipment
          </button>
          <button
            data-nav="orbitalMap"
            className="px-3 py-2 rounded-md text-sm font-semibold text-gray-200 hover:text-white hover:bg-gray-800"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("nav:go", { detail: { to: "orbitalMap" } }));
            }}
          >
            Orbital Map
          </button>
          <button
            data-nav="battle"
            className="px-3 py-2 rounded-md text-sm font-semibold text-gray-200 hover:text-white hover:bg-gray-800"
            onClick={() => {
              window.dispatchEvent(new CustomEvent("nav:go", { detail: { to: "battle" } }));
            }}
          >
            Battle
          </button>
        </nav>

        {/* Right reserved space for future features */}
        <div className="flex items-center gap-3 text-gray-400">
          <div className="text-xs uppercase tracking-widest">Reserved</div>
          <div className="w-40 h-8 rounded bg-gray-800/70 border border-gray-700" />
        </div>
      </div>
    </header>
  );
}