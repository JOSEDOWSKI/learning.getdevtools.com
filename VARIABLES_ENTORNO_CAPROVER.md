# Variables de Entorno para CapRover

## Backend (`learning-backend`)

Configura estas variables de entorno en CapRover para la app del backend:

```env
DB_HOST=srv-captain--postgresqllearning
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=151022qaz
DB_DATABASE=postgres
JWT_SECRET=4+8zM/GiX+T6r7azuYrblIBcBMI/k4eduOjTMqxjVg8=
JWT_EXPIRES_IN=7d
PORT=3000
NODE_ENV=production
```

### Notas importantes:
- **DB_HOST**: Usa `srv-captain--postgresqllearning` (nombre interno de CapRover), NO uses la IP `10.0.1.7`
- **DB_DATABASE**: Es `postgres`, no `learning_platform` (según la configuración de tu PostgreSQL en CapRover)
- **DB_PORT**: `5432` (puerto estándar de PostgreSQL)

## Frontend (`learninggetdevtools`)

Configura estas variables de entorno en CapRover para la app del frontend:

```env
NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
NODE_ENV=production
PORT=3000
```

### Notas importantes:
- **NO** configures variables de base de datos en el frontend (DB_HOST, DB_PORT, etc.)
- El frontend solo necesita la URL del backend API
- El frontend debe usar `Dockerfile.frontend`, no `Dockerfile`

## Cómo configurar en CapRover

1. Ve a tu app en CapRover
2. Haz clic en **"App Configs"** o **"Environment Variables"**
3. Agrega cada variable una por una:
   - Key: `DB_HOST`
   - Value: `srv-captain--postgresqllearning`
4. Repite para todas las variables
5. Guarda los cambios
6. Fuerza un nuevo build/restart

## Verificación

### Backend
Después de configurar y hacer build, los logs deberían mostrar:
```
🔍 Database Configuration:
  DB_HOST: srv-captain--postgresqllearning
  DB_PORT: 5432
  DB_USERNAME: postgres
  DB_DATABASE: postgres
  NODE_ENV: production
```

### Frontend
Los logs deberían mostrar mensajes de Next.js, NO de NestJS:
```
✓ Starting...
✓ Ready in Xs
```

## Problema común: Frontend ejecutando backend

Si el frontend muestra errores de TypeORM o NestJS, significa que está usando el Dockerfile incorrecto.

**Solución:**
1. En el branch `main`, el `captain-definition` debe apuntar a `Dockerfile.frontend`
2. O configura manualmente en CapRover el Dockerfile path a `./Dockerfile.frontend`

