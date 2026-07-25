import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';

export default function EventForm({ count, onCreated }) {
  const { user } = useAuth();
  const [form, setForm] = useState({ name: '', description: '', event_date: '', venue: '', ticket_price: '' });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, value) => setForm((v) => ({ ...v, [key]: value }));
  const atLimit = count >= 5;

  const submit = async (e) => {
    e.preventDefault();
    if (atLimit) return;
    setLoading(true);
    setError('');

    let ticket_image_url = '';
    if (file) {
      const path = `${user.id}/${Date.now()}-${file.name}`;
      const { error: uploadError } = await supabase.storage.from('event-media').upload(path, file);
      if (uploadError) {
        setError("L'envoi de la photo a échoué. Réessayez.");
        setLoading(false);
        return;
      }
      ticket_image_url = supabase.storage.from('event-media').getPublicUrl(path).data.publicUrl;
    }

    const { data, error: insertError } = await supabase
      .from('events')
      .insert({
        created_by: user.id,
        name: form.name,
        description: form.description,
        event_date: new Date(form.event_date).toISOString(),
        venue: form.venue,
        ticket_price: Number(form.ticket_price),
        ticket_image_url,
        status: 'published',
      })
      .select()
      .single();

    setLoading(false);
    if (insertError) {
      setError(
        insertError.message?.includes('Limite')
          ? 'Limite de 5 événements atteinte.'
          : "La création de l'événement a échoué."
      );
      return;
    }
    toast.success('Événement publié');
    setForm({ name: '', description: '', event_date: '', venue: '', ticket_price: '' });
    setFile(null);
    onCreated(data);
  };

  return (
    <form onSubmit={submit} className="card grid gap-4 p-5 md:grid-cols-2">
      <div>
        <label className="field-label" htmlFor="name">Nom de l'événement</label>
        <input id="name" required className="field-input" value={form.name} onChange={(e) => set('name', e.target.value)} placeholder="Ex. Nuit du Gala 2026" />
      </div>
      <div>
        <label className="field-label" htmlFor="event_date">Date et heure</label>
        <input id="event_date" required type="datetime-local" className="field-input" value={form.event_date} onChange={(e) => set('event_date', e.target.value)} />
      </div>
      <div>
        <label className="field-label" htmlFor="venue">Lieu</label>
        <input id="venue" required className="field-input" value={form.venue} onChange={(e) => set('venue', e.target.value)} placeholder="Ex. Palais des Congrès, Cotonou" />
      </div>
      <div>
        <label className="field-label" htmlFor="ticket_price">Prix du ticket (FCFA)</label>
        <input id="ticket_price" required type="number" min="0" className="field-input" value={form.ticket_price} onChange={(e) => set('ticket_price', e.target.value)} />
      </div>
      <div className="md:col-span-2">
        <label className="field-label" htmlFor="description">Description</label>
        <textarea id="description" required rows={3} className="field-input" value={form.description} onChange={(e) => set('description', e.target.value)} />
      </div>
      <div>
        <label className="field-label" htmlFor="ticket_image">Photo exemple du ticket</label>
        <input id="ticket_image" type="file" accept="image/*" className="field-input file:mr-3 file:rounded-full file:border-0 file:bg-teal-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-sand" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <div className="flex items-end">
        {error && <p className="text-sm text-rust-500">{error}</p>}
      </div>
      <div className="md:col-span-2">
        <button disabled={loading || atLimit} className="btn-primary w-full sm:w-auto">
          {atLimit ? 'Limite de 5 événements atteinte' : loading ? 'Publication…' : "Publier l'événement"}
        </button>
      </div>
    </form>
  );
}
