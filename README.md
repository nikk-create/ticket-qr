# TicketQR

Billetterie événementielle avec QR codes à usage unique — migré de Base44 vers
**React + Vite + Supabase**, adapté au marché béninois (FCFA, paiement
physique, WhatsApp comme canal cible futur).

## Démarrage

```bash
npm install
cp .env.example .env
```

1. Créez un projet sur [supabase.com](https://supabase.com).
2. Copiez l'URL du projet et la clé `anon` dans `.env`.
3. Dans l'éditeur SQL de Supabase, exécutez le contenu de `supabase/schema.sql`
   (une seule fois). Il crée les tables, les policies RLS, le bucket de
   stockage `event-media`, et toutes les fonctions métier.
4. `npm run dev`

## Ce qui a été corrigé par rapport à l'export Base44

**Bugs qui cassaient le build**
- `ReservationForm` / `EventForm` : chaînes de caractères cassées par une
  apostrophe non échappée (`n'a`, `l'événement`) — corrigé.
- `CameraScanner` : `ref__` au lieu de `ref` → la caméra ne s'attachait
  jamais réellement au flux vidéo — corrigé.
- `TicketCard` : `href__` au lieu de `href` → le téléchargement image ne
  fonctionnait pas — corrigé.

**Failles de sécurité corrigées**
- Les réservations et tickets ne s'insèrent plus jamais directement depuis
  le client. Tout passe par des fonctions `security definer` côté Supabase
  (`create_reservation`, `create_gift_tickets`, `set_reservation_status`,
  `verify_ticket`) qui recalculent le prix et vérifient le propriétaire
  côté serveur — un visiteur ne peut plus forger un montant à 0 FCFA ni un
  `organizer_id` arbitraire.
- La limite de 5 événements est maintenant imposée par un trigger SQL
  (`enforce_event_limit`), pas seulement par un bouton désactivé côté
  interface.
- Le scan (`verify_ticket`) fait un `UPDATE ... WHERE status = 'valid'
  RETURNING` : c'est une opération atomique au niveau ligne Postgres, donc
  deux scans simultanés du même ticket ne peuvent jamais réussir tous les
  deux.

**Modèle métier conservé tel quel (à confirmer avec vous)**
Le flux actuel reste : réservation → statut `pending` → l'organisateur
valide le paiement physique reçu dans son dashboard (`Paiements à valider`)
→ le ticket passe à `valid` → scannable à l'entrée. C'est ce que
l'implémentation d'origine faisait déjà. Si vous préférez que le **scan à
l'entrée** confirme lui-même le paiement (option qu'on avait aussi évoquée),
dites-le-moi et j'ajuste `EventAdmin`/`Scanner` en conséquence.

**Mode hors ligne**
Le scanner met en cache les tickets valides et fonctionne sans réseau,
avec une file d'attente resynchronisée dès la reconnexion (via
`verify_ticket`, toujours atomique). Comme convenu : ce mode suppose **un
seul appareil scanner actif par événement** pendant une coupure — la
gestion de plusieurs points d'entrée simultanés n'est pas dans ce MVP.

**Modes de remise du ticket (V1)**
Téléchargement direct (image PNG ou PDF) juste après la réservation — pas
d'envoi automatique par email ni WhatsApp dans cette version, comme décidé.

## Changements de design

- **Logo** : nouveau composant SVG (`src/components/Logo.jsx`) reprenant
  l'icône fournie — hexagone `#0B4F47` avec le ticket-stub blanc.
- **Palette** : teal profond (`#0B4F47`) en primaire, fond sable chaud
  (`#F7F2E7`), accent ambre (`#E2A63B`) pour les prix et actions secondaires
  — plus de vie que les gris neutres par défaut.
- **Typographie** : `Fraunces` (display, avec du caractère) + `Inter`
  (texte) + `IBM Plex Mono` pour les numéros de ticket.
- **Signature visuelle** : un motif de "ticket déchiré" (encoches
  circulaires + ligne pointillée) repris du logo, utilisé sur les cartes
  d'événement, les tickets, et le panneau de connexion — cohérent partout,
  pas juste décoratif sur la page d'accueil.
- **Page de connexion** : nouvel écran `AuthLayout` en deux volets (panneau
  de marque à gauche, formulaire à droite), avec `Login`, `Register`,
  `ForgotPassword`, `ResetPassword`. L'espace organisateur est maintenant
  protégé par `ProtectedRoute` — impossible d'y accéder sans être connecté.
- **En-tête (`AppHeader`)** : corrige la disposition encombrée de boutons
  de l'export d'origine. Navigation principale à gauche/centre, un seul
  menu compte (avatar + initiale) à droite regroupant profil et
  déconnexion, au lieu d'aligner tous les boutons côte à côte.

## Structure

```
src/
  components/
    events/        EventCard, ReservationForm
    organizer/      EventForm, GiftForm, ReservationRow, StatsCards
    scanner/        CameraScanner
    tickets/        TicketCard
    AppHeader, AuthLayout, Logo, ProtectedRoute
  lib/
    supabaseClient.js, AuthContext.jsx, utils.js
  pages/
    Login, Register, ForgotPassword, ResetPassword
    Events, EventDetail, Organizer, EventAdmin, Scanner,
    Reservations, Dashboard, Profile, PageNotFound
supabase/
  schema.sql        Tables, RLS, triggers, fonctions RPC (à exécuter une fois)
```
