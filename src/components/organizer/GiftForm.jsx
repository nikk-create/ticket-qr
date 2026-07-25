import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';

export default function GiftForm({ event, onDone }) {
  const [email, setEmail] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.rpc('create_gift_tickets', {
      p_event_id: event.id,
      p_holder_email: email,
      p_quantity: quantity,
    });
    setLoading(false);
    if (error) {
      setError('La création des invitations a échoué.');
      return;
    }
    toast.success('Invitations créées');
    setEmail('');
    setQuantity(1);
    onDone();
  };

  return (
    <form onSubmit={submit} className="card flex flex-col gap-3 p-5 sm:flex-row sm:items-end">
      <div className="flex-1">
        <label className="field-label" htmlFor="gift-email">Email de l'invité</label>
        <input id="gift-email" type="email" required className="field-input" value={email} onChange={(e) => setEmail(e.target.value)} placeholder="invite@exemple.com" />
      </div>
      <div className="sm:w-28">
        <label className="field-label" htmlFor="gift-quantity">Quantité</label>
        <input id="gift-quantity" type="number" min="1" max="20" className="field-input" value={quantity} onChange={(e) => setQuantity(Number(e.target.value))} />
      </div>
      <button disabled={loading} className="btn-amber sm:w-auto">
        {loading ? 'Création…' : 'Créer des invitations'}
      </button>
      {error && <p className="text-sm text-rust-500">{error}</p>}
    </form>
  );
}
