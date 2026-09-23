import React from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, Ban, Clock, QrCode, ShieldCheck, Smartphone, Wifi, Zap } from 'lucide-react';
import AppHeader from '@/components/AppHeader';
import Footer from '@/components/Footer';
import Logo from '@/components/Logo';

const PROBLEMS = [
  { icon: Ban, title: 'Tickets dupliqués', text: "Un ticket papier se photocopie, une liste se falsifie — rien n'empêche une double entrée." },
  { icon: AlertTriangle, title: 'Aucune visibilité', text: "Impossible de savoir combien de places sont réellement vendues avant le jour de l'événement." },
  { icon: Clock, title: 'Contrôle lent', text: "Vérifier une liste papier à l'entrée crée des files d'attente et des erreurs humaines." },
];

const FEATURES = [
  { icon: QrCode, title: 'QR à usage unique', text: 'Chaque ticket génère un jeton aléatoire, invalidé dès son premier scan.' },
  { icon: ShieldCheck, title: 'Anti-doublon garanti', text: 'La validation est atomique au niveau de la base de données : deux scans simultanés ne peuvent jamais réussir tous les deux.' },
  { icon: Wifi, title: 'Fonctionne hors ligne', text: "Le contrôle d'accès reste opérant même sans connexion réseau le jour J." },
  { icon: Smartphone, title: 'Aucune application à installer', text: 'Organisateurs et visiteurs utilisent simplement leur navigateur, sur Android comme sur iPhone.' },
];

export default function Landing() {
  return (
    <>
      <AppHeader />

      {/* Hero marketing */}
      <section className="bg-teal-950 text-sand">
        <div className="mx-auto max-w-4xl px-4 py-20 text-center sm:px-6">
          <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center">
            <Logo size={64} />
          </div>
          <p className="mb-4 text-xs font-bold uppercase tracking-[0.2em] text-amber-400">
            Billetterie électronique pour le Bénin
          </p>
          <h1 className="font-display text-4xl font-medium leading-tight sm:text-5xl">
            La billetterie papier a fait son temps.
          </h1>
          <p className="mx-auto mt-5 max-w-xl text-base leading-relaxed text-sand/70">
            TicketQR permet à tout organisateur de vendre ou d'offrir des tickets sécurisés par QR code à usage unique, et de contrôler les entrées sans risque de fraude — même sans connexion internet le jour de l'événement.
          </p>
          <div className="mt-8 flex flex-wrap items-center justify-center gap-3">
            <Link to="/events" className="btn-amber">Découvrir les événements</Link>
            <Link to="/organizer" className="btn-secondary border-sand/25 text-sand hover:bg-sand/10">
              Espace organisateur
            </Link>
          </div>
        </div>
      </section>

      {/* Le problème */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-amber-600">Le constat</p>
        <h2 className="text-center font-display text-2xl font-semibold text-ink sm:text-3xl">
          Au Bénin, la billetterie papier coûte cher — en fraude, en temps, en confiance.
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-3">
          {PROBLEMS.map(({ icon: Icon, title, text }) => (
            <div key={title} className="card p-6">
              <div className="mb-3 flex h-10 w-10 items-center justify-center rounded-full bg-rust-500/10">
                <Icon className="h-5 w-5 text-rust-500" />
              </div>
              <h3 className="font-display text-lg font-medium text-ink">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-ink/60">{text}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Comment ça marche */}
      <section className="bg-teal-50/60 py-16">
        <div className="mx-auto max-w-5xl px-4 sm:px-6">
          <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-teal-700">Le fonctionnement</p>
          <h2 className="text-center font-display text-2xl font-semibold text-ink sm:text-3xl">Simple des deux côtés</h2>
          <div className="mt-10 grid gap-6 md:grid-cols-2">
            <div className="card p-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-wide text-teal-700">Organisateur</p>
              <ol className="space-y-3 text-sm text-ink/70">
                <li><strong className="text-ink">1. Publie son événement</strong> — infos, prix, photo du ticket.</li>
                <li><strong className="text-ink">2. Encaisse en physique</strong> — aucune passerelle de paiement imposée.</li>
                <li><strong className="text-ink">3. Scanne à l'entrée</strong> — chaque ticket ne peut servir qu'une fois.</li>
              </ol>
            </div>
            <div className="card p-6">
              <p className="mb-4 text-xs font-bold uppercase tracking-wide text-teal-700">Visiteur</p>
              <ol className="space-y-3 text-sm text-ink/70">
                <li><strong className="text-ink">1. Choisit son événement</strong> — voit le prix, la date, le lieu.</li>
                <li><strong className="text-ink">2. Réserve avec son email</strong> — reçoit son QR code personnel.</li>
                <li><strong className="text-ink">3. Se présente à l'entrée</strong> — un scan, et c'est bon.</li>
              </ol>
            </div>
          </div>
        </div>
      </section>

      {/* Pourquoi TicketQR */}
      <section className="mx-auto max-w-5xl px-4 py-16 sm:px-6">
        <p className="mb-2 text-center text-xs font-bold uppercase tracking-[0.14em] text-amber-600">Pourquoi TicketQR</p>
        <h2 className="text-center font-display text-2xl font-semibold text-ink sm:text-3xl">
          Pensé pour le terrain, pas pour une démo
        </h2>
        <div className="mt-10 grid gap-6 sm:grid-cols-2">
          {FEATURES.map(({ icon: Icon, title, text }) => (
            <div key={title} className="flex gap-4 card p-6">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-teal-900/10">
                <Icon className="h-5 w-5 text-teal-900" />
              </div>
              <div>
                <h3 className="font-display text-base font-medium text-ink">{title}</h3>
                <p className="mt-1 text-sm leading-relaxed text-ink/60">{text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* CTA final */}
      <section className="bg-teal-900 py-16 text-center text-sand">
        <Zap className="mx-auto mb-4 h-8 w-8 text-amber-400" />
        <h2 className="font-display text-2xl font-semibold sm:text-3xl">
          Prêt à sécuriser votre prochain événement ?
        </h2>
        <Link to="/register" className="btn-amber mt-6 inline-flex">Créer mon compte organisateur</Link>
      </section>

      <Footer />
    </>
  );
}