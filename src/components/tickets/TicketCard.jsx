import React from 'react';
import { Download } from 'lucide-react';
import { jsPDF } from 'jspdf';
import { formatDateTime } from '@/lib/utils';

const statusLabel = {
  pending: 'En attente de validation',
  valid: 'Ticket valide',
  used: 'Déjà utilisé',
  rejected: 'Refusé',
};

const statusStyle = {
  pending: 'bg-amber-500/15 text-amber-600',
  valid: 'bg-teal-900/10 text-teal-900',
  used: 'bg-ink/10 text-ink/50',
  rejected: 'bg-rust-500/10 text-rust-500',
};

export default function TicketCard({ ticket, event }) {
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=360x360&data=${encodeURIComponent(ticket.secure_token)}`;

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
    pdf.addImage(data, 'PNG', 45, 52, 120, 120);
    pdf.text(`Statut : ${statusLabel[ticket.status] || ticket.status}`, 20, 185);
    pdf.save(`ticket-${event.name.toLowerCase().replace(/\s+/g, '-')}.pdf`);
  };

  return (
    <div className="stub-card relative border border-teal-900/10 bg-white p-4 text-center shadow-card">
      <span className="stub-notch stub-notch--left" />
      <span className="stub-notch stub-notch--right" />
      <img src={qrUrl} alt={`QR code pour ${event.name}`} className="mx-auto h-40 w-40 rounded-lg" />
      <p className={`mx-auto mt-3 inline-block rounded-full px-2.5 py-1 text-xs font-semibold ${statusStyle[ticket.status] || ''}`}>
        {statusLabel[ticket.status] || ticket.status}
      </p>
      <p className="mb-3 mt-1.5 truncate text-xs text-ink/45">{ticket.holder_email}</p>
      <div className="flex justify-center gap-2">
        <a href={qrUrl} download="ticket.png" className="btn-secondary px-3 py-1.5 text-xs">
          <Download className="h-3.5 w-3.5" /> Image
        </a>
        <button onClick={downloadPdf} className="btn-primary px-3 py-1.5 text-xs">PDF</button>
      </div>
    </div>
  );
}
