import React from 'react';
import { Download, ImageOff } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { formatDateTime } from '@/lib/utils';

const statusMeta = {
  pending: { label: 'En attente', className: 'bg-amber-500/15 text-amber-600' },
  valid: { label: 'Valide', className: 'bg-amber-500/25 text-amber-600' },
  used: { label: 'Déjà utilisé', className: 'bg-ink/8 text-ink/45' },
  rejected: { label: 'Refusé', className: 'bg-rust-500/10 text-rust-500' },
};

// Dérive un numéro de carte lisible à partir du vrai jeton du ticket
// (jamais l'inverse : le jeton complet reste seul contenu du QR).
function cardNumber(token) {
  if (!token) return '----';
  const clean = token.toUpperCase();
  return `${clean.slice(0, 4)}-${clean.slice(4, 8)}`;
}

function compactDate(iso) {
  const d = new Date(iso);
  return `${d.toLocaleDateString('fr-FR')} · ${d.toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' })}`;
}

export default function TicketCard({ ticket, event }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(ticket.secure_token)}`;
  const status = statusMeta[ticket.status] || statusMeta.pending;

  const downloadPdf = async () => {
    const blob = await fetch(qrUrl).then((r) => r.blob());
    const data = await new Promise((resolve) => {
      const reader = new FileReader();
      reader.onload = () => resolve(reader.result);
      reader.readAsDataURL(blob);
    });
    const pdf = new jsPDF();
    pdf.setFontSize(20);
    pdf.text(event.name, 20, 24);
    pdf.setFontSize(11);
    pdf.text(`Lieu : ${event.venue}`, 20, 34);
    pdf.text(`Date : ${formatDateTime(event.event_date)}`, 20, 42);
    pdf.text(`N° carte : ${cardNumber(ticket.secure_token)}`, 20, 50);
    pdf.addImage(data, 'PNG', 45, 60, 120, 120);
    pdf.text(`Statut : ${status.label}`, 20, 192);
    pdf.save(`ticket-${event.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="card ticket">
      <div className="ticket-main">
        <div className="ticket-top">
          {event.ticket_image_url ? (
            <img className="ticket-thumb" src={event.ticket_image_url} alt="" />
          ) : (
            <div className="ticket-thumb placeholder">
              <ImageOff className="h-5 w-5" />
            </div>
          )}
          <div className="min-w-0">
            <div className="ticket-name">{event.name}</div>
            <div className="ticket-venue">{event.venue}</div>
          </div>
        </div>
        <div className="ticket-meta">
          <div>
            <div className="k">Date</div>
            <div className="v">{compactDate(event.event_date)}</div>
          </div>
          <div>
            <div className="k">N° carte</div>
            <div className="v">{cardNumber(ticket.secure_token)}</div>
          </div>
        </div>
      </div>

      <div className="ticket-divider">
        <span className="ticket-notch top" />
        <span className="ticket-notch bottom" />
      </div>

      <div className="ticket-qr-side">
        <img src={qrUrl} alt={`QR code pour ${event.name}`} />
        <span className={`ticket-status ${status.className}`}>{status.label}</span>
        <span className="ticket-email">{ticket.holder_email}</span>
        <div className="ticket-downloads">
          <a href={qrUrl} download="ticket.png" className="btn-secondary px-2.5 py-1 text-[11px]">
            <Download className="h-3 w-3" />
          </a>
          <button onClick={downloadPdf} className="btn-primary px-2.5 py-1 text-[11px]">PDF</button>
        </div>
      </div>
    </div>
  );
}