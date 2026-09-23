import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import toast from "react-hot-toast";
import { Check } from "lucide-react";
import { supabase } from "@/lib/supabaseClient";
import { useAuth } from "@/lib/AuthContext";
import AppHeader from "@/components/AppHeader";

const PLANS = [
  {
    id: "decouverte",
    name: "Découverte",
    price: "Gratuit",
    limit: "1 événement actif",
    features: ["Fonctionnalités complètes", "Idéal pour tester la plateforme"],
  },
  {
    id: "pro",
    name: "Pro",
    price: "10 000 FCFA / mois",
    limit: "5 événements actifs",
    features: ["Scan hors ligne", "Invitations illimitées", "Tableau de bord complet"],
    highlight: true,
  },
  {
    id: "illimite",
    name: "Illimité",
    price: "25 000 FCFA / mois",
    limit: "Événements illimités",
    features: ["Tout le plan Pro", "Badge organisateur vérifié"],
  },
];

export default function Subscribe() {
  const { user, profile, refreshProfile } = useAuth();
  const navigate = useNavigate();
  const [loadingPlan, setLoadingPlan] = useState(null);

  const activate = async (planId) => {
    setLoadingPlan(planId);
    const { error } = await supabase
      .from("profiles")
      .update({ plan: planId, plan_activated_at: new Date().toISOString() })
      .eq("id", user.id);
    setLoadingPlan(null);
    if (error) {
      toast.error("Impossible d'activer ce plan pour le moment");
      return;
    }
    toast.success(`Plan ${planId} activé`);
    await refreshProfile();
    navigate("/organizer");
  };

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-5xl px-4 py-10 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-ink">Choisissez votre abonnement</h1>
        <p className="mt-2 text-sm text-ink/55">
          Un abonnement actif est nécessaire pour publier un événement.
        </p>

        <div className="mt-4 rounded-xl border border-amber-500/30 bg-amber-500/10 px-4 py-3 text-sm text-amber-600">
          <strong>Mode démonstration —</strong> aucun paiement réel n'est prélevé. L'activation
          est instantanée et sert à tester le fonctionnement complet de la plateforme.
        </div>

        <div className="mt-8 grid gap-6 md:grid-cols-3">
          {PLANS.map((plan) => {
            const isCurrent = profile?.plan === plan.id;
            return (
              <div
                key={plan.id}
                className={`card flex flex-col p-6 ${plan.highlight ? "ring-2 ring-teal-700" : ""}`}
              >
                <h2 className="font-display text-xl font-semibold text-ink">{plan.name}</h2>
                <p className="mt-1 text-2xl font-semibold text-teal-900">{plan.price}</p>
                <p className="mt-1 text-sm text-ink/55">{plan.limit}</p>
                <ul className="mt-4 flex-1 space-y-2 text-sm text-ink/70">
                  {plan.features.map((f) => (
                    <li key={f} className="flex items-start gap-2">
                      <Check className="mt-0.5 h-4 w-4 shrink-0 text-teal-700" /> {f}
                    </li>
                  ))}
                </ul>
                <button
                  onClick={() => activate(plan.id)}
                  disabled={loadingPlan === plan.id || isCurrent}
                  className={isCurrent ? "btn-secondary mt-6" : "btn-primary mt-6"}
                >
                  {isCurrent ? "Plan actif" : loadingPlan === plan.id ? "Activation…" : "Activer ce plan"}
                </button>
              </div>
            );
          })}
        </div>
      </main>
    </>
  );
}