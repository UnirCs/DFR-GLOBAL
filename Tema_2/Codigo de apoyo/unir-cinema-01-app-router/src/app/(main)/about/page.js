'use client';

import { useMovies } from '@/hooks/useMovies';

export default function AboutPage() {
  const { darkMode } = useMovies();

  return (
    <div className={`page-container ${darkMode ? 'dark' : ''}`}>
      <div className="about-content">
        <h2>Sobre UNIR Cinema</h2>

        <div className="about-section">
          <h3>¿Quiénes somos?</h3>
          <p>
            UNIR Cinema es la cadena de cines líder en España, ofreciendo la mejor experiencia
            cinematográfica en las principales ciudades del país.
          </p>
        </div>

        <div className="about-section">
          <h3>Nuestra Historia</h3>
          <p>
            Fundada en 2015, UNIR Cinema nació con la visión de revolucionar la experiencia
            cinematográfica en España.
          </p>
        </div>

        <div className="about-section">
          <h3>Nuestras Ciudades</h3>
          <div className="cities-grid">
            <div className="city-card">
              <h4>🏙️ Madrid</h4>
              <p>Nuestra sede principal con salas modernas.</p>
            </div>
            <div className="city-card">
              <h4>🌊 Barcelona</h4>
              <p>Experiencia cinematográfica mediterránea.</p>
            </div>
            <div className="city-card">
              <h4>🍊 Valencia</h4>
              <p>Tradición y modernidad unidas.</p>
            </div>
            <div className="city-card">
              <h4>🌞 Sevilla</h4>
              <p>El arte del cine en Andalucía.</p>
            </div>
          </div>
        </div>

        <div className="contact-info">
          <h3>Contacto</h3>
          <p>📧 Email: info@unircinema.es</p>
          <p>📞 Teléfono: +34 900 123 456</p>
        </div>
      </div>
    </div>
  );
}
