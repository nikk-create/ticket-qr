import React, { useEffect, useRef, useState } from 'react';

export default function CameraScanner({ onCode }) {
  const videoRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => () => {
    videoRef.current?.srcObject?.getTracks().forEach((t) => t.stop());
  }, []);

  const start = async () => {
    setError('');
    if (!('BarcodeDetector' in window)) {
      setError('Scanner caméra indisponible sur ce navigateur. Utilisez la saisie manuelle ci-dessous.');
      return;
    }
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } });
      videoRef.current.srcObject = stream;
      await videoRef.current.play();
      setRunning(true);
      const detector = new window.BarcodeDetector({ formats: ['qr_code'] });
      const timer = setInterval(async () => {
        try {
          const codes = await detector.detect(videoRef.current);
          if (codes[0]) {
            clearInterval(timer);
            stream.getTracks().forEach((t) => t.stop());
            setRunning(false);
            onCode(codes[0].rawValue);
          }
        } catch {
          /* frame not ready yet, ignore */
        }
      }, 350);
    } catch {
      setError("Impossible d'accéder à la caméra. Vérifiez les autorisations du navigateur.");
    }
  };

  return (
    <div className="space-y-3">
      <video
        ref={videoRef}
        className={`aspect-video w-full rounded-xl bg-teal-950 ${running ? 'block' : 'hidden'}`}
        muted
        playsInline
      />
      <button onClick={start} disabled={running} className="btn-primary w-full">
        {running ? 'Scan en cours…' : 'Ouvrir la caméra'}
      </button>
      {error && <p className="text-sm text-rust-500">{error}</p>}
    </div>
  );
}
