import React from "react";
import { Link } from "react-router-dom";
import Logo from "@/components/Logo";

export default function Footer() {
  return (
    <footer className="border-t border-teal-900/10 bg-teal-950 text-sand">
      <div className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <div className="flex flex-col items-start justify-between gap-6 sm:flex-row sm:items-center">
          <div className="flex items-center gap-2.5">
            <Logo size={28} />
            <span className="font-display text-lg font-semibold">TicketQR</span>
          </div>
          <nav className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-sand/70">
            <Link to="/privacy" className="hover:text-sand">Politique de confidentialité</Link>
            <Link to="/terms" className="hover:text-sand">Conditions d'utilisation</Link>
          </nav>
        </div>
        <p className="mt-6 text-xs text-sand/40">
          © {new Date().getFullYear()} TicketQR — InnovaTech, Cotonou, Bénin.
        </p>
      </div>
    </footer>
  );
}