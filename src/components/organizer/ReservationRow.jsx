import React from 'react';
import { formatFcfa } from '@/lib/utils';

const statusLabel = { pending: 'En attente', approved: 'Validé', rejected: 'Refusé' };
const statusStyle = {
  pending: 'bg-amber-500/15 text-amber-600',
  approved: 'bg-teal-900/10 text-teal-900',
  rejected: 'bg-rust-500/10 text-rust-500',
};

export default function ReservationRow({ reservation, onDecision }) {
  return (
    <div className="flex flex-col gap-3 border-b border-teal-900/8 py-4 last:border-0 sm:flex-row sm:items-center sm:justify-between">
      <div>
        <p className="text-sm font-semibold text-ink">{reservation.buyer_email}</p>
        <p className="mt-0.5 flex flex-wrap items-center gap-2 text-xs text-ink/55">
          <span>{reservation.quantity} ticket(s) · {formatFcfa(reservation.total_amount)}</span>
          <span className={`rounded-full px-2 py-0.5 font-semibold ${statusStyle[reservation.status]}`}>
            {statusLabel[reservation.status]}
          </span>
        </p>
      </div>
      {reservation.status === 'pending' && (
        <div className="flex gap-2">
          <button onClick={() => onDecision(reservation, 'approved')} className="btn-primary px-3 py-1.5 text-xs">
            Valider le paiement
          </button>
          <button onClick={() => onDecision(reservation, 'rejected')} className="btn-secondary px-3 py-1.5 text-xs">
            Refuser
          </button>
        </div>
      )}
    </div>
  );
}
