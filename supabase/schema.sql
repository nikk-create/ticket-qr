-- ============================================================================
-- TicketQR — schéma Supabase complet
-- À exécuter dans l'éditeur SQL de votre projet Supabase (une seule fois).
-- ============================================================================

create extension if not exists pgcrypto;

-- ----------------------------------------------------------------------------
-- 1. Table des profils (miroir léger de auth.users)
-- ----------------------------------------------------------------------------
create table if not exists public.profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  full_name text,
  organization text,
  phone text,
  created_at timestamptz not null default now()
);

alter table public.profiles enable row level security;

create policy "Un utilisateur lit son propre profil"
  on public.profiles for select
  using (auth.uid() = id);

create policy "Un utilisateur modifie son propre profil"
  on public.profiles for update
  using (auth.uid() = id);

-- Crée automatiquement un profil à l'inscription (remplace base44 auth.updateMe)
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
begin
  insert into public.profiles (id, full_name, organization)
  values (
    new.id,
    new.raw_user_meta_data ->> 'full_name',
    new.raw_user_meta_data ->> 'organization'
  );
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- ----------------------------------------------------------------------------
-- 2. Événements
-- ----------------------------------------------------------------------------
create table if not exists public.events (
  id uuid primary key default gen_random_uuid(),
  created_by uuid not null references auth.users(id) on delete cascade,
  name text not null,
  description text not null,
  event_date timestamptz not null,
  venue text not null,
  ticket_price numeric not null check (ticket_price >= 0),
  ticket_image_url text,
  status text not null default 'published' check (status in ('draft', 'published')),
  created_at timestamptz not null default now()
);

alter table public.events enable row level security;

create policy "Les événements publiés sont publics, les brouillons restent privés"
  on public.events for select
  using (status = 'published' or created_by = auth.uid());

create policy "Un organisateur crée ses propres événements"
  on public.events for insert
  with check (created_by = auth.uid());

create policy "Un organisateur modifie ses propres événements"
  on public.events for update
  using (created_by = auth.uid());

create policy "Un organisateur supprime ses propres événements"
  on public.events for delete
  using (created_by = auth.uid());

-- Limite serveur de 5 événements par organisateur (le bouton désactivé côté
-- interface ne suffit pas : sans ceci, un appel direct à l'API pouvait la
-- contourner).
create or replace function public.enforce_event_limit()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  existing_count int;
begin
  select count(*) into existing_count
  from public.events
  where created_by = new.created_by;

  if existing_count >= 5 then
    raise exception 'Limite de 5 événements atteinte pour cet organisateur';
  end if;

  return new;
end;
$$;

drop trigger if exists trg_event_limit on public.events;
create trigger trg_event_limit
  before insert on public.events
  for each row execute procedure public.enforce_event_limit();

-- ----------------------------------------------------------------------------
-- 3. Réservations et tickets
-- ----------------------------------------------------------------------------
create table if not exists public.reservations (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  organizer_id uuid not null references auth.users(id) on delete cascade,
  buyer_email text not null,
  quantity int not null check (quantity between 1 and 20),
  unit_price numeric not null check (unit_price >= 0),
  total_amount numeric not null check (total_amount >= 0),
  kind text not null default 'sale' check (kind in ('sale', 'gift')),
  status text not null default 'pending' check (status in ('pending', 'approved', 'rejected')),
  created_at timestamptz not null default now()
);

create table if not exists public.tickets (
  id uuid primary key default gen_random_uuid(),
  event_id uuid not null references public.events(id) on delete cascade,
  organizer_id uuid not null references auth.users(id) on delete cascade,
  reservation_id uuid not null references public.reservations(id) on delete cascade,
  holder_email text not null,
  secure_token text not null unique,
  kind text not null check (kind in ('sale', 'gift')),
  status text not null default 'pending' check (status in ('pending', 'valid', 'used', 'rejected')),
  used_at timestamptz,
  created_at timestamptz not null default now()
);

alter table public.reservations enable row level security;
alter table public.tickets enable row level security;

-- Lecture seule pour l'organisateur concerné. AUCUNE policy insert/update
-- n'est créée ici volontairement : toute écriture passe par les fonctions
-- security definer ci-dessous, qui valident le prix et le propriétaire
-- côté serveur (c'est le correctif du défaut relevé : un visiteur ne peut
-- plus forger une réservation à 0 FCFA ou usurper un organizer_id).
create policy "Un organisateur lit les réservations de ses événements"
  on public.reservations for select
  using (organizer_id = auth.uid());

create policy "Un organisateur lit les tickets de ses événements"
  on public.tickets for select
  using (organizer_id = auth.uid());

-- ----------------------------------------------------------------------------
-- 4. Fonctions métier (RPC) — tout passe par ici, jamais par un insert direct
-- ----------------------------------------------------------------------------

-- Génère un jeton aléatoire non devinable (256 bits).
create or replace function public.generate_secure_token()
returns text
language sql
as $$
  select encode(gen_random_bytes(32), 'hex');
$$;

-- Réservation d'un visiteur : le prix est recalculé depuis l'événement,
-- jamais accepté depuis le client.
create or replace function public.create_reservation(
  p_event_id uuid,
  p_buyer_email text,
  p_quantity int
)
returns setof public.tickets
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.events;
  v_reservation_id uuid;
  i int;
