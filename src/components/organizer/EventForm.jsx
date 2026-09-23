import React, { useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';

const toDatetimeLocal = (iso) => {
  if (!iso) return '';
  const d = new Date(iso);
  const pad = (n) => String(n).padStart(2, '0');
  return `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}T${pad(d.getHours())}:${pad(d.getMinutes())}`;
};

// event fourni => mode édition (onSaved / onCancel). Sinon => mode création
// (count / onCreated), comportement inchangé par rapport à avant.
export default function EventForm({ event, count, limit = 5, onCreated, onSaved, onCancel }) {
  const { user } = useAuth();
  const isEdit = !!event;
  const [form, setForm] = useState({
    name: event?.name || '',
    description: event?.description || '',
    event_date: toDatetimeLocal(event?.event_date) || '',
    venue: event?.venue || '',
    ticket_price: event?.ticket_price ?? '',
  });
  const [file, setFile] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, value) => setForm((v) => ({ ...v, [key]: value }));
  const atLimit = !isEdit && count >= limit;

  const uploadImageIfAny = async () => {
    if (!file) return undefined;
    const path = `${user.id}/${Date.now()}-${file.name}`;
    const { error: uploadError } = await supabase.storage.from('event-media').upload(path, file);
    if (uploadError) throw new Error('upload');
    return supabase.storage.from('event-media').getPublicUrl(path).data.publicUrl;
  };

  const submit = async (e) => {
    e.preventDefault();
    if (atLimit) return;
    setLoading(true);
    setError('');

    let ticket_image_url;
    try {
      ticket_image_url = await uploadImageIfAny();
    } catch {
      setError("L'envoi de la photo a échoué. Réessayez.");
      setLoading(false);
      return;
    }

    const payload = {
      name: form.name,
      description: form.description,
      event_date: new Date(form.event_date).toISOString(),
      venue: form.venue,
      ticket_price: Number(form.ticket_price),
      ...(ticket_image_url ? { ticket_image_url } : {}),
    };

    if (isEdit) {
      const { data, error: updateError } = await supabase
        .from('events')
        .update(payload)
        .eq('id', event.id)
        .select()
        .single();
      setLoading(false);
      if (updateError) {
        setError("La mise à jour de l'événement a échoué.");
        return;
      }
      toast.success('Événement mis à jour');
      onSaved?.(data);
      return;
    }

    const { data, error: insertError } = await supabase
      .from('events')
      .insert({ ...payload, created_by: user.id, ticket_image_url: ticket_image_url || '', status: 'published' })
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
    onCreated?.(data);
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
        <label className="field-label" htmlFor="ticket_image">
          Photo exemple du ticket {isEdit && <span className="normal-case text-ink/40">(laisser vide pour garder l'actuelle)</span>}
        </label>
        <input id="ticket_image" type="file" accept="image/*" className="field-input file:mr-3 file:rounded-full file:border-0 file:bg-teal-900 file:px-3 file:py-1.5 file:text-xs file:font-semibold file:text-sand" onChange={(e) => setFile(e.target.files[0])} />
      </div>
      <div className="flex items-end">
        {error && <p className="text-sm text-rust-500">{error}</p>}
      </div>
      <div className="flex gap-3 md:col-span-2">
        <button disabled={loading || atLimit} className="btn-primary w-full sm:w-auto">
          {atLimit ? "Limite de votre plan atteinte" : loading ? "Enregistrement…" : isEdit ? "Enregistrer les modifications" : "Publier l'événement"}
        </button>
        {isEdit && (
          <button type="button" onClick={onCancel} className="btn-secondary w-full sm:w-auto">
            Annuler
          </button>
        )}
      </div>
    </form>
  );
}
