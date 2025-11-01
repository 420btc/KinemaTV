# 🚀 Guía de Deployment - TMDB Movies

## Variables de Entorno Requeridas

Para que la aplicación funcione correctamente en producción, debes configurar las siguientes variables de entorno en tu plataforma de deployment:

### 🔑 Stack Auth (Autenticación)
```
VITE_STACK_PROJECT_ID=f992c91a-1933-45eb-be47-2b481c1139b2
VITE_STACK_PUBLISHABLE_CLIENT_KEY=pck_1ds8tf3c3rnmhdz1hheckw7angf7ttnk9x0mtf861gw5g
STACK_SECRET_SERVER_KEY=ssk_yspnq6t0keqkt3se09bn5bcwe1apgrtrspvxzt717312r
```

### 🎬 TMDB API
```
VITE_TMDB_API_KEY=bbea590c55f639975ab33bf63c9254f4
```

### 🗄️ Base de Datos (Neon PostgreSQL)
```
DATABASE_URL=postgresql://neondb_owner:npg_twifyB3gMe1H@ep-fragrant-silence-a4wly4dc-pooler.us-east-1.aws.neon.tech/neondb?sslmode=require
DATABASE_URL_UNPOOLED=postgresql://neondb_owner:npg_twifyB3gMe1H@ep-fragrant-silence-a4wly4dc.us-east-1.aws.neon.tech/neondb?sslmode=require
```

## 📋 Configuración en Vercel

1. Ve a tu proyecto en Vercel Dashboard
2. Navega a **Settings** → **Environment Variables**
3. Agrega cada variable con su valor correspondiente
4. Asegúrate de marcar las variables como disponibles para **Production**, **Preview** y **Development**

## 🔧 Configuración en Netlify

1. Ve a tu sitio en Netlify Dashboard
2. Navega a **Site settings** → **Environment variables**
3. Agrega cada variable con su valor correspondiente

## ⚠️ Problemas Comunes

### Error: "INVALID_OAUTH_CLIENT_ID_OR_SECRET"
Este error ocurre cuando las variables de Stack Auth no están configuradas correctamente:

- ✅ **Solución**: Verifica que `VITE_STACK_PROJECT_ID` y `VITE_STACK_PUBLISHABLE_CLIENT_KEY` estén configuradas en tu plataforma de deployment
- ✅ **Verificación**: Revisa la consola del navegador para ver mensajes de error específicos

### Variables no se cargan en producción
- ✅ Asegúrate de que las variables empiecen con `VITE_` para que Vite las incluya en el build
- ✅ Redeploya después de agregar las variables de entorno
- ✅ Verifica que las variables estén marcadas para el entorno correcto (Production/Preview)

## 🔍 Debug en Producción

Si tienes problemas, abre la consola del navegador en tu sitio de producción. La aplicación mostrará mensajes de error específicos si las variables no están configuradas correctamente.