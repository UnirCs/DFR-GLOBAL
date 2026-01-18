# UNIR Cinema - Refactorización de Estilos con CSS Modules

Este proyecto demuestra la correcta organización de estilos CSS en una aplicación Next.js utilizando **CSS Modules** para estilos de componentes y páginas, manteniendo un archivo `globals.css` limpio y enfocado únicamente en estilos verdaderamente globales.

## 📁 Estructura de Archivos CSS

### Archivo Global (`src/app/globals.css`)

El archivo `globals.css` contiene **únicamente** estilos que afectan a toda la aplicación:

- **Reset CSS**: Normalización de estilos por defecto del navegador
- **Variables CSS**: Colores, transiciones y valores reutilizables
- **Estilos base del body**: Fuentes, colores y configuración general
- **Preferencias del sistema**: Media queries para modo oscuro del sistema

```css
/* Variables CSS globales */
:root {
  --color-primary: #007bff;
  --color-primary-dark: #0056b3;
  --color-danger: #dc3545;
  --color-success: #28a745;
  --color-text-light: #333;
  --color-text-dark: #e0e0e0;
  --color-bg-light: #f5f5f5;
  --color-bg-dark: #1a1a1a;
  --color-card-light: #fff;
  --color-card-dark: #2a2a2a;
  --transition-base: 0.3s ease;
}
```

### CSS Modules para Componentes (`src/components/*.module.css`)

Cada componente tiene su propio archivo de estilos encapsulado:

| Componente | Archivo CSS Module |
|------------|-------------------|
| Header | `Header.module.css` |
| Footer | `Footer.module.css` |
| CineSelector | `CineSelector.module.css` |
| Pelicula | `Pelicula.module.css` |
| SeatSelection | `SeatSelection.module.css` |
| PageContainer | `PageContainer.module.css` |
| MainLayoutWrapper | `MainLayoutWrapper.module.css` |

### CSS Modules para Páginas (`src/app/(main)/**/*.module.css`)

Cada vista/página tiene sus estilos específicos:

| Página | Archivo CSS Module |
|--------|-------------------|
| HomePage | `HomePage.module.css` |
| About | `about/AboutPage.module.css` |
| Login | `login/LoginPage.module.css` |
| NotFound | `NotFound.module.css` |
| MovieDetails | `movie/MovieDetails.module.css` |

## ✨ Beneficios de esta Arquitectura

1. **Encapsulamiento**: Los estilos de cada componente están aislados, evitando conflictos de nombres de clases.

2. **Mantenibilidad**: Es fácil encontrar y modificar los estilos de un componente específico.

3. **Escalabilidad**: Agregar nuevos componentes no afecta los estilos existentes.

4. **Rendimiento**: Next.js optimiza automáticamente los CSS Modules, eliminando estilos no utilizados.

5. **Claridad**: El archivo `globals.css` es pequeño y contiene solo lo esencial.

## 🔧 Cómo usar CSS Modules

### En un componente:

```jsx
import styles from './MiComponente.module.css';

const MiComponente = () => {
  return (
    <div className={styles.container}>
      <h1 className={styles.title}>Título</h1>
    </div>
  );
};
```

### Para clases dinámicas (ej. modo oscuro):

```jsx
<div className={`${styles.container} ${darkMode ? styles.dark : ''}`}>
```

## 📝 Resumen de la Refactorización

Se ha realizado una refactorización completa del sistema de estilos:

- ✅ **Antes**: Un único archivo `globals.css` con ~1000 líneas conteniendo todos los estilos
- ✅ **Después**: Archivo `globals.css` reducido (~55 líneas) + CSS Modules individuales para cada componente y página

Esta estructura sigue las mejores prácticas de desarrollo en Next.js y facilita el trabajo en equipo al tener estilos claramente organizados y encapsulados.
