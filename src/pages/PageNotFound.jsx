import React from 'react';
import { Link } from 'react-router-dom';
import Logo from '@/components/Logo';

export default function PageNotFound() {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center gap-4 px-4 text-center">
      <Logo size={48} />
      <h1 className="font-display text-3xl font-semibold text-ink">Page introuvable</h1>
      <p className="max-w-sm text-sm text-ink/55">
        Ce lien n'existe plus ou l'événement a peut-être été retiré par son organisateur.
      </p>
      <Link to="/" className="btn-primary">Retour à l'accueil</Link>
    </div>
  );
}
