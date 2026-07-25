import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { supabase } from '@/lib/supabaseClient';
import AuthLayout from '@/components/AuthLayout';

export default function ResetPassword() {
  const navigate = useNavigate();
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.updateUser({ password });
    setLoading(false);
    if (error) {
      setError('Le lien a peut-être expiré. Redemandez-en un nouveau.');
      return;
    }
    toast.success('Mot de passe mis à jour');
    navigate('/login', { replace: true });
  };

  return (
    <AuthLayout title="Choisir un nouveau mot de passe">
      <form onSubmit={submit} className="space-y-4">
        <div>
          <label className="field-label" htmlFor="password">Nouveau mot de passe</label>
          <input
            id="password"
            type="password"
            required
            minLength={6}
            className="field-input"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            placeholder="6 caractères minimum"
          />
        </div>
        {error && <p className="text-sm text-rust-500">{error}</p>}
        <button type="submit" disabled={loading} className="btn-primary w-full">
          {loading ? 'Mise à jour…' : 'Mettre à jour le mot de passe'}
        </button>
      </form>
    </AuthLayout>
  );
}
