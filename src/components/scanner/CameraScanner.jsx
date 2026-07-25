import React, { useEffect, useRef, useState } from 'react';
import jsQR from 'jsqr';

// Décode le QR image par image via un canvas caché, avec jsQR — plutôt que
// l'API native BarcodeDetector (non supportée par Safari / iPhone). Ça
// fonctionne à l'identique sur Android, iOS et desktop.
export default function CameraScanner({ onCode }) {
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const streamRef = useRef(null);
  const frameRef = useRef(null);
  const [running, setRunning] = useState(false);
  const [error, setError] = useState('');

  const stop = () => {
    if (frameRef.current) cancelAnimationFrame(frameRef.current);
    streamRef.current?.getTracks().forEach((t) => t.stop());
    setRunning(false);
  };

  useEffect(() => stop, []);

  const tick = () => {
    const video = videoRef.current;
    const canvas = canvasRef.current;
    if (!video || !canvas || video.readyState !== video.HAVE_ENOUGH_DATA) {
      frameRef.current = requestAnimationFrame(tick);
      return;
    }
    canvas.width = video.videoWidth;
    canvas.height = video.videoHeight;
    const ctx = canvas.getContext('2d', { willReadFrequently: true });
    ctx.drawImage(video, 0, 0, canvas.width, canvas.height);
    const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
    const result = jsQR(imageData.data, imageData.width, imageData.height, {
      inversionAttempts: 'dontInvert',
    });
    if (result?.data) {
      stop();
      onCode(result.data);
      return;
    }
    frameRef.current = requestAnimationFrame(tick);
  };

  const start = async () => {
    setError('');
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: { ideal: 'environment' } },
        audio: false,
      });
      streamRef.current = stream;
      const video = videoRef.current;
      video.srcObject = stream;
      video.setAttribute('playsinline', 'true');
      await video.play();
      setRunning(true);
      frameRef.current = requestAnimationFrame(tick);
    } catch {
      setError("Impossible d'accéder à la caméra. Vérifiez les autorisations du navigateur (Réglages > Safari > Caméra sur iPhone).");
    }
  };

  return (
    <div className="space-y-3">
      <video
        ref={videoRef}
        className={`aspect-video w-full rounded-xl bg-teal-950 object-cover ${running ? 'block' : 'hidden'}`}
        muted
        playsInline
        autoPlay
      />
      <canvas ref={canvasRef} className="hidden" />
      <button onClick={running ? stop : start} className="btn-primary w-full">
        {running ? 'Arrêter le scan' : 'Ouvrir la caméra'}
      </button>
      {error && <p className="text-sm text-rust-500">{error}</p>}
    </div>
  );
}
