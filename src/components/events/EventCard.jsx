import React from 'react';
import { Link } from 'react-router-dom';
import { CalendarDays, MapPin } from 'lucide-react';
import { formatDateTime, formatFcfa } from '@/lib/utils';

export default function EventCard({ event }) {
  return (
    <Link to={`/events/${event.id}`} className="group block">
      <div className="stub-card overflow-hidden border border-teal-900/10 bg-white shadow-card transition-shadow group-hover:shadow-stub">
        <div className="h-44 overflow-hidden bg-teal-50">
          {event.ticket_image_url ? (
            <img
              src={event.ticket_image_url}
              alt={event.name}
              className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-[1.03]"
            />
          ) : (
            <div className="flex h-full items-center justify-center text-sm text-teal-900/40">
              Aperçu du ticket à venir
            </div>
          )}
        </div>

        <div className="relative border-t border-dashed border-stub px-5 py-4">
          <span className="stub-notch stub-notch--left" />
          <span className="stub-notch stub-notch--right" />
          <div className="flex items-start justify-between gap-3">
            <h3 className="font-display text-lg font-medium leading-snug text-ink">{event.name}</h3>
            <span className="whitespace-nowrap rounded-full bg-amber-500/15 px-2.5 py-1 text-xs font-semibold text-amber-600">
              {formatFcfa(event.ticket_price)}
            </span>
          </div>
          <div className="mt-3 space-y-1.5 text-xs text-ink/55">
            <p className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDateTime(event.event_date)}</p>
            <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{event.venue}</p>
          </div>
        </div>
      </div>
    </Link>
  );
}
