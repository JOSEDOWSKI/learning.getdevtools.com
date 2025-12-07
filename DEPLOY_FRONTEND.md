# Desplegar Frontend en Producción

## 🔍 Situación Actual

Estás viendo el **backend (API)** en `https://learning.getdevtools.com`, que muestra:
```json
{
  "name": "Plataforma Educativa Nacional - API",
  ...
}
```

El **frontend Next.js** necesita desplegarse por separado.

## 🚀 Opciones de Despliegue

### Opción 1: Vercel (Recomendado para Next.js) ⭐

Vercel es la plataforma oficial de Next.js y es la más fácil:

1. **Ve a**: https://vercel.com
2. **Conecta tu repositorio**: `JOSEDOWSKI/learning.getdevtools.com`
3. **Configura el proyecto**:
   - **Root Directory**: `frontend-app`
   - **Framework Preset**: Next.js
4. **Variables de Entorno**:
   - `NEXT_PUBLIC_API_URL` = `https://learning.getdevtools.com`
5. **Despliega**: Vercel lo hará automáticamente

**Ventajas**:
- ✅ Configuración automática
- ✅ SSL gratuito
- ✅ CDN global
- ✅ Despliegues automáticos desde GitHub

### Opción 2: CapRover (Mismo servidor)

Si quieres usar CapRover en el mismo servidor:

1. **Crea una nueva app en CapRover**:
   - Nombre: `learning-frontend` (o el que prefieras)
   - Tipo: One-Click App → Node.js

2. **Configura el Dockerfile** (crear en `frontend-app/Dockerfile`):
   ```dockerfile
   FROM node:20-alpine AS base
   
   # Instalar dependencias
   FROM base AS deps
   WORKDIR /app
   COPY package*.json ./
   RUN npm ci
   
   # Build
   FROM base AS builder
   WORKDIR /app
   COPY --from=deps /app/node_modules ./node_modules
   COPY . .
   RUN npm run build
   
   # Producción
   FROM base AS runner
   WORKDIR /app
   ENV NODE_ENV=production
   COPY --from=builder /app/public ./public
   COPY --from=builder /app/.next/standalone ./
   COPY --from=builder /app/.next/static ./.next/static
   
   EXPOSE 3000
   CMD ["node", "server.js"]
   ```

3. **Configura Next.js para standalone** (en `next.config.ts`):
   ```typescript
   output: 'standalone'
   ```

4. **Variables de Entorno en CapRover**:
   ```
   NEXT_PUBLIC_API_URL=https://learning.getdevtools.com
   PORT=3000
   NODE_ENV=production
   ```

5. **Configura el dominio**:
   - En HTTP Settings, agrega: `app.learning.getdevtools.com` (o el subdominio que prefieras)
   - Habilita SSL

### Opción 3: Subdominio en el mismo dominio

Puedes servir el frontend en un subdominio:

- **Backend**: `https://learning.getdevtools.com` (API)
- **Frontend**: `https://app.learning.getdevtools.com` (Frontend)

O usar rutas:
- **Backend API**: `https://learning.getdevtools.com/api/*`
- **Frontend**: `https://learning.getdevtools.com/*`

## 📋 Pasos Rápidos para Vercel (Recomendado)

1. **Instala Vercel CLI** (opcional):
   ```bash
   npm i -g vercel
   ```

2. **Desde `frontend-app`**:
   ```bash
   cd frontend-app
   vercel
   ```

3. **Sigue las instrucciones**:
   - Conecta tu cuenta
   - Selecciona el proyecto
   - Configura `NEXT_PUBLIC_API_URL`

4. **O desde el dashboard web**:
   - Ve a vercel.com
   - Importa tu repositorio
   - Configura `Root Directory: frontend-app`
   - Agrega variable de entorno

## 🔧 Configuración Necesaria

### Variable de Entorno

**Siempre necesitas**:
```env
NEXT_PUBLIC_API_URL=https://learning.getdevtools.com
```

### Verificar que Funciona

Después del despliegue:
1. Abre la URL del frontend
2. Deberías ver la página de login
3. Si ves "Plataforma Educativa Nacional - API", estás en el backend

## 🎯 Recomendación

**Usa Vercel** porque:
- ✅ Es gratis para proyectos personales
- ✅ Configuración automática de Next.js
- ✅ SSL automático
- ✅ Despliegues automáticos desde GitHub
- ✅ CDN global (muy rápido)

## 📝 Checklist

- [ ] Elegir plataforma (Vercel recomendado)
- [ ] Configurar variable `NEXT_PUBLIC_API_URL`
- [ ] Desplegar el frontend
- [ ] Verificar que funciona (debe mostrar login, no la API)
- [ ] Configurar dominio (opcional)

## 🆘 Si Sigues Viendo la API

Si después de desplegar sigues viendo "Plataforma Educativa Nacional - API":

1. **Verifica la URL**: Asegúrate de estar en la URL del frontend, no del backend
2. **Verifica el despliegue**: Revisa los logs en Vercel/CapRover
3. **Verifica variables**: Asegúrate de que `NEXT_PUBLIC_API_URL` esté configurada

¿Quieres que te ayude a configurar Vercel o prefieres usar CapRover?

