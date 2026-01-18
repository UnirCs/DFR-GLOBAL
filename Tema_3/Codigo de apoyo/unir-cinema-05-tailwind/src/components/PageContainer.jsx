// Server Component - Contenedor de páginas con Tailwind

const PageContainer = ({ children, className = '' }) => {
  return (
    <div className={`flex-1 p-4 md:p-8 max-w-7xl mx-auto w-full ${className}`}>
      {children}
    </div>
  );
};

export default PageContainer;
