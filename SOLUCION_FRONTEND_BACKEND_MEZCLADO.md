# Solución: Frontend ejecutando código del backend

## Problema
El frontend (`learninggetdevtools`) está ejecutando código del backend (NestJS) en lugar de Next.js, lo que causa errores de conexión a la base de datos.

## Causa
CapRover está usando el `captain-definition` incorrecto o el Dockerfile del backend en lugar del del frontend.

## Solución

### 1. Verificar configuración en CapRover

1. Ve a la app del **frontend** (`learninggetdevtools`) en CapRover
2. Ve a la sección **"App Configs"** o **"Deployment"**
3. Verifica que el **"Dockerfile Path"** o **"captain-definition"** apunte a:
   - `captain-definition-frontend` (en la raíz del repo)
   - O `./Dockerfile.frontend` directamente

### 2. Configurar el captain-definition correcto

Si CapRover no detecta automáticamente el `captain-definition-frontend`, puedes:

**Opción A: Usar el archivo correcto en la raíz**
- Asegúrate de que el archivo `captain-definition-frontend` existe en la raíz del repo
- En CapRover, configura manualmente el Dockerfile path a: `./Dockerfile.frontend`

**Opción B: Renombrar el archivo**
- Renombra `captain-definition-frontend` a `captain-definition` en el branch `main`
- Esto hará que CapRover lo use automáticamente para el frontend

### 3. Verificar variables de entorno del frontend

El frontend **NO debe tener** estas variables de entorno (solo el backend las necesita):
- ❌ `DB_HOST`
- ❌ `DB_PORT`
- ❌ `DB_USERNAME`
- ❌ `DB_PASSWORD`
- ❌ `DB_DATABASE`
- ❌ `JWT_SECRET`
- ❌ `JWT_EXPIRES_IN`

El frontend **SÍ debe tener** estas variables:
- ✅ `NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com`
- ✅ `NODE_ENV=production`
- ✅ `PORT=3000`

### 4. Forzar nuevo build

Después de corregir la configuración:
1. Ve a la app del frontend en CapRover
2. Haz clic en **"Force New Build"** o **"Deploy"**
3. Espera a que termine el build
4. Verifica los logs - deberías ver mensajes de Next.js, NO de NestJS

## Verificación

Después del build, los logs del frontend deberían mostrar:
```
✓ Starting...
✓ Ready in Xs
○ Compiling / ...
```

**NO deberían mostrar:**
```
[Nest] Starting Nest application...
[TypeOrmModule] Unable to connect...
```

## Nota importante

- **Backend** (`learning-backend`): Usa `captain-definition` → `./Dockerfile` (del backend)
- **Frontend** (`learninggetdevtools`): Usa `captain-definition-frontend` → `./Dockerfile.frontend`

Si ambos están en el mismo repo pero diferentes branches:
- `main` branch → Frontend → `captain-definition-frontend`
- `backend` branch → Backend → `captain-definition`

