import React from "react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

export default function Privacy() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-ink">Politique de confidentialité</h1>
        <p className="mt-2 text-sm text-ink/50">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink/75">
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">1. Données collectées</h2>
            <p className="mt-2">
              Pour les organisateurs : adresse email, nom, et éventuellement nom d'organisation
              et numéro de téléphone. Pour les visiteurs réservant un ticket : uniquement une
              adresse email, nécessaire pour associer le ticket à son détenteur.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">2. Ce que nous ne collectons pas</h2>
            <p className="mt-2">
              Aucune information bancaire ou de paiement n'est collectée par la plateforme. Les
              ventes de tickets se règlent physiquement entre le visiteur et l'organisateur.
              L'abonnement organisateur fonctionne actuellement en mode démonstration : son
              activation ne déclenche aucune transaction réelle ni saisie de coordonnées bancaires.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">3. Hébergement</h2>
            <p className="mt-2">
              Les données sont hébergées chez Supabase (infrastructure PostgreSQL managée).
              L'accès aux données est protégé par des règles de sécurité au niveau des lignes
              (Row Level Security) : un organisateur ne peut consulter que ses propres événements,
              réservations et tickets.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">4. Vos droits</h2>
            <p className="mt-2">
              Vous pouvez demander l'accès, la correction ou la suppression de vos données
              personnelles à tout moment en nous contactant à l'adresse indiquée ci-dessous.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">5. Contact</h2>
            <p className="mt-2">InnovaTech — Cotonou, Bénin. contact@innovatech.bj</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}