# Guía de Despliegue en CapRover

## Requisitos Previos

- CapRover instalado y funcionando
- Acceso SSH al servidor CapRover
- Git configurado

## Pasos para Desplegar

### 1. Preparar el Repositorio

Asegúrate de que tu código esté en un repositorio Git:

```bash
git add .
git commit -m "Preparado para producción"
git push origin main
```

### 2. Crear la Aplicación en CapRover

1. Accede al panel de CapRover
2. Ve a "Apps" → "One-Click Apps/Databases"
3. Crea una nueva aplicación:
   - **Nombre**: `learning-platform` (o el que prefieras)
   - **Método de despliegue**: Git o Dockerfile

### 3. Configurar Base de Datos PostgreSQL

#### Opción A: PostgreSQL desde CapRover (Recomendado)

1. En CapRover, ve a "One-Click Apps/Databases"
2. Instala "PostgreSQL"
3. Anota las credenciales que se generan automáticamente
4. La base de datos se creará automáticamente

#### Opción B: PostgreSQL Externa

Si ya tienes PostgreSQL en otro servidor, usa esas credenciales.

### 4. Configurar Variables de Entorno en CapRover

En el panel de CapRover, ve a tu aplicación → "App Configs" → "Environment Variables" y agrega:

```env
# Database (usa las credenciales de tu PostgreSQL en CapRover)
DB_HOST=srv-captain--postgres
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=tu-password-generado
DB_DATABASE=learning_platform

# JWT (IMPORTANTE: Cambia esto por un valor seguro)
JWT_SECRET=tu-secret-key-super-seguro-y-largo-aqui
JWT_EXPIRES_IN=7d

# Server
PORT=3000
NODE_ENV=production

# AI Provider (Opcional)
AI_PROVIDER=gemini
GEMINI_API_KEY=tu-api-key-de-gemini
# O
OPENAI_API_KEY=tu-api-key-de-openai
```

### 5. Crear la Base de Datos

Conecta a tu PostgreSQL desde CapRover y crea la base de datos:

```bash
# Desde CapRover CLI o SSH
docker exec -it srv-captain--postgres psql -U postgres -c "CREATE DATABASE learning_platform;"
```

O desde el panel de CapRover:
1. Ve a tu app de PostgreSQL
2. Abre el terminal
3. Ejecuta: `psql -U postgres -c "CREATE DATABASE learning_platform;"`

### 6. Desplegar la Aplicación

#### Opción A: Desde Git (Recomendado)

1. En CapRover, ve a tu app → "Deployment"
2. Selecciona "Method 1: Deploy from GitHub/Bitbucket/GitLab"
3. Conecta tu repositorio
4. Selecciona la rama (ej: `main`)
5. CapRover detectará automáticamente el `captain-definition` o `Dockerfile`

#### Opción B: Desde Dockerfile Local

1. En CapRover, ve a tu app → "Deployment"
2. Selecciona "Method 2: Deploy from Dockerfile"
3. Sube tu código o conecta tu repositorio

### 7. Verificar el Despliegue

1. Espera a que el build termine (puede tardar unos minutos)
2. Verifica los logs en CapRover → "App Logs"
3. Prueba el endpoint de health:
   ```bash
   curl https://tu-app.caprover.tu-dominio.com/health
   ```

### 8. Configurar Dominio (Opcional)

1. En CapRover, ve a tu app → "HTTP Settings"
2. Agrega tu dominio personalizado
3. Configura SSL (Let's Encrypt se configura automáticamente)

## Configuración de TypeORM en Producción

**IMPORTANTE**: En producción, TypeORM NO debe usar `synchronize: true`. 

El código actual ya está configurado para usar `synchronize` solo en desarrollo:

```typescript
synchronize: this.configService.get<string>('NODE_ENV') === 'development',
```

En producción (`NODE_ENV=production`), TypeORM no sincronizará automáticamente. Las tablas se crearán la primera vez que se ejecute, pero es mejor usar migraciones.

## Migraciones (Opcional pero Recomendado)

Para producción, considera usar migraciones en lugar de `synchronize`:

1. Genera migraciones en desarrollo:
   ```bash
   npm run migration:generate -- -n InitialMigration
   ```

2. Ejecuta migraciones en producción:
   ```bash
   npm run migration:run
   ```

## Troubleshooting

### Error: "Unable to connect to the database"
- Verifica que las variables de entorno estén correctas
- Asegúrate de que PostgreSQL esté corriendo
- Verifica que el nombre del servicio de PostgreSQL sea correcto (ej: `srv-captain--postgres`)

### Error: "Port already in use"
- CapRover maneja los puertos automáticamente, no necesitas configurar el puerto manualmente
- Asegúrate de que `PORT=3000` esté en las variables de entorno

### Las tablas no se crean
- Verifica los logs de la aplicación
- Asegúrate de que `NODE_ENV=production` esté configurado (para desactivar synchronize)
- O temporalmente usa `NODE_ENV=development` para crear las tablas la primera vez

## Seguridad en Producción

1. **JWT_SECRET**: Debe ser una cadena larga y aleatoria
   ```bash
   openssl rand -base64 32
   ```

2. **DB_PASSWORD**: Usa una contraseña fuerte generada por CapRover

3. **Variables de entorno**: Nunca las subas al repositorio

4. **HTTPS**: Configura SSL en CapRover (automático con Let's Encrypt)

## Monitoreo

- Revisa los logs regularmente en CapRover
- Configura alertas si es necesario
- Monitorea el uso de recursos

## Actualizaciones

Para actualizar la aplicación:

1. Haz push de tus cambios a Git
2. CapRover detectará los cambios automáticamente
3. O manualmente: "App" → "Update & Deploy"

