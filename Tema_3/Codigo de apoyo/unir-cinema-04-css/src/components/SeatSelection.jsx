'use client';

// Client Component - Requiere interactividad compleja:
// - useState para manejar asientos seleccionados
// - Eventos onClick para seleccionar/deseleccionar asientos
// - useRouter para navegación programática
// - Acceso al contexto global

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useMovies } from '@/hooks/useMovies';
import styles from './SeatSelection.module.css';

const SeatSelection = ({ movieId, time }) => {
  const router = useRouter();
  const { getMovieById, darkMode } = useMovies();
  const [selectedSeats, setSelectedSeats] = useState([]);

  const movie = getMovieById(movieId);

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

  const getSeatClass = (seat) => {
    if (seat.isOccupied) return `${styles.seat} ${styles.seatOccupied}`;
    if (selectedSeats.includes(seat.id)) return `${styles.seat} ${styles.seatSelected}`;
    return `${styles.seat} ${styles.seatAvailable}`;
  };

  if (!movie) {
    return (
      <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
        <div className={styles.seatSelection}>
          <h1>Película no encontrada</h1>
          <Link href="/" className={styles.navButton}>Volver al inicio</Link>
        </div>
      </div>
    );
  }

  return (
    <div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
      <div className={styles.seatSelection}>
        <button
          onClick={() => router.back()}
          className={styles.navButton}
          style={{ marginBottom: '2rem' }}
        >
          ← Volver
        </button>

        <h1>Selección de Asientos</h1>
        <h2>{movie.title} - {decodeURIComponent(time)}</h2>

        <div style={{ textAlign: 'center', margin: '2rem 0' }}>
          <div className={styles.screen}>
            🎬 PANTALLA 🎬
          </div>
        </div>

        <div className={styles.seatsGrid}>
          {seats.map((seat) => (
            <div
              key={seat.id}
              className={getSeatClass(seat)}
              onClick={() => toggleSeat(seat.id)}
            >
              {seat.id}
            </div>
          ))}
        </div>

        <div className={styles.legend}>
          <div>🟢 Disponible</div>
          <div>🔵 Seleccionado</div>
          <div>🔴 Ocupado</div>
        </div>

        {selectedSeats.length > 0 && (
          <div className={styles.summary}>
            <h3>Asientos seleccionados: {selectedSeats.join(', ')}</h3>
            <p>Total: {selectedSeats.length} asiento(s) × 12€ = {selectedSeats.length * 12}€</p>
            <button className={styles.navButton} style={{ fontSize: '1.2rem', padding: '1rem 2rem' }}>
              Confirmar Reserva
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SeatSelection;

