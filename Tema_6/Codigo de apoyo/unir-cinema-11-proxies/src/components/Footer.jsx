// Server Component - Footer con Tailwind
// Uso de clsx para organizar las clases de Tailwind

import clsx from 'clsx';

const Footer = () => {
  return (
    <footer className={clsx(
      'bg-gradient-to-r from-cinema-dark-secondary via-cinema-dark-elevated to-cinema-dark-secondary',
      'border-t-2 border-cinema-red py-6 text-center',
      'shadow-[0_-4px_20px_rgba(0,0,0,0.5)]'
    )}>
      <p className="text-cinema-text-muted text-sm">
        &copy; 2024 UNIR Cinema. Todos los derechos reservados.
      </p>
    </footer>
  );
};

export default Footer;
