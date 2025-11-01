# 🎬 KinemaTV - Tu Plataforma de Películas y Series

Una aplicación web moderna y completa para explorar, buscar y organizar películas y series de TV, con funcionalidades avanzadas como tier lists personalizados y gestión de favoritos.

## ✨ Características Principales

### 🏠 **Página de Inicio**
- Películas populares, mejor valoradas y en tendencia
- Series de TV populares y mejor valoradas
- Interfaz moderna con gradientes y efectos visuales

### 🔍 **Búsqueda Avanzada**
- Búsqueda por nombre de película
- Filtro por año de lanzamiento (1900-2024)
- Resultados en tiempo real con portadas

### 🎯 **Exploración**
- Catálogo completo de películas y series
- Navegación intuitiva por categorías
- Información detallada de cada título

### 📋 **Tier List de Películas**
- Crea tier lists personalizados con 6 niveles (S, A, B, C, D, F)
- Funcionalidad drag & drop para organizar películas
- Búsqueda integrada para añadir películas
- Captura de imagen del tier list completo
- Portadas en alta resolución

### ❤️ **Gestión Personal**
- Lista de favoritos personalizada
- Watchlist para películas por ver
- Sincronización con cuenta de usuario

### 🔐 **Autenticación**
- Sistema de login/registro seguro
- Gestión de sesiones
- Perfiles de usuario personalizados

## 🛠️ Tecnologías Utilizadas

- **Frontend**: React 19 + TypeScript
- **Styling**: Tailwind CSS
- **Build Tool**: Vite
- **API**: The Movie Database (TMDB)
- **Autenticación**: Stack Auth
- **Base de Datos**: Prisma ORM
- **Captura de Imágenes**: html2canvas
- **Iconos**: Lucide React

## 🚀 Instalación y Configuración

### Prerrequisitos
- Node.js (v20.19.0 o superior)
- npm o yarn
- Cuenta en TMDB para API key

### 1. Clonar el repositorio
```bash
git clone <repository-url>
cd kinematv-app
```

### 2. Instalar dependencias
```bash
npm install
```

### 3. Configurar variables de entorno
Crea un archivo `.env` basado en `.env.example`:
```env
VITE_TMDB_API_KEY=tu_api_key_de_tmdb
DATABASE_URL=tu_url_de_base_de_datos
STACK_PROJECT_ID=tu_project_id_de_stack
```

### 4. Configurar la base de datos
```bash
npx prisma generate
npx prisma db push
```

### 5. Ejecutar en desarrollo
```bash
npm run dev
```

## 📱 Funcionalidades Detalladas

### 🎬 **Tier List**
- **6 Niveles**: S (Obra Maestra), A (Excelente), B (Muy Buena), C (Buena), D (Regular), F (Mala)
- **Colores Distintivos**: Cada nivel tiene su propio gradiente de color
- **Drag & Drop**: Arrastra películas entre niveles fácilmente
- **Búsqueda Integrada**: Busca y añade películas directamente
- **Captura de Imagen**: Descarga tu tier list como PNG de alta calidad
- **Responsive**: Funciona perfectamente en desktop y móvil

### 🔍 **Sistema de Búsqueda**
- **Búsqueda por Nombre**: Encuentra películas por título
- **Filtro por Año**: Refina resultados por año de lanzamiento
- **Resultados Visuales**: Portadas y información básica
- **Integración**: Disponible en header y página dedicada

### 📊 **Gestión de Contenido**
- **Favoritos**: Guarda tus películas favoritas
- **Watchlist**: Lista de películas por ver
- **Detalles Completos**: Información detallada, cast, trailers
- **Sincronización**: Todo se guarda en tu perfil

## 🎨 Diseño y UX

- **Tema Oscuro**: Diseño moderno con fondo oscuro
- **Gradientes**: Efectos visuales atractivos
- **Responsive**: Adaptado para todos los dispositivos
- **Animaciones**: Transiciones suaves y efectos hover
- **Tipografía**: Fuentes legibles y jerarquía clara

## 📁 Estructura del Proyecto

```
src/
├── components/          # Componentes reutilizables
│   ├── AuthButton.tsx
│   ├── FavoriteButton.tsx
│   └── WatchlistButton.tsx
├── pages/              # Páginas principales
│   ├── Home.tsx
│   ├── Search.tsx
│   ├── TierList.tsx
│   ├── Explore.tsx
│   ├── Favorites.tsx
│   └── ...
├── services/           # Servicios API
│   └── tmdb.ts
├── hooks/              # Custom hooks
│   ├── useAuth.ts
│   ├── useFavorites.ts
│   └── useWatchlist.ts
├── api/                # API endpoints
├── lib/                # Utilidades
└── types/              # Tipos TypeScript
```

## 🌐 API y Servicios

### TMDB API
- Películas populares y mejor valoradas
- Series de TV
- Búsqueda de contenido
- Detalles completos con cast y videos
- Imágenes en múltiples resoluciones

### Stack Auth
- Autenticación segura
- Gestión de sesiones
- Perfiles de usuario

## 🚀 Despliegue

### Vercel (Recomendado)
```bash
npm run build
vercel --prod
```

### Otras plataformas
```bash
npm run build
# Subir carpeta dist/ a tu hosting
```

## 🤝 Contribución

1. Fork el proyecto
2. Crea una rama para tu feature (`git checkout -b feature/AmazingFeature`)
3. Commit tus cambios (`git commit -m 'Add some AmazingFeature'`)
4. Push a la rama (`git push origin feature/AmazingFeature`)
5. Abre un Pull Request

## 📄 Licencia

Este proyecto está bajo la Licencia MIT. Ver `LICENSE` para más detalles.

## 🙏 Agradecimientos

- [The Movie Database (TMDB)](https://www.themoviedb.org/) por la API
- [React](https://reactjs.org/) por el framework
- [Tailwind CSS](https://tailwindcss.com/) por el styling
- [Vite](https://vitejs.dev/) por el build tool

## 📞 Contacto

Para preguntas o sugerencias, puedes abrir un issue en el repositorio.

---

**¡Disfruta explorando el mundo del cine con KinemaTV! 🍿**