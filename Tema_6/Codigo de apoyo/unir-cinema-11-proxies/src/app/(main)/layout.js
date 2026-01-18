// Server Component - Layout principal del grupo (main)
// Los componentes que requieren interactividad (Header) son Client Components importados
// Footer es un Server Component ya que solo muestra contenido estático

import Header from '@/components/Header';
import Footer from '@/components/Footer';
import MainLayoutWrapper from '@/components/MainLayoutWrapper';

export default function MainLayout({ children }) {
  return (
    <MainLayoutWrapper>
      <Header />
      <main className="flex-1 flex justify-center">
        {children}
      </main>
      <Footer />
    </MainLayoutWrapper>
  );
}

