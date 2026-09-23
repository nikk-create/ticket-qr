import React from "react";
import AppHeader from "@/components/AppHeader";
import Footer from "@/components/Footer";

export default function Terms() {
  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6">
        <h1 className="font-display text-3xl font-semibold text-ink">Conditions d'utilisation</h1>
        <p className="mt-2 text-sm text-ink/50">Dernière mise à jour : {new Date().toLocaleDateString("fr-FR")}</p>

        <div className="mt-8 space-y-6 text-sm leading-relaxed text-ink/75">
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">1. Objet</h2>
            <p className="mt-2">
              TicketQR permet à un organisateur de publier un événement et de générer des tickets
              électroniques sécurisés par QR code, et à un visiteur de réserver ces tickets.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">2. Paiement des tickets</h2>
            <p className="mt-2">
              Le règlement des tickets s'effectue exclusivement en physique, directement entre le
              visiteur et l'organisateur. TicketQR n'intervient à aucun moment dans cette transaction
              et ne peut être tenu responsable d'un litige de paiement entre les deux parties.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">3. Abonnement organisateur</h2>
            <p className="mt-2">
              L'abonnement organisateur est actuellement proposé en mode démonstration : son
              activation est simulée et ne donne lieu à aucun prélèvement réel. Cette mécanique est
              amenée à évoluer vers un paiement effectif ; les organisateurs en seront informés
              avant toute mise en place d'une facturation réelle.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">4. Validité d'un ticket</h2>
            <p className="mt-2">
              Un ticket est valable une seule fois. Une fois scanné et son entrée validée, il ne
              peut plus être utilisé, y compris en cas de perte ou de partage de son contenu.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">5. Responsabilité</h2>
            <p className="mt-2">
              TicketQR fournit un outil de billetterie et de contrôle d'accès. L'organisateur reste
              seul responsable du bon déroulement de son événement et du respect des engagements
              pris envers les visiteurs.
            </p>
          </section>
          <section>
            <h2 className="font-display text-lg font-semibold text-ink">6. Droit applicable</h2>
            <p className="mt-2">Les présentes conditions sont régies par le droit béninois.</p>
          </section>
        </div>
      </main>
      <Footer />
    </>
  );
}