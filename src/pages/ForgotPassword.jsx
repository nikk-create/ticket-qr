import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '@/lib/supabaseClient';
import AuthLayout from '@/components/AuthLayout';

export default function ForgotPassword() {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);
  const [sent, setSent] = useState(false);
  const [error, setError] = useState('');

  const submit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    const { error } = await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/reset-password`,
    });
    setLoading(false);
    if (error) {
      setError("Impossible d'envoyer le lien pour le moment.");
      return;
    }
    setSent(true);
  };

  return (
    <AuthLayout
      title="Mot de passe oublié"
      subtitle="Recevez un lien de réinitialisation par email."
      footer={
        <Link to="/login" className="font-semibold text-teal-900 hover:underline">
          ← Retour à la connexion
        </Link>
      }
    >
      {sent ? (
        <div className="rounded-xl border border-teal-900/15 bg-teal-50 p-4 text-sm text-teal-900">
          Un email a été envoyé à <strong>{email}</strong> avec les instructions pour réinitialiser votre mot de passe.
        </div>
      ) : (
        <form onSubmit={submit} className="space-y-4">
          <div>
            <label className="field-label" htmlFor="email">Email</label>
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
          {error && <p className="text-sm text-rust-500">{error}</p>}
          <button type="submit" disabled={loading} className="btn-primary w-full">
            {loading ? 'Envoi…' : 'Envoyer le lien'}
          </button>
        </form>
      )}
    </AuthLayout>
  );
}
