'use client';

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { useMovies } from '@/hooks/useMovies';

export default function MainLayout({ children }) {
  const { darkMode } = useMovies();

  return (
    <div className={`App ${darkMode ? 'dark' : ''}`}>
      <Header />
      <main style={{ flex: 1 }}>
        {children}
      </main>
      <Footer />
    </div>
  );
}

