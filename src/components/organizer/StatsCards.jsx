import React from 'react';
import { formatFcfa } from '@/lib/utils';

export default function StatsCards({ reservations, tickets }) {
  const sold = tickets.filter((t) => t.kind === 'sale' && ['valid', 'used'].includes(t.status)).length;
  const gifts = tickets.filter((t) => t.kind === 'gift' && ['valid', 'used'].includes(t.status)).length;
  const revenue = reservations
    .filter((r) => r.kind === 'sale' && r.status === 'approved')
    .reduce((sum, r) => sum + Number(r.total_amount), 0);
  const items = [
    ['Tickets vendus', sold],
    ['Tickets offerts', gifts],
    ['Recettes', formatFcfa(revenue)],
  ];
  return (
    <div className="grid gap-4 sm:grid-cols-3">
      {items.map(([label, value]) => (
        <div key={label} className="card p-5">
          <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">{label}</p>
          <p className="mt-1.5 font-display text-2xl font-semibold text-ink">{value}</p>
        </div>
      ))}
    </div>
  );
}
