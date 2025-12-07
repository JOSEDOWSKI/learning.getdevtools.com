# Configuración Completa de CapRover - Lista para Copiar

## ✅ Información de PostgreSQL

- **Servicio**: `srv-captain--postgresqllearning`
- **Puerto**: `5432`
- **Usuario**: `postgres`
- **Contraseña**: `151022qaz`
- **Base de datos por defecto**: `postgres`

## 📋 Paso 1: Crear la Base de Datos

Ejecuta este comando desde el terminal de CapRover o SSH:

**Opción 1: Usar el ID del contenedor (más fácil)**
```bash
docker exec -it 2e94893583fd psql -U postgres -c "CREATE DATABASE learning_platform;"
```

**Opción 2: Usar el nombre completo del contenedor**
```bash
docker exec -it srv-captain--postgresqllearning.1.545j2j98mw8ogm88q6drl4cme psql -U postgres -c "CREATE DATABASE learning_platform;"
```

**Nota**: El ID del contenedor puede cambiar si se reinicia. Si eso pasa, ejecuta `docker ps | grep postgresqllearning` para obtener el nuevo ID.

O desde el terminal de la app de PostgreSQL en CapRover:

```sql
psql -U postgres
CREATE DATABASE learning_platform;
\q
```

## 📋 Paso 2: Variables de Entorno para tu App

Ve a tu app `learninggetdevtools` → **App Configs** → **Environment Variables**

Copia y pega estas variables (TODO está listo, solo copia y pega):

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
```

### Variables Opcionales de IA

Si quieres usar Gemini:
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=tu-api-key-de-gemini
```

Si prefieres OpenAI:
```env
AI_PROVIDER=openai
OPENAI_API_KEY=tu-api-key-de-openai
```

## 📋 Paso 3: Guardar y Reiniciar

1. Click en **"Save & Update"** (o "Guardar y Reiniciar")
2. Espera a que la app se reinicie
3. Verifica los logs

## ✅ Verificación

### 1. Verificar que la base de datos existe:

```bash
docker exec -it 2e94893583fd psql -U postgres -c "\l" | grep learning_platform
```

### 2. Verificar las tablas (después de que la app inicie):

```bash
docker exec -it 2e94893583fd psql -U postgres -d learning_platform -c "\dt"
```

Deberías ver 16 tablas.

### 3. Verificar los logs de la app:

En CapRover → Tu App → App Logs, busca:
- ✅ "TypeOrmModule dependencies initialized"
- ✅ "Application is running on: http://0.0.0.0:3000"
- ❌ Si ves errores, verifica las variables de entorno

### 4. Probar el endpoint:

```bash
curl https://tu-app.caprover.tu-dominio.com/health
```

Debería responder: `{"status":"ok","timestamp":"..."}`

## 🔧 Troubleshooting

### Error: "Unable to connect to the database"

**Verifica:**
1. Que el nombre del servicio sea correcto: `srv-captain--postgresqllearning`
2. Que la contraseña sea: `151022qaz`
3. Que la base de datos `learning_platform` exista

### Error: "database does not exist"

**Solución:**
```bash
docker exec -it 2e94893583fd psql -U postgres -c "CREATE DATABASE learning_platform;"
```

**Nota**: Si el contenedor se reinicia, el ID puede cambiar. Usa `docker ps | grep postgresqllearning` para obtener el ID actual.

### Verificar conexión manualmente

```bash
docker exec -it 2e94893583fd psql -U postgres -d learning_platform -c "SELECT version();"
```

## 📝 Resumen de Variables (Listo para Copiar)

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
```

