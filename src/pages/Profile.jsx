import React, { useEffect, useState } from 'react';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/lib/AuthContext';
import AppHeader from '@/components/AppHeader';

export default function Profile() {
  const { user, profile, signOut, refreshProfile } = useAuth();
  const [form, setForm] = useState({ organization: '', phone: '' });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (profile) setForm({ organization: profile.organization || '', phone: profile.phone || '' });
  }, [profile]);

  const set = (key, value) => setForm((v) => ({ ...v, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const { error } = await supabase
      .from('profiles')
      .update({ organization: form.organization, phone: form.phone })
      .eq('id', user.id);
    setLoading(false);
    if (error) {
      toast.error('Échec de la mise à jour');
      return;
    }
    toast.success('Profil mis à jour');
    refreshProfile();
  };

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-2xl px-4 py-10 sm:px-6">
        <h1 className="mb-1 font-display text-3xl font-semibold text-ink">Profil organisateur</h1>
        <p className="mb-6 text-sm text-ink/55">Vos informations et paramètres de compte.</p>

        <form onSubmit={submit} className="card space-y-5 p-6">
          <div>
            <label className="field-label" htmlFor="full_name">Nom complet</label>
            <input id="full_name" value={profile?.full_name || ''} disabled className="field-input opacity-60" />
            <p className="mt-1 text-xs text-ink/40">Défini à l'inscription, non modifiable ici.</p>
          </div>
          <div>
            <label className="field-label" htmlFor="email">Email</label>
            <input id="email" value={user.email} disabled className="field-input opacity-60" />
          </div>
          <div>
            <label className="field-label" htmlFor="organization">Nom de l'organisation</label>
            <input id="organization" className="field-input" value={form.organization} onChange={(e) => set('organization', e.target.value)} placeholder="Ex. Galas Cotonou" />
          </div>
          <div>
            <label className="field-label" htmlFor="phone">Téléphone / WhatsApp</label>
            <input id="phone" className="field-input" value={form.phone} onChange={(e) => set('phone', e.target.value)} placeholder="Ex. +229 01 00 00 00" />
          </div>
          <div className="flex items-center justify-between pt-2">
            <button type="button" onClick={signOut} className="btn-secondary">Se déconnecter</button>
            <button type="submit" disabled={loading} className="btn-primary">{loading ? 'Enregistrement…' : 'Enregistrer'}</button>
          </div>
        </form>
      </main>
    </>
  );
}
