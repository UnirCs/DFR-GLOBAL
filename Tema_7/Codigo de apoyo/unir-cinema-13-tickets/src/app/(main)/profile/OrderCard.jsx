'use client';

// Client Component - Tarjeta de orden con codigo QR
// Muestra los detalles de una orden y un QR para presentar en taquilla

import { useRef } from 'react';
import { QRCodeSVG } from 'qrcode.react';
import clsx from 'clsx';

/**
 * Formatea una fecha ISO a formato legible
 */
function formatDate(dateValue) {
  if (!dateValue) return '';
  const date = new Date(dateValue);
  return date.toLocaleDateString('es-ES', {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  });
}

/**
 * Formatea hora de formato HH:MM:SS a HH:MM
 */
function formatTime(timeValue) {
  if (!timeValue) return '';
  if (typeof timeValue === 'string') {
    return timeValue.substring(0, 5);
  }
  return timeValue;
}

/**
 * Genera el contenido del QR con los datos de la orden
 */
function generateQRContent(order) {
  const ticketInfo = order.tickets.length > 0 ? order.tickets[0] : {};
  return JSON.stringify({
    orderId: order.id,
    movie: ticketInfo.movieTitle,
    date: ticketInfo.showDate,
    time: ticketInfo.showTime,
    seats: order.tickets.map(t => t.seatLabel).join(', '),
    cinema: ticketInfo.cinemaName,
    total: order.totalAmount
  });
}

export default function OrderCard({ order }) {
  const qrRef = useRef(null);

  // Agrupar tickets por pelicula/sesion (en caso de multiples peliculas en una orden)
  const firstTicket = order.tickets[0];
  const seats = order.tickets.map(t => t.seatLabel).join(', ');

  const statusColors = {
    paid: 'text-green-400 border-green-500',
    pending: 'text-yellow-400 border-yellow-500',
    cancelled: 'text-red-400 border-red-500',
    refunded: 'text-blue-400 border-blue-500'
  };

  const statusLabels = {
    paid: 'Pagado',
    pending: 'Pendiente',
    cancelled: 'Cancelado',
    refunded: 'Reembolsado'
  };

  /**
   * Descarga el código QR como imagen PNG
   */
  const downloadQR = () => {
    if (!qrRef.current) return;

    const svg = qrRef.current.querySelector('svg');
    if (!svg) return;

    // Crear un canvas para convertir SVG a PNG
    const canvas = document.createElement('canvas');
    const ctx = canvas.getContext('2d');
    const svgData = new XMLSerializer().serializeToString(svg);
    const svgBlob = new Blob([svgData], { type: 'image/svg+xml;charset=utf-8' });
    const url = URL.createObjectURL(svgBlob);

    const img = new Image();
    img.onload = () => {
      // Tamaño del canvas (más grande para mejor calidad)
      canvas.width = 300;
      canvas.height = 300;

      // Fondo blanco
      ctx.fillStyle = 'white';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Dibujar QR centrado
      ctx.drawImage(img, 0, 0, canvas.width, canvas.height);

      // Crear link de descarga
      const link = document.createElement('a');
      link.download = `entrada-unir-cinema-orden-${order.id}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();

      URL.revokeObjectURL(url);
    };
    img.src = url;
  };

  return (
    <div className={clsx(
      'bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated',
      'rounded-2xl shadow-lg border border-cinema-border',
      'overflow-hidden'
    )}>
      {/* Cabecera con info de la pelicula */}
      <div className="p-4 border-b border-cinema-border">
        <div className="flex items-center justify-between mb-2">
          <span className="text-cinema-text-muted text-sm">
            Orden #{order.id}
          </span>
          <span className={clsx(
            'text-xs font-bold px-2 py-1 rounded border',
            statusColors[order.status] || statusColors.pending
          )}>
            {statusLabels[order.status] || order.status}
          </span>
        </div>

        <h3 className="text-cinema-gold font-bold text-lg">
          🎬 {firstTicket?.movieTitle || 'Pelicula'}
        </h3>

        <div className="mt-2 space-y-1 text-sm">
          <p className="text-cinema-text">
            📍 {firstTicket?.cinemaName || 'Cine'}
          </p>
          <p className="text-cinema-text">
            📅 {formatDate(firstTicket?.showDate)} - {formatTime(firstTicket?.showTime)}
          </p>
          <p className="text-cinema-text">
            💺 Asientos: <span className="text-cinema-gold font-semibold">{seats}</span>
          </p>
          <p className="text-cinema-text">
            🎞️ Formato: <span className="uppercase">{firstTicket?.format || 'standard'}</span>
          </p>
        </div>
      </div>

      {/* Codigo QR */}
      <div className="p-4 flex flex-col items-center bg-white">
        <div ref={qrRef}>
          <QRCodeSVG
            value={generateQRContent(order)}
            size={150}
            level="M"
            marginSize={4}
          />
        </div>
        <p className="text-gray-600 text-xs mt-2 text-center">
          Presenta este codigo en taquilla
        </p>
        <button
          onClick={downloadQR}
          className={clsx(
            'mt-3 px-4 py-2 rounded-lg text-sm font-semibold',
            'bg-cinema-dark text-cinema-gold border border-cinema-gold',
            'hover:bg-cinema-gold hover:text-cinema-dark',
            'transition-all duration-300'
          )}
        >
          📥 Descargar QR
        </button>
      </div>

      {/* Footer con total */}
      <div className="p-4 border-t border-cinema-border flex justify-between items-center">
        <span className="text-cinema-text-muted text-sm">
          {formatDate(order.createdAt)}
        </span>
        <span className="text-cinema-gold font-bold text-lg">
          {order.totalAmount.toFixed(2)}€
        </span>
      </div>
    </div>
  );
}

