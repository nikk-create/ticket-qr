import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import { formatDateTime, formatFcfa } from '@/lib/utils';
import AppHeader from '@/components/AppHeader';
import ReservationForm from '@/components/events/ReservationForm';
import TicketCard from '@/components/tickets/TicketCard';

export default function EventDetail() {
  const { id } = useParams();
  const [event, setEvent] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    supabase.from('events').select('*').eq('id', id).maybeSingle().then(({ data }) => {
      if (!data) setNotFound(true);
      else setEvent(data);
    });
  }, [id]);

  if (notFound) {
    return (
      <>
        <AppHeader />
        <main className="p-16 text-center text-ink/50">Cet événement n'existe pas ou plus.</main>
      </>
    );
  }

  if (!event) {
    return (
      <>
        <AppHeader />
        <main className="p-16 text-center text-ink/50">Chargement…</main>
      </>
    );
  }

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <div className="grid gap-10 md:grid-cols-2">
          <div>
            <div className="h-72 overflow-hidden rounded-2xl bg-teal-50">
              {event.ticket_image_url ? (
                <img src={event.ticket_image_url} alt={event.name} className="h-full w-full object-cover" />
              ) : (
                <div className="flex h-full items-center justify-center text-sm text-teal-900/40">Aperçu du ticket</div>
              )}
            </div>
            <h1 className="mt-6 font-display text-3xl font-semibold text-ink sm:text-4xl">{event.name}</h1>
            <p className="mt-3 whitespace-pre-wrap text-sm leading-relaxed text-ink/60">{event.description}</p>
            <div className="mt-5 space-y-2 text-sm text-ink/70">
              <p className="flex items-center gap-2"><CalendarDays className="h-4 w-4 text-teal-700" />{formatDateTime(event.event_date)}</p>
              <p className="flex items-center gap-2"><MapPin className="h-4 w-4 text-teal-700" />{event.venue}</p>
              <p className="flex items-center gap-2 font-semibold text-teal-900">{formatFcfa(event.ticket_price)} / ticket</p>
            </div>
          </div>
          <div>
            {tickets.length === 0 ? (
              <ReservationForm event={event} onCreated={setTickets} />
            ) : (
              <div>
                <h2 className="mb-4 font-display text-xl font-semibold text-ink">Vos tickets</h2>
                <div className="grid gap-4 grid-cols-[repeat(auto-fill,minmax(300px,1fr))]">
                  {tickets.map((t) => <TicketCard key={t.id} ticket={t} event={event} />)}
                </div>
                <p className="mt-4 text-xs leading-relaxed text-ink/45">
                  Téléchargez et conservez ces fichiers dès maintenant — vous en aurez besoin à l'entrée.
                </p>
              </div>
            )}
          </div>
        </div>
      </main>
    </>
  );
}
