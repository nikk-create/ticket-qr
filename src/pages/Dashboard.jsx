import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';
import { formatDate, formatFcfa } from '@/lib/utils';
import AppHeader from '@/components/AppHeader';

export default function Dashboard() {
  const { user } = useAuth();
  const [events, setEvents] = useState(null);

  useEffect(() => {
    (async () => {
      const [{ data: evs }, { data: reservations }, { data: tickets }] = await Promise.all([
        supabase.from('events').select('*').eq('created_by', user.id).order('created_at', { ascending: false }),
        supabase.from('reservations').select('*').eq('organizer_id', user.id),
        supabase.from('tickets').select('*').eq('organizer_id', user.id),
      ]);

      setEvents((evs || []).map((e) => {
        const eTickets = (tickets || []).filter((t) => t.event_id === e.id);
        const sold = eTickets.filter((t) => t.kind === 'sale' && ['valid', 'used'].includes(t.status)).length;
        const gifts = eTickets.filter((t) => t.kind === 'gift' && ['valid', 'used'].includes(t.status)).length;
        const revenue = (reservations || [])
          .filter((r) => r.event_id === e.id && r.kind === 'sale' && r.status === 'approved')
          .reduce((s, r) => s + Number(r.total_amount), 0);
        const pending = (reservations || []).filter((r) => r.event_id === e.id && r.status === 'pending').length;
        return { ...e, sold, gifts, revenue, pending };
      }));
    })();
  }, [user.id]);

  const totals = (events || []).reduce(
    (acc, e) => ({ sold: acc.sold + e.sold, gifts: acc.gifts + e.gifts, revenue: acc.revenue + e.revenue }),
    { sold: 0, gifts: 0, revenue: 0 }
  );

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl px-4 py-10 sm:px-6">
        <h1 className="mb-1 font-display text-3xl font-semibold text-ink">Tableau de bord</h1>
        <p className="mb-6 text-sm text-ink/55">Vue d'ensemble de vos ventes et revenus.</p>

        {!events ? (
          <p className="text-sm text-ink/50">Chargement…</p>
        ) : (
          <>
            <div className="mb-8 grid gap-4 sm:grid-cols-3">
              <div className="card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Billets vendus</p>
                <p className="mt-1.5 font-display text-2xl font-semibold text-ink">{totals.sold}</p>
              </div>
              <div className="card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Billets offerts</p>
                <p className="mt-1.5 font-display text-2xl font-semibold text-ink">{totals.gifts}</p>
              </div>
              <div className="card p-5">
                <p className="text-xs font-semibold uppercase tracking-wide text-ink/45">Revenus cumulés</p>
                <p className="mt-1.5 font-display text-2xl font-semibold text-ink">{formatFcfa(totals.revenue)}</p>
              </div>
            </div>

            {events.length === 0 ? (
              <div className="rounded-2xl border border-dashed border-teal-900/20 p-12 text-center text-sm text-ink/50">
                Aucun événement. <Link to="/organizer" className="font-semibold text-teal-900 underline">Créez votre premier événement</Link>.
              </div>
            ) : (
              <div className="grid gap-4 md:grid-cols-2">
                {events.map((e) => (
                  <div key={e.id} className="card space-y-3 p-5">
                    <div className="flex items-start justify-between gap-3">
                      <h2 className="font-display text-lg font-medium text-ink">{e.name}</h2>
                      <span className="whitespace-nowrap text-xs text-ink/45">{formatDate(e.event_date)}</span>
                    </div>
                    <div className="grid grid-cols-2 gap-3 text-sm">
                      <div><p className="text-xs text-ink/45">Vendus</p><p className="font-display text-xl font-semibold text-ink">{e.sold}</p></div>
                      <div><p className="text-xs text-ink/45">Offerts</p><p className="font-display text-xl font-semibold text-ink">{e.gifts}</p></div>
                      <div><p className="text-xs text-ink/45">Revenus</p><p className="font-display text-xl font-semibold text-ink">{formatFcfa(e.revenue)}</p></div>
                      <div><p className="text-xs text-ink/45">En attente</p><p className="font-display text-xl font-semibold text-ink">{e.pending}</p></div>
                    </div>
                    <Link to={`/organizer/events/${e.id}`} className="inline-block text-sm font-semibold text-teal-900 hover:underline">
                      Gérer l'événement →
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </main>
    </>
  );
}