begin
  if p_quantity < 1 or p_quantity > 20 then
    raise exception 'Quantité invalide';
  end if;

  select * into v_event from public.events where id = p_event_id and status = 'published';
  if not found then
    raise exception 'Événement introuvable';
  end if;

  insert into public.reservations (event_id, organizer_id, buyer_email, quantity, unit_price, total_amount, kind, status)
  values (v_event.id, v_event.created_by, p_buyer_email, p_quantity, v_event.ticket_price, p_quantity * v_event.ticket_price, 'sale', 'pending')
  returning id into v_reservation_id;

  for i in 1..p_quantity loop
    insert into public.tickets (event_id, organizer_id, reservation_id, holder_email, secure_token, kind, status)
    values (v_event.id, v_event.created_by, v_reservation_id, p_buyer_email, public.generate_secure_token(), 'sale', 'pending');
  end loop;

  return query select * from public.tickets where reservation_id = v_reservation_id;
end;
$$;

grant execute on function public.create_reservation(uuid, text, int) to anon, authenticated;

-- Tickets offerts par l'organisateur : vérifie que l'appelant possède bien
-- l'événement avant de créer quoi que ce soit.
create or replace function public.create_gift_tickets(
  p_event_id uuid,
  p_holder_email text,
  p_quantity int
)
returns setof public.tickets
language plpgsql
security definer
set search_path = public
as $$
declare
  v_event public.events;
  v_reservation_id uuid;
  i int;
begin
  if p_quantity < 1 or p_quantity > 20 then
    raise exception 'Quantité invalide';
  end if;

  select * into v_event from public.events where id = p_event_id;
  if not found or v_event.created_by <> auth.uid() then
    raise exception 'Action non autorisée';
  end if;

  insert into public.reservations (event_id, organizer_id, buyer_email, quantity, unit_price, total_amount, kind, status)
  values (v_event.id, v_event.created_by, p_holder_email, p_quantity, 0, 0, 'gift', 'approved')
  returning id into v_reservation_id;

  for i in 1..p_quantity loop
    insert into public.tickets (event_id, organizer_id, reservation_id, holder_email, secure_token, kind, status)
    values (v_event.id, v_event.created_by, v_reservation_id, p_holder_email, public.generate_secure_token(), 'gift', 'valid');
  end loop;

  return query select * from public.tickets where reservation_id = v_reservation_id;
end;
$$;

grant execute on function public.create_gift_tickets(uuid, text, int) to authenticated;

-- Décision de l'organisateur sur un paiement physique reçu (valide ou refuse).
create or replace function public.set_reservation_status(
  p_reservation_id uuid,
  p_status text
)
returns void
language plpgsql
security definer
set search_path = public
as $$
declare
  v_reservation public.reservations;
  v_ticket_status text;
begin
  if p_status not in ('approved', 'rejected') then
    raise exception 'Statut invalide';
  end if;

  select * into v_reservation from public.reservations where id = p_reservation_id;
  if not found or v_reservation.organizer_id <> auth.uid() then
    raise exception 'Action non autorisée';
  end if;

  update public.reservations set status = p_status where id = p_reservation_id;

  v_ticket_status := case when p_status = 'approved' then 'valid' else 'rejected' end;
  update public.tickets
  set status = v_ticket_status
  where reservation_id = p_reservation_id and status = 'pending';
end;
$$;

grant execute on function public.set_reservation_status(uuid, text) to authenticated;

-- Validation atomique d'un scan. C'est LE point critique anti-doublon :
-- l'UPDATE ne touche que les lignes encore 'valid'. Si deux scans arrivent
-- au même instant pour le même ticket, Postgres verrouille la ligne et un
-- seul des deux appels obtient une ligne en retour (found = true côté appelant).
create or replace function public.verify_ticket(p_secure_token text)
returns table (
  ticket_id uuid,
  success boolean,
  event_name text,
  holder_email text,
  message text
)
language plpgsql
security definer
set search_path = public
as $$
declare
  v_ticket public.tickets;
  v_event_name text;
begin
  update public.tickets t
  set status = 'used', used_at = now()
  where t.secure_token = p_secure_token
    and t.status = 'valid'
    and t.organizer_id = auth.uid()
  returning t.* into v_ticket;

  if found then
    select name into v_event_name from public.events where id = v_ticket.event_id;
    return query select v_ticket.id, true, v_event_name, v_ticket.holder_email, 'Entrée autorisée';
    return;
  end if;

  -- Distingue "déjà utilisé" de "jeton inconnu" pour un message plus clair,
  -- sans jamais révéler d'info sur un ticket d'un autre organisateur.
  select * into v_ticket from public.tickets
    where secure_token = p_secure_token and organizer_id = auth.uid();

  if v_ticket.id is not null and v_ticket.status = 'used' then
    return query select v_ticket.id, false, null::text, v_ticket.holder_email, 'Ticket déjà utilisé';
  else
    return query select null::uuid, false, null::text, null::text, 'Ticket invalide';
  end if;
end;
$$;

grant execute on function public.verify_ticket(text) to authenticated;

-- ----------------------------------------------------------------------------
-- 5. Index utiles
-- ----------------------------------------------------------------------------
create index if not exists idx_events_created_by on public.events(created_by);
create index if not exists idx_reservations_event on public.reservations(event_id);
create index if not exists idx_reservations_organizer on public.reservations(organizer_id);
create index if not exists idx_tickets_event on public.tickets(event_id);
create index if not exists idx_tickets_organizer on public.tickets(organizer_id);
create index if not exists idx_tickets_reservation on public.tickets(reservation_id);
create index if not exists idx_tickets_secure_token on public.tickets(secure_token);

-- ----------------------------------------------------------------------------
-- 6. Storage : bucket public pour les photos exemple de ticket
-- ----------------------------------------------------------------------------
insert into storage.buckets (id, name, public)
values ('event-media', 'event-media', true)
on conflict (id) do nothing;

create policy "Lecture publique des médias d'événements"
  on storage.objects for select
  using (bucket_id = 'event-media');

create policy "Un utilisateur connecté dépose ses médias"
  on storage.objects for insert
  with check (bucket_id = 'event-media' and auth.role() = 'authenticated');
