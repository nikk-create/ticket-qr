import React, { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { QrCode } from 'lucide-react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import AppHeader from '@/components/AppHeader';
import StatsCards from '@/components/organizer/StatsCards';
import ReservationRow from '@/components/organizer/ReservationRow';
import GiftForm from '@/components/organizer/GiftForm';
import TicketCard from '@/components/tickets/TicketCard';

export default function EventAdmin() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [reservations, setReservations] = useState([]);
  const [tickets, setTickets] = useState([]);

  const load = async () => {
    const [{ data: e }, { data: r }, { data: t }] = await Promise.all([
      supabase.from('events').select('*').eq('id', id).single(),
      supabase.from('reservations').select('*').eq('event_id', id).order('created_at', { ascending: false }),
      supabase.from('tickets').select('*').eq('event_id', id).order('created_at', { ascending: false }),
    ]);
    setEvent(e);
    setReservations(r || []);
    setTickets(t || []);
  };

  useEffect(() => { load(); }, [id]);

  const decide = async (reservation, status) => {
    const { error } = await supabase.rpc('set_reservation_status', {
      p_reservation_id: reservation.id,
      p_status: status,
    });
    if (error) {
      toast.error('Action impossible');
      return;
    }
    toast.success(status === 'approved' ? 'Paiement validé' : 'Réservation refusée');
    load();
  };

  if (!event) {
    return (
      <>
        <AppHeader />
        <main className="p-16 text-center text-ink/50">Chargement…</main>
      </>
    );
  }

  const gifts = tickets.filter((t) => t.kind === 'gift');

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl space-y-8 px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-4">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">{event.name}</h1>
            <p className="mt-1 text-sm text-ink/55">Gestion et contrôle des tickets</p>
          </div>
          <Link to={`/scan/${event.id}`} className="btn-primary">
            <QrCode className="h-4 w-4" /> Ouvrir le scanner
          </Link>
        </div>

        <StatsCards reservations={reservations} tickets={tickets} />

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-ink">Paiements à valider</h2>
          <div className="card px-5">
            {reservations.filter((r) => r.kind === 'sale').length === 0 ? (
              <p className="py-6 text-center text-sm text-ink/45">Aucune réservation pour le moment.</p>
            ) : (
              reservations.filter((r) => r.kind === 'sale').map((r) => (
                <ReservationRow key={r.id} reservation={r} onDecision={decide} />
              ))
            )}
          </div>
        </section>

        <section>
          <h2 className="mb-3 font-display text-xl font-semibold text-ink">Offrir des tickets</h2>
          <GiftForm event={event} onDone={load} />
          {gifts.length > 0 && (
            <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
              {gifts.map((t) => <TicketCard key={t.id} ticket={t} event={event} />)}
            </div>
          )}
        </section>
      </main>
    </>
  );
}
