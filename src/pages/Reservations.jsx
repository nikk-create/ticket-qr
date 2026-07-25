import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';
import { formatFcfa } from '@/lib/utils';
import AppHeader from '@/components/AppHeader';

const statusLabel = { pending: 'En attente', approved: 'Validé', rejected: 'Refusé' };
const statusStyle = {
  pending: 'bg-amber-500/15 text-amber-600',
  approved: 'bg-teal-900/10 text-teal-900',
  rejected: 'bg-rust-500/10 text-rust-500',
};

export default function Reservations() {
  const { user } = useAuth();
  const [rows, setRows] = useState(null);

  useEffect(() => {
    (async () => {
      const [{ data: reservations }, { data: events }] = await Promise.all([
        supabase.from('reservations').select('*').eq('organizer_id', user.id).order('created_at', { ascending: false }),
        supabase.from('events').select('id, name').eq('created_by', user.id),
      ]);
      const eventMap = Object.fromEntries((events || []).map((e) => [e.id, e.name]));
      setRows((reservations || []).map((r) => ({ ...r, event_name: eventMap[r.event_id] || 'Événement supprimé' })));
    })();
  }, [user.id]);

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="mb-1 font-display text-3xl font-semibold text-ink">Réservations</h1>
        <p className="mb-6 text-sm text-ink/55">Toutes les réservations reçues pour vos événements.</p>

        {!rows ? (
          <p className="text-sm text-ink/50">Chargement…</p>
        ) : rows.length === 0 ? (
          <div className="rounded-2xl border border-dashed border-teal-900/20 p-12 text-center text-sm text-ink/50">
            Aucune réservation pour le moment.
          </div>
        ) : (
          <div className="overflow-x-auto rounded-2xl border border-teal-900/10 bg-white">
            <table className="w-full text-sm">
              <thead className="border-b border-teal-900/10 bg-teal-900/5 text-left text-xs uppercase tracking-wide text-ink/50">
                <tr>
                  <th className="p-4 font-medium">Acheteur</th>
                  <th className="p-4 font-medium">Événement</th>
                  <th className="p-4 font-medium">Type</th>
                  <th className="p-4 font-medium">Billets</th>
                  <th className="p-4 font-medium">Montant</th>
                  <th className="p-4 font-medium">Statut</th>
                </tr>
              </thead>
              <tbody>
                {rows.map((r) => (
                  <tr key={r.id} className="border-b border-teal-900/8 last:border-0">
                    <td className="p-4">{r.buyer_email}</td>
                    <td className="p-4">{r.event_name}</td>
                    <td className="p-4">{r.kind === 'gift' ? 'Invitation' : 'Vente'}</td>
                    <td className="p-4">{r.quantity}</td>
                    <td className="p-4">{formatFcfa(r.total_amount)}</td>
                    <td className="p-4">
                      <span className={`rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[r.status]}`}>
                        {statusLabel[r.status]}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </>
  );
}
