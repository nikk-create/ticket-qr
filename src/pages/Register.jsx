import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import AuthLayout from '@/components/AuthLayout';

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ full_name: '', organization: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, value) => setForm((v) => ({ ...v, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { data, error } = await supabase.auth.signUp({
      email: form.email,
      password: form.password,
      options: {
        data: { full_name: form.full_name, organization: form.organization },
      },
    });
    setLoading(false);
    if (error) {
      setError(error.message === 'User already registered'
        ? 'Un compte existe déjà avec cet email.'
        : "L'inscription a échoué. Réessayez.");
      return;
    }
    if (data.session) {
      toast.success('Compte créé');
      navigate('/organizer', { replace: true });
    } else {
      toast.success('Vérifiez votre boîte mail pour confirmer votre compte');
      navigate('/login', { replace: true });
    }
  };

  return (
    <AuthLayout
      title="Créer votre espace organisateur"
      subtitle="Publiez vos événements et gérez vos tickets en quelques minutes."
      footer={
        <>
          Déjà inscrit ?{' '}
          <Link to="/login" className="font-semibold text-teal-900 hover:underline">
            Se connecter
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="field-label" htmlFor="full_name">Nom complet</label>
          <input
            id="full_name"
            required
            className="field-input"
            value={form.full_name}
            onChange={(e) => set('full_name', e.target.value)}
            placeholder="Ex. Nikkolas A."
          />
        </div>
        <div>
          <label className="field-label" htmlFor="organization">Organisation (optionnel)</label>
          <input
            id="organization"
            className="field-input"
            value={form.organization}
            onChange={(e) => set('organization', e.target.value)}
            placeholder="Ex. InnovaTech Events"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="email">Email</label>
          <input
            id="email"
            type="email"
            required
            className="field-input"
            value={form.email}
            onChange={(e) => set('email', e.target.value)}
            placeholder="vous@exemple.com"
          />
        </div>
        <div>
          <label className="field-label" htmlFor="password">Mot de passe</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            className="field-input"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            placeholder="6 caractères minimum"
          />
        </div>
        {error && <p className="text-sm text-rust-500">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Création…' : 'Créer mon compte'}
        </button>
      </form>
    </AuthLayout>
  );
}
