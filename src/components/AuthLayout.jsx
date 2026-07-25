import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function AuthLayout({ title, subtitle, children, footer }) {
  return (
    <div className="grid min-h-screen lg:grid-cols-[minmax(0,1fr)_minmax(0,1.1fr)]">
      {/* Branding panel */}
      <div className="relative hidden overflow-hidden bg-teal-950 px-12 py-14 text-sand lg:flex lg:flex-col lg:justify-between">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              'radial-gradient(circle, #F7F2E7 1.5px, transparent 1.6px)',
            backgroundSize: '26px 26px',
          }}
        />
        <Link to="/" className="relative flex items-center gap-3">
          <Logo size={40} />
          <span className="font-display text-xl font-semibold">TicketQR</span>
        </Link>

        <div className="relative max-w-sm">
          <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
            Billetterie pour le Bénin
          </p>
          <h2 className="font-display text-4xl font-medium leading-tight">
            Un ticket, un QR, une seule entrée possible.
          </h2>
          <p className="mt-4 text-sm leading-relaxed text-sand/70">
            Créez votre événement, encaissez en physique, et laissez chaque
            invité entrer avec un QR code personnel qui s'invalide dès son
            premier scan.
          </p>
        </div>

        {/* Signature: a tilted ticket stub, echoing the app icon */}
        <div className="relative">
          <div className="stub-card relative w-64 -rotate-3 border border-sand/15 bg-teal-900/60 p-5 backdrop-blur-sm">
            <span className="stub-notch stub-notch--left" style={{ background: '#0B4F47' }} />
            <span className="stub-notch stub-notch--right" style={{ background: '#0B4F47' }} />
            <p className="text-[11px] uppercase tracking-wide text-amber-400">Gala · Cotonou</p>
            <p className="mt-1 font-display text-lg">Soirée de gala 2026</p>
            <div className="my-3 border-t border-dashed border-sand/25" />
            <div className="flex items-center justify-between font-mono text-[11px] text-sand/60">
              <span>N° 4F9A2C1E</span>
              <span className="rounded-full bg-amber-500/90 px-2 py-0.5 font-body font-semibold text-teal-950">
                Valide
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Form panel */}
      <div className="flex flex-col justify-center px-6 py-12 sm:px-12 lg:px-20">
        <div className="mx-auto w-full max-w-sm">
          <Link to="/" className="mb-8 flex items-center gap-2.5 lg:hidden">
            <Logo size={34} />
            <span className="font-display text-lg font-semibold text-teal-950">TicketQR</span>
          </Link>
          <h1 className="font-display text-2xl font-semibold text-ink">{title}</h1>
          {subtitle && <p className="mt-1.5 text-sm text-ink/55">{subtitle}</p>}
          <div className="mt-8">{children}</div>
          {footer && <div className="mt-6 text-sm text-ink/60">{footer}</div>}
        </div>
      </div>
    </div>
  );
}
