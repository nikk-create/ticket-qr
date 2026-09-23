import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CalendarDays, MapPin } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import { formatDateTime } from "@/lib/utils";
import AppHeader from "@/components/AppHeader";
import EventForm from "@/components/organizer/EventForm";

const PLAN_LIMITS = { none: 0, decouverte: 1, pro: 5, illimite: Infinity };
const PLAN_LABELS = { none: "Aucun", decouverte: "Découverte", pro: "Pro", illimite: "Illimité" };

export default function Organizer() {
  const { user, profile } = useAuth();
  const [events, setEvents] = useState(null);

  useEffect(() => {
    supabase
      .from("events")
      .select("*")
      .eq("created_by", user.id)
      .order("created_at", { ascending: false })
      .then(({ data }) => setEvents(data || []));
  }, [user.id]);

  const plan = profile?.plan || "none";
  const limit = PLAN_LIMITS[plan] ?? 0;

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-6xl space-y-10 px-4 py-10 sm:px-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="font-display text-3xl font-semibold text-ink">Espace organisateur</h1>
            <p className="mt-1 text-sm text-ink/55">
              {events ? `${events.length}/${limit === Infinity ? "∞" : limit} événements créés` : "…"}
              {" · "}Plan {PLAN_LABELS[plan]}
            </p>
          </div>
          <Link to="/organizer/subscribe" className="btn-secondary">
            {plan === "none" ? "Choisir un abonnement" : "Changer d'abonnement"}
          </Link>
        </div>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">Créer un événement</h2>
          {plan === "none" ? (
            <div className="card p-6 text-center">
              <p className="text-sm text-ink/60">
                Vous devez activer un abonnement avant de publier votre premier événement.
              </p>
              <Link to="/organizer/subscribe" className="btn-primary mt-4 inline-flex">
                Voir les plans
              </Link>
            </div>
          ) : (
            <EventForm
              count={events?.length || 0}
              limit={limit}
              onCreated={(e) => setEvents([e, ...(events || [])])}
            />
          )}
        </section>

        <section>
          <h2 className="mb-4 font-display text-xl font-semibold text-ink">Mes événements</h2>
          {!events ? (
            <p className="text-sm text-ink/50">Chargement…</p>
          ) : events.length === 0 ? (
            <div className="rounded-2xl border border-dashed border-teal-900/20 p-10 text-center text-sm text-ink/50">
              Vous n'avez encore publié aucun événement.
            </div>
          ) : (
            <div className="grid gap-4 md:grid-cols-2">
              {events.map((e) => (
                <div key={e.id} className="card p-5">
                  <h3 className="font-display text-lg font-medium text-ink">{e.name}</h3>
                  <div className="mb-4 mt-1.5 space-y-1 text-xs text-ink/55">
                    <p className="flex items-center gap-1.5"><CalendarDays className="h-3.5 w-3.5" />{formatDateTime(e.event_date)}</p>
                    <p className="flex items-center gap-1.5"><MapPin className="h-3.5 w-3.5" />{e.venue}</p>
                  </div>
                  <Link to={`/organizer/events/${e.id}`} className="btn-secondary text-sm">
                    Gérer l'événement
                  </Link>
                </div>
              ))}
            </div>
          )}
        </section>
      </main>
    </>
  );
}