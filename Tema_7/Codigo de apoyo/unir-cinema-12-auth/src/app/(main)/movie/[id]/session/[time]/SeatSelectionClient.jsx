'use client';

// Client Component - Selección de asientos con interactividad
// Recibe los datos de la película ya cargados desde el Server Component
// - useState para manejar asientos seleccionados
// - Eventos onClick para seleccionar/deseleccionar asientos
// - useRouter para navegación programática
// Esta ruta esta protegida por el proxy de Next.js (src/proxy.js)

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import clsx from 'clsx';

const SeatSelectionClient = ({ movie, time }) => {
  const router = useRouter();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const generateSeats = () => {
    const seats = [];
    const rows = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J'];

    for (let row of rows) {
      for (let num = 1; num <= 10; num++) {
        const seatId = `${row}${num}`;
        const isOccupied = Math.random() < 0.3;
        seats.push({
          id: seatId,
          row: row,
          number: num,
          isOccupied: isOccupied,
          isSelected: false
        });
      }
    }
    return seats;
  };

  const [seats] = useState(generateSeats());

  const toggleSeat = (seatId) => {
    const seat = seats.find(s => s.id === seatId);
    if (seat && !seat.isOccupied) {
      if (selectedSeats.includes(seatId)) {
        setSelectedSeats(selectedSeats.filter(id => id !== seatId));
      } else {
        setSelectedSeats([...selectedSeats, seatId]);
      }
    }
  };

  const getSeatClasses = (seat) => {
    const isSelected = selectedSeats.includes(seat.id);

    return clsx(
      // Clases base
      'aspect-square rounded-lg flex items-center justify-center font-bold text-xs transition-all duration-300 border-2',
      {
        // Estado: Ocupado
        'bg-cinema-red/70 text-white border-cinema-red-dark cursor-not-allowed': seat.isOccupied,
        // Estado: Seleccionado
        'bg-cinema-gold text-cinema-dark border-cinema-gold shadow-lg shadow-cinema-gold/50 cursor-pointer': !seat.isOccupied && isSelected,
        // Estado: Disponible
        'bg-green-600 text-white border-green-600 cursor-pointer hover:scale-110 hover:shadow-lg hover:shadow-green-500/50': !seat.isOccupied && !isSelected,
      }
    );
  };

  return (
    <div className="bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated p-6 md:p-10 lg:p-12 rounded-2xl shadow-lg shadow-black/50 border border-cinema-border">
          <button
            onClick={() => router.back()}
            className="mb-6 bg-gradient-to-r from-cinema-gold to-cinema-gold-dark text-cinema-dark px-5 py-2 rounded-lg font-bold hover:-translate-y-0.5 hover:shadow-lg hover:shadow-cinema-gold/50 transition-all duration-300"
          >
            ← Volver
          </button>

          <h1 className="text-cinema-gold text-2xl md:text-3xl font-bold mb-2">🎟️ Selección de Asientos</h1>
          <h2 className="text-cinema-text text-lg md:text-xl mb-8">{movie.title} - {decodeURIComponent(time)}</h2>

          {/* Pantalla */}
          <div className="mb-10">
            <div className="w-full bg-gradient-to-b from-cinema-dark-elevated to-cinema-dark py-4 rounded-lg border-2 border-cinema-border text-cinema-gold font-bold text-center shadow-[0_0_30px_rgba(212,175,55,0.2)]">
              🎬 PANTALLA 🎬
            </div>
          </div>

          {/* Grid de asientos */}
          <div className="grid grid-cols-10 gap-2 md:gap-3 lg:gap-4 max-w-3xl mx-auto mb-10">
            {seats.map((seat) => (
              <div
                key={seat.id}
                className={getSeatClasses(seat)}
                onClick={() => toggleSeat(seat.id)}
              >
                {seat.id}
              </div>
            ))}
          </div>

          {/* Leyenda */}
          <div className="flex justify-center gap-8 flex-wrap mb-10 py-4">
            <div className="flex items-center gap-2 text-cinema-text-muted text-sm">
              <span className="w-5 h-5 rounded bg-green-600"></span>
              Disponible
            </div>
            <div className="flex items-center gap-2 text-cinema-text-muted text-sm">
              <span className="w-5 h-5 rounded bg-cinema-gold"></span>
              Seleccionado
            </div>
            <div className="flex items-center gap-2 text-cinema-text-muted text-sm">
              <span className="w-5 h-5 rounded bg-cinema-red/70"></span>
              Ocupado
            </div>
          </div>

          {/* Resumen */}
          {selectedSeats.length > 0 && (
            <div className="text-center p-6 bg-cinema-dark-elevated rounded-xl border border-cinema-gold shadow-lg shadow-cinema-gold/20">
              <h3 className="text-cinema-gold font-bold text-lg mb-2">
                Asientos seleccionados: {selectedSeats.join(', ')}
              </h3>
              <p className="text-cinema-text-muted text-lg mb-4">
                Total: {selectedSeats.length} asiento(s) × 12€ = <strong className="text-cinema-gold text-xl">{selectedSeats.length * 12}€</strong>
              </p>
              <button className="bg-gradient-to-r from-cinema-red to-cinema-red-dark text-white px-8 py-3 rounded-lg font-bold text-lg hover:-translate-y-0.5 hover:shadow-xl hover:shadow-cinema-red/50 hover:brightness-110 transition-all duration-300">
                🎟️ Confirmar Reserva
              </button>
            </div>
          )}
    </div>
  );
};

export default SeatSelectionClient;

