# ⚠️ IMPORTANTE: Verificar Variables de Entorno

## 🔴 Problema Detectado

El frontend está intentando conectarse a `http://localhost:3000` en lugar de `https://apilearning.getdevtools.com`.

Esto significa que la variable `NEXT_PUBLIC_API_URL` **NO está configurada** en CapRover.

## ✅ Solución Inmediata

### En CapRover:

1. **Ve a tu app** → "App Configs" → "Environment Variables"
2. **Verifica que esta variable esté configurada**:
   ```
   NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
   ```
3. **Si NO está**, agrégalas:
   ```
   NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
   PORT=3000
   NODE_ENV=production
   ```
4. **Guarda y reinicia** la app

## 📋 Variables Completas Necesarias

```env
DB_HOST=srv-captain--postgresqllearning
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=151022qaz
DB_DATABASE=learning_platform
JWT_SECRET=4+8zM/GiX+T6r7azuYrblIBcBMI/k4eduOjTMqxjVg8=
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
```

## 🔍 Cómo Verificar

Después de configurar las variables:

1. **Reinicia la app** en CapRover
2. **Abre** `https://learning.getdevtools.com`
3. **Abre la consola** (F12)
4. **Verifica** que las llamadas vayan a `https://apilearning.getdevtools.com` (no a `localhost`)

## ⚠️ Nota

Las variables `NEXT_PUBLIC_*` se compilan en el build. Si cambias la variable después del build, **necesitas hacer un nuevo build**.

**Solución**: Después de agregar `NEXT_PUBLIC_API_URL`, haz "Force Build" en CapRover.

