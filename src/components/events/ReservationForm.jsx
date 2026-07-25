import React, { useState } from 'react';
import { supabase } from '@/lib/supabaseClient';
import { formatFcfa } from '@/lib/utils';

export default function ReservationForm({ event, onCreated }) {
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    // Le prix est recalculé côté serveur (fonction create_reservation) à
    // partir de l'événement réel : impossible de forger un montant ici.
    const { data, error } = await supabase.rpc('create_reservation', {
      p_event_id: event.id,
      p_buyer_email: email,
      p_quantity: quantity,
    });
    setLoading(false);
    if (error) {
      setError("La réservation n'a pas pu être créée. Réessayez.");
      return;
    }
    onCreated(data);
  };

  return (
    <form onSubmit={submit} className="card space-y-4 p-5">
      <div>
        <label className="field-label" htmlFor="email">Votre email</label>
        <input
          id="email"
          type="email"
          required
          className="field-input"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="vous@exemple.com"
        />
      </div>
      <div>
        <label className="field-label" htmlFor="quantity">Nombre de tickets</label>
        <input
          id="quantity"
          type="number"
          min="1"
          max="20"
          className="field-input"
          value={quantity}
          onChange={(e) => setQuantity(Number(e.target.value))}
        />
      </div>
      <div className="flex items-center justify-between rounded-xl bg-teal-50 px-4 py-3 text-sm font-semibold text-teal-900">
        <span>Total à régler sur place</span>
        <span>{formatFcfa(quantity * event.ticket_price)}</span>
      </div>
      {error && <p className="text-sm text-rust-500">{error}</p>}
      <button disabled={loading} className="btn-primary w-full">
        {loading ? 'Création…' : 'Réserver et obtenir mes QR codes'}
      </button>
      <p className="text-xs leading-relaxed text-ink/45">
        Le paiement se fait en physique auprès de l'organisateur. Vos tickets
        restent inactifs jusqu'à ce que le paiement soit confirmé.
      </p>
    </form>
  );
}
