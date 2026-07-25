import React, { useState } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import AuthLayout from '@/components/AuthLayout';

export default function Login() {
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const set = (key, value) => setForm((v) => ({ ...v, [key]: value }));

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.signInWithPassword({
      email: form.email,
      password: form.password,
    });
    setLoading(false);
    if (error) {
      setError('Email ou mot de passe incorrect.');
      return;
    }
    toast.success('Connexion réussie');
    navigate(location.state?.from || '/', { replace: true });
  };

  return (
    <AuthLayout
      title="Content de vous revoir"
      subtitle="Connectez-vous pour gérer vos événements ou retrouver vos réservations."
      footer={
        <>
          Pas encore de compte ?{' '}
          <Link to="/register" className="font-semibold text-teal-900 hover:underline">
            Créer un compte
          </Link>
        </>
      }
    >
      <form onSubmit={submit} className="space-y-4">
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
          <div className="flex items-center justify-between">
            <label className="field-label" htmlFor="password">Mot de passe</label>
            <Link to="/forgot-password" className="mb-1.5 text-xs font-medium text-teal-700 hover:underline">
              Oublié ?
            </Link>
          </div>
          <input
            id="password"
            type="password"
            required
            className="field-input"
            value={form.password}
            onChange={(e) => set('password', e.target.value)}
            placeholder="••••••••"
          />
        </div>
        {error && <p className="text-sm text-rust-500">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Connexion…' : 'Se connecter'}
        </button>
      </form>
    </AuthLayout>
  );
}
