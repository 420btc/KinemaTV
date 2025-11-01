# Guía de Deployment en Vercel

## Preparación

### 1. Configurar variables de entorno en Vercel
En tu dashboard de Vercel, ve a Settings > Environment Variables y agrega:

```
VITE_TMDB_API_KEY=tu_api_key_de_tmdb
OPENAI_API_KEY=tu_api_key_de_openai
DATABASE_URL=tu_url_de_neon_database
DATABASE_URL_UNPOOLED=tu_url_de_neon_database_unpooled
VITE_STACK_PROJECT_ID=tu_stack_project_id
VITE_STACK_PUBLISHABLE_CLIENT_KEY=tu_stack_publishable_key
STACK_SECRET_SERVER_KEY=tu_stack_secret_key
```

### 2. Crear la tabla de comentarios en Neon
Ejecuta este SQL en tu consola de Neon:

```sql
CREATE TABLE IF NOT EXISTS "Comment" (
    "id" SERIAL PRIMARY KEY,
    "mediaId" INTEGER NOT NULL,
    "mediaType" TEXT NOT NULL,
    "username" TEXT NOT NULL,
    "content" TEXT NOT NULL,
    "title" TEXT,
    "posterPath" TEXT,
    "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS "Comment_mediaId_mediaType_idx" ON "Comment"("mediaId", "mediaType");
CREATE INDEX IF NOT EXISTS "Comment_createdAt_idx" ON "Comment"("createdAt");

DROP TRIGGER IF EXISTS update_comment_updated_at ON "Comment";
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW."updatedAt" = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

CREATE TRIGGER update_comment_updated_at
    BEFORE UPDATE ON "Comment"
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();
```

## Deployment

### Opción 1: Deploy desde GitHub (Recomendado)
1. Sube tu código a GitHub
2. Conecta tu repositorio en Vercel
3. Vercel detectará automáticamente que es un proyecto Vite
4. Deploy automático ✅

### Opción 2: Deploy desde CLI
```bash
npm install -g vercel
vercel login
vercel --prod
```

## Estructura de la API

La aplicación usa Vercel Functions para el backend:
- `/api/comments.js` - Maneja todas las operaciones de comentarios
- Endpoints disponibles:
  - `GET /api/comments?mediaId=123&mediaType=movie` - Obtener comentarios
  - `POST /api/comments` - Crear comentario
  - `GET /api/comments?action=recent&limit=10` - Comentarios recientes
  - `GET /api/comments?action=count&mediaId=123&mediaType=movie` - Contar comentarios

## Verificación post-deployment

1. Verifica que la aplicación carga correctamente
2. Prueba crear un comentario en una película/serie
3. Verifica que los comentarios se muestran correctamente
4. Revisa los logs en Vercel si hay errores

## Notas importantes

- ✅ **Frontend y Backend en una sola aplicación**
- ✅ **Base de datos Neon PostgreSQL**
- ✅ **Funciones serverless automáticas**
- ✅ **CORS configurado correctamente**
- ✅ **Variables de entorno seguras**

## Solución de problemas

### Error de CORS
- Las funciones de Vercel ya tienen CORS configurado
- Si persiste, verifica que la URL en `comments.ts` sea correcta

### Error de base de datos
- Verifica que `DATABASE_URL` esté configurada en Vercel
- Asegúrate de que la tabla `Comment` existe en Neon

### Error 500 en comentarios
- Revisa los logs de funciones en Vercel Dashboard
- Verifica que todas las variables de entorno estén configuradas