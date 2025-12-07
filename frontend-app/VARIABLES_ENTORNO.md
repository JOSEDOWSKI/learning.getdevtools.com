# Variables de Entorno - Frontend

## 🔧 Variables Necesarias

### Para Producción

Crea un archivo `.env.production` o configura estas variables en tu plataforma de despliegue:

```env
NEXT_PUBLIC_API_URL=https://learning.getdevtools.com
```

**Esta es la ÚNICA variable que necesitas modificar para producción.**

### Para Desarrollo Local

Crea o modifica `.env.local`:

```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📋 Explicación

### `NEXT_PUBLIC_API_URL`

- **Qué es**: URL base de tu API backend
- **Dónde se usa**: En todas las llamadas a la API desde el frontend
- **Valor en producción**: `https://learning.getdevtools.com`
- **Valor en desarrollo**: `http://localhost:3000`
- **Importante**: 
  - Debe empezar con `NEXT_PUBLIC_` para que Next.js la exponga al cliente
  - No incluyas la barra final (`/`)
  - Debe ser HTTPS en producción

## 🚀 Configuración por Plataforma

### Vercel (Recomendado para Next.js)

1. Ve a tu proyecto en Vercel
2. Settings → Environment Variables
3. Agrega:
   - **Name**: `NEXT_PUBLIC_API_URL`
   - **Value**: `https://learning.getdevtools.com`
   - **Environment**: Production, Preview, Development

### CapRover

1. Ve a tu app en CapRover
2. App Configs → Environment Variables
3. Agrega:
   ```
   NEXT_PUBLIC_API_URL=https://learning.getdevtools.com
   ```

### Docker

En tu `Dockerfile` o `docker-compose.yml`:

```dockerfile
ENV NEXT_PUBLIC_API_URL=https://learning.getdevtools.com
```

O en `docker-compose.yml`:
```yaml
environment:
  - NEXT_PUBLIC_API_URL=https://learning.getdevtools.com
```

### Variables de Entorno del Sistema

```bash
export NEXT_PUBLIC_API_URL=https://learning.getdevtools.com
```

## ✅ Verificación

Para verificar que la variable está configurada correctamente:

1. **En el código**: La variable se usa en `lib/api.ts`
2. **En el navegador**: Abre las DevTools → Console y ejecuta:
   ```javascript
   console.log(process.env.NEXT_PUBLIC_API_URL)
   ```
   Debe mostrar tu URL de producción

3. **En los logs**: Al hacer build, Next.js mostrará las variables públicas

## 🔒 Seguridad

- ✅ `NEXT_PUBLIC_*` variables son **públicas** (se incluyen en el bundle)
- ✅ No incluyas secrets en variables `NEXT_PUBLIC_*`
- ✅ La URL de la API es pública, está bien exponerla

## 📝 Resumen Rápido

**Para Producción:**
```env
NEXT_PUBLIC_API_URL=https://learning.getdevtools.com
```

**Para Desarrollo:**
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

¡Eso es todo! Solo necesitas modificar esta variable.

