import React, { useEffect, useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import AppHeader from '@/components/AppHeader';
import EventCard from '@/components/events/EventCard';
import { QrCode, ShieldCheck, Smartphone } from 'lucide-react';

export default function Events() {
  const [events, setEvents] = useState(null);

  useEffect(() => {
    supabase
      .from('events')
      .select('*')
      .eq('status', 'published')
      .order('event_date', { ascending: true })
      .then(({ data }) => setEvents(data || []));
  }, []);

  return (
    <>
      <AppHeader />
      <main>
        <section className="border-b border-teal-900/10 bg-teal-950">
          <div className="mx-auto max-w-6xl px-4 py-16 sm:px-6 sm:py-20">
            <div className="grid items-center gap-10 lg:grid-cols-[1.1fr_0.9fr]">
              <div className="text-sand">
                <p className="mb-4 text-xs font-semibold uppercase tracking-[0.2em] text-amber-400">
                  Billetterie QR pour Cotonou &amp; tout le Bénin
                </p>
                <h1 className="font-display text-4xl font-medium leading-[1.1] sm:text-5xl">
                  Un ticket authentique,
                  <br />un scan, une entrée.
                </h1>
                <p className="mt-5 max-w-md text-sm leading-relaxed text-sand/70 sm:text-base">
                  Réservez vos places pour un gala, un concert ou une soirée,
                  et recevez un QR code personnel qui ne peut servir qu'une
                  seule fois — impossible à dupliquer ou à revendre deux fois.
                </p>
                <div className="mt-8 flex flex-wrap gap-x-6 gap-y-3 text-xs text-sand/60">
                  <span className="flex items-center gap-1.5"><QrCode className="h-4 w-4 text-amber-400" /> QR à usage unique</span>
                  <span className="flex items-center gap-1.5"><ShieldCheck className="h-4 w-4 text-amber-400" /> Vérification sécurisée</span>
                  <span className="flex items-center gap-1.5"><Smartphone className="h-4 w-4 text-amber-400" /> Ticket sur votre téléphone</span>
                </div>
              </div>

              {/* Signature ticket-stub visual */}
              <div className="flex justify-center lg:justify-end">
                <div className="stub-card relative w-72 rotate-2 border border-sand/15 bg-teal-900/70 p-6 backdrop-blur-sm">
                  <span className="stub-notch stub-notch--left" style={{ background: '#0B4F47' }} />
                  <span className="stub-notch stub-notch--right" style={{ background: '#0B4F47' }} />
                  <p className="text-[11px] uppercase tracking-wide text-amber-400">Événement</p>
                  <p className="mt-1 font-display text-2xl text-sand">Nuit du Gala</p>
                  <p className="mt-1 text-xs text-sand/55">Palais des Congrès · Cotonou</p>
                  <div className="my-4 border-t border-dashed border-sand/25" />
                  <div className="flex items-center gap-4">
                    <div className="grid h-20 w-20 shrink-0 grid-cols-4 grid-rows-4 gap-[2px] rounded-md bg-sand p-1.5">
                      {Array.from({ length: 16 }).map((_, i) => (
                        <span
                          key={i}
                          className="rounded-[1px]"
                          style={{ background: [0,1,3,4,6,9,10,12,13,15].includes(i) ? '#0B4F47' : 'transparent' }}
                        />
                      ))}
                    </div>
                    <div className="font-mono text-[11px] text-sand/60">
                      <p>N° 8C21-FA09</p>
                      <p className="mt-1 rounded-full bg-amber-500/90 px-2 py-0.5 font-body font-semibold text-teal-950">Valide</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <div className="mx-auto max-w-6xl px-4 py-12 sm:px-6">
          <h2 className="mb-6 font-display text-2xl font-semibold text-ink">Événements à venir</h2>
          {!events ? (
            <p className="text-sm text-ink/50">Chargement des événements…</p>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-teal-900/20 p-14 text-center text-ink/50">
              Aucun événement publié pour le moment. Revenez bientôt.
            </div>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {events.map((event) => <EventCard key={event.id} event={event} />)}
            </div>
          )}
        </div>
      </main>
    </>
  );
}
