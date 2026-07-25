import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { Wifi, WifiOff } from 'lucide-react';
import { supabase } from '@/lib/supabaseClient';
import AppHeader from '@/components/AppHeader';
import CameraScanner from '@/components/scanner/CameraScanner';

export default function Scanner() {
  const { id } = useParams();
  const cacheKey = `ticketqr-cache-${id}`;
  const queueKey = `ticketqr-queue-${id}`;

  const [code, setCode] = useState('');
  const [result, setResult] = useState(null);
  const [online, setOnline] = useState(navigator.onLine);
  const [syncing, setSyncing] = useState(false);

  const refreshCache = async () => {
    const { data } = await supabase
      .from('tickets')
      .select('id, secure_token, status, holder_email')
      .eq('event_id', id)
      .eq('status', 'valid');
    localStorage.setItem(cacheKey, JSON.stringify(data || []));
  };

  const syncQueue = async () => {
    const queue = JSON.parse(localStorage.getItem(queueKey) || '[]');
    if (queue.length === 0) {
      await refreshCache();
      return;
    }
    setSyncing(true);
    for (const token of queue) {
      // Revalidation atomique côté serveur : garantit qu'un ticket scanné
      // deux fois (par ex. sur deux appareils pendant la coupure) n'est
      // jamais compté deux fois une fois la connexion revenue.
      await supabase.rpc('verify_ticket', { p_secure_token: token });
    }
    localStorage.removeItem(queueKey);
    await refreshCache();
    setSyncing(false);
  };

  useEffect(() => {
    syncQueue();
    const goOnline = () => { setOnline(true); syncQueue(); };
    const goOffline = () => setOnline(false);
    window.addEventListener('online', goOnline);
    window.addEventListener('offline', goOffline);
    return () => {
      window.removeEventListener('online', goOnline);
      window.removeEventListener('offline', goOffline);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [id]);

  const scan = async (value) => {
    const token = value.trim();
    if (!token) return;

    if (navigator.onLine) {
      const { data, error } = await supabase.rpc('verify_ticket', { p_secure_token: token });
      const row = Array.isArray(data) ? data[0] : data;
      if (error || !row?.success) {
        setResult({ ok: false, message: row?.message || 'Ticket invalide ou déjà utilisé' });
      } else {
        setResult({ ok: true, message: 'Entrée autorisée', detail: row.holder_email });
        refreshCache();
      }
    } else {
      // Mode hors ligne : un seul appareil scanner doit être utilisé pour
      // cet événement pendant la coupure, sinon le même ticket pourrait
      // être validé deux fois sur deux appareils avant la resynchronisation.
      const list = JSON.parse(localStorage.getItem(cacheKey) || '[]');
      const ticket = list.find((t) => t.secure_token === token && t.status === 'valid');
      if (!ticket) {
        setResult({ ok: false, message: 'Ticket invalide, déjà utilisé, ou pas encore en cache' });
      } else {
        ticket.status = 'used';
        localStorage.setItem(cacheKey, JSON.stringify(list));
        const queue = JSON.parse(localStorage.getItem(queueKey) || '[]');
        localStorage.setItem(queueKey, JSON.stringify([...queue, token]));
        setResult({ ok: true, message: 'Entrée autorisée (hors ligne)', detail: ticket.holder_email });
      }
    }
    setCode('');
  };

  return (
    <>
      <AppHeader />
      <main className="mx-auto max-w-xl space-y-6 px-4 py-10 sm:px-6">
        <div>
          <h1 className="font-display text-3xl font-semibold text-ink">Contrôle des tickets</h1>
          <p className={`mt-1.5 flex items-center gap-1.5 text-sm ${online ? 'text-teal-700' : 'text-amber-600'}`}>
            {online ? <Wifi className="h-4 w-4" /> : <WifiOff className="h-4 w-4" />}
            {online ? (syncing ? 'Synchronisation en cours…' : 'En ligne — vérification serveur en temps réel') : 'Hors ligne — un seul appareil scanner à la fois'}
          </p>
        </div>

        {result && (
          <div className={`rounded-2xl p-6 text-center ${result.ok ? 'bg-teal-900 text-sand' : 'bg-rust-500/10 text-rust-500'}`}>
            <p className="font-display text-xl font-semibold">{result.message}</p>
            {result.detail && <p className={`mt-1 text-sm ${result.ok ? 'text-sand/70' : 'text-rust-500/70'}`}>{result.detail}</p>}
          </div>
        )}

        <CameraScanner onCode={scan} />

        <div className="flex gap-2">
          <input
            className="field-input"
            placeholder="Ou coller le contenu du QR"
            value={code}
            onChange={(e) => setCode(e.target.value)}
          />
          <button onClick={() => scan(code)} className="btn-secondary shrink-0">Vérifier</button>
        </div>

        <p className="text-xs leading-relaxed text-ink/45">
          Avant une coupure réseau prévisible, ouvrez cette page en ligne quelques minutes pour
          mettre à jour la liste locale des tickets valides. En mode hors ligne, n'utilisez qu'un
          seul appareil pour cet événement afin d'éviter qu'un même ticket soit validé deux fois.
        </p>
      </main>
    </>
  );
}
