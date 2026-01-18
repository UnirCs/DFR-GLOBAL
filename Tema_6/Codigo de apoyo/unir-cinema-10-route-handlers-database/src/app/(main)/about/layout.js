import PageContainer from '@/components/PageContainer';

// Server Layout para la sección About
// Envuelve las páginas about con el PageContainer (client) para manejar el tema

export default function AboutLayout({ children }) {
  return (
    <PageContainer>
      {children}
    </PageContainer>
  );
}

