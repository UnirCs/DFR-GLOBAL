// Server Component - Página About con Tailwind

export default function AboutPage() {
  return (
    <div className="max-w-4xl mx-auto py-8 px-4">
      <h2 className="text-cinema-gold text-3xl md:text-4xl font-bold text-center mb-8 pb-4 border-b-4 border-cinema-red">
        Sobre UNIR Cinema
      </h2>

      {/* Quiénes somos */}
      <section className="mb-8 bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated p-6 rounded-xl shadow-lg border border-cinema-border">
        <h3 className="text-cinema-red text-xl font-bold mb-3">¿Quiénes somos?</h3>
        <p className="text-cinema-text-muted leading-relaxed">
          UNIR Cinema es la cadena de cines líder en España, ofreciendo la mejor experiencia
          cinematográfica en las principales ciudades del país.
        </p>
      </section>

      {/* Historia */}
      <section className="mb-8 bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated p-6 rounded-xl shadow-lg border border-cinema-border">
        <h3 className="text-cinema-red text-xl font-bold mb-3">Nuestra Historia</h3>
        <p className="text-cinema-text-muted leading-relaxed">
          Fundada en 2015, UNIR Cinema nació con la visión de revolucionar la experiencia
          cinematográfica en España.
        </p>
      </section>

      {/* Ciudades */}
      <section className="mb-8 bg-gradient-to-br from-cinema-dark-card to-cinema-dark-elevated p-6 rounded-xl shadow-lg border border-cinema-border">
        <h3 className="text-cinema-red text-xl font-bold mb-4">Nuestras Ciudades</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[
            { icon: '🏙️', name: 'Madrid', desc: 'Nuestra sede principal con salas modernas.' },
            { icon: '🌊', name: 'Barcelona', desc: 'Experiencia cinematográfica mediterránea.' },
            { icon: '🍊', name: 'Valencia', desc: 'Tradición y modernidad unidas.' },
            { icon: '🌞', name: 'Sevilla', desc: 'El arte del cine en Andalucía.' },
          ].map((city) => (
            <div
              key={city.name}
              className="bg-cinema-dark-elevated p-4 rounded-lg text-center border border-cinema-border hover:border-cinema-gold hover:-translate-y-1 transition-all duration-300 hover:shadow-lg hover:shadow-cinema-gold/20"
            >
              <h4 className="text-cinema-gold text-lg font-bold mb-2">{city.icon} {city.name}</h4>
              <p className="text-cinema-text-muted text-sm">{city.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Contacto */}
      <section className="bg-gradient-to-r from-cinema-red to-cinema-red-dark p-6 rounded-xl text-center shadow-lg shadow-cinema-red/30">
        <h3 className="text-white text-xl font-bold mb-4">Contacto</h3>
        <p className="text-white/90 mb-1">📧 Email: info@unircinema.es</p>
        <p className="text-white/90">📞 Teléfono: +34 900 123 456</p>
      </section>
    </div>
  );
}
