# Configuración de PostgreSQL en CapRover

## Paso 1: Crear la App de PostgreSQL

1. **Accede a CapRover**: https://captain.panel.getdevtools.com
2. **Ve a "Apps"** en el menú lateral
3. **Click en "One-Click Apps/Databases"**
4. **Busca "PostgreSQL"** en la lista
5. **Click en "PostgreSQL"**
6. **Configura la app**:
   - **App Name**: `postgres` (o `postgresql`, como prefieras)
   - **PostgreSQL Password**: Genera una contraseña segura (o usa la que genera CapRover)
   - Click en **"Create App"**

7. **Espera a que se instale** (puede tardar 1-2 minutos)

## Paso 2: Obtener las Credenciales

Una vez instalado PostgreSQL:

1. **Ve a tu app de PostgreSQL** en CapRover
2. **Click en "App Configs"**
3. **Ve a la sección "Environment Variables"**
4. **Anota estos valores**:
   - `POSTGRES_PASSWORD`: La contraseña que configuraste
   - `POSTGRES_USER`: Generalmente es `postgres`
   - `POSTGRES_DB`: Generalmente es `postgres`

## Paso 3: Crear la Base de Datos

### Opción A: Desde el Terminal de CapRover

1. **Ve a tu app de PostgreSQL** en CapRover
2. **Click en "Terminal"** (o "App Logs" → "Terminal")
3. **Ejecuta**:
   ```bash
   psql -U postgres
   ```
4. **Crea la base de datos**:
   ```sql
   CREATE DATABASE learning_platform;
   ```
5. **Verifica**:
   ```sql
   \l
   ```
   Deberías ver `learning_platform` en la lista
6. **Salir**: `\q`

### Opción B: Desde la línea de comandos

```bash
docker exec -it srv-captain--postgres psql -U postgres -c "CREATE DATABASE learning_platform;"
```

## Paso 4: Obtener el Nombre del Servicio

El nombre del servicio de PostgreSQL en CapRover generalmente es:
- `srv-captain--postgres` (si nombraste la app `postgres`)
- `srv-captain--postgresql` (si nombraste la app `postgresql`)

**Para verificar:**
1. Ve a tu app de PostgreSQL
2. En "App Configs" → "Environment Variables", busca variables que contengan el nombre del servicio
3. O simplemente usa: `srv-captain--postgres` (reemplaza `postgres` con el nombre que diste a tu app)

## Paso 5: Configurar Variables de Entorno en tu App

1. **Ve a tu app de la plataforma educativa** (`learninggetdevtools`)
2. **Click en "App Configs"**
3. **Click en "Environment Variables"**
4. **Agrega las siguientes variables**:

### Variables de Base de Datos

```env
DB_HOST=srv-captain--postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu-password-de-postgres
DB_DATABASE=learning_platform
```

**Nota**: Reemplaza `srv-captain--postgres` con el nombre real de tu servicio de PostgreSQL.

### Variables de JWT

```env
JWT_SECRET=genera-un-secret-largo-y-seguro-aqui
JWT_EXPIRES_IN=7d
```

**Para generar un JWT_SECRET seguro**, puedes usar:
```bash
openssl rand -base64 32
```

### Variables del Servidor

```env
PORT=3000
NODE_ENV=production
```

### Variables de IA (Opcional)

Si quieres usar Gemini:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=tu-api-key-de-gemini
```

O si prefieres OpenAI:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=tu-api-key-de-openai
```

## Paso 6: Guardar y Reiniciar

1. **Click en "Save & Update"** (o "Guardar y Reiniciar")
2. **Espera a que la app se reinicie**
3. **Verifica los logs** para asegurarte de que se conectó a la base de datos

## Paso 7: Verificar la Conexión

1. **Ve a "App Logs"** de tu aplicación
2. **Busca mensajes como**:
   - ✅ "TypeOrmModule dependencies initialized"
   - ✅ "Application is running on: http://0.0.0.0:3000"
   - ❌ Si ves errores de conexión, verifica las variables de entorno

## Troubleshooting

### Error: "Unable to connect to the database"

**Causas posibles:**
1. **Nombre del servicio incorrecto**
   - Verifica que `DB_HOST` sea el nombre correcto del servicio
   - Generalmente es `srv-captain--[nombre-de-tu-app-postgres]`

2. **Contraseña incorrecta**
   - Verifica que `DB_PASSWORD` coincida con la contraseña de PostgreSQL

3. **Base de datos no existe**
   - Asegúrate de haber creado la base de datos `learning_platform`

4. **PostgreSQL no está corriendo**
   - Verifica que la app de PostgreSQL esté activa en CapRover

### Error: "database does not exist"

**Solución:**
```bash
# Conecta a PostgreSQL y crea la base de datos
docker exec -it srv-captain--postgres psql -U postgres -c "CREATE DATABASE learning_platform;"
```

### Verificar el nombre del servicio

```bash
# Lista todos los servicios en CapRover
docker ps | grep postgres
```

O desde CapRover:
1. Ve a "Apps"
2. Busca tu app de PostgreSQL
3. El nombre del servicio aparece en la URL o en los detalles

## Ejemplo Completo de Variables de Entorno

```env
# Database
DB_HOST=srv-captain--postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=MiPasswordSegura123!
DB_DATABASE=learning_platform

# JWT
JWT_SECRET=tu-secret-key-muy-largo-y-seguro-generado-con-openssl-rand-base64-32
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=production

# AI (Opcional)
AI_PROVIDER=gemini
GEMINI_API_KEY=tu-api-key-aqui
```

## Notas Importantes

1. **Seguridad**:
   - Nunca subas las variables de entorno al repositorio
   - El archivo `.env` ya está en `.gitignore`
   - Usa contraseñas fuertes para producción

2. **TypeORM en Producción**:
   - El código ya está configurado para NO usar `synchronize` en producción
   - Las tablas se crearán automáticamente la primera vez que se ejecute
   - En producción, considera usar migraciones

3. **Backup**:
   - Configura backups regulares de PostgreSQL
   - CapRover puede hacer backups automáticos

## Próximos Pasos

Después de configurar todo:
1. Verifica que la app esté corriendo
2. Prueba el endpoint de health: `https://tu-app.caprover.tu-dominio.com/health`
3. Verifica que las tablas se hayan creado en PostgreSQL

