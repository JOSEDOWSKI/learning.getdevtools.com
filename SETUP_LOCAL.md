# 🚀 Configuración para Desarrollo Local

## Requisitos Previos

1. **PostgreSQL** corriendo localmente (puerto 5432)
2. **Node.js** >= 20.0.0
3. **npm** >= 10.0.0

## Configuración Inicial

### 1. Instalar Dependencias

```bash
# Backend
npm install

# Frontend
cd frontend-app
npm install
cd ..
```

### 2. Configurar Variables de Entorno

Crea un archivo `.env` en la raíz del proyecto con:

```env
# Database Configuration
DB_HOST=localhost
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=postgres
DB_DATABASE=learning_platform

# JWT Configuration
JWT_SECRET=dev-secret-key-change-in-production
JWT_EXPIRES_IN=7d

# Server Configuration
PORT=3000
NODE_ENV=development

# File Uploads
UPLOAD_PATH=./uploads
```

### 3. Crear Base de Datos

```bash
# Conecta a PostgreSQL
psql -U postgres

# Crea la base de datos
CREATE DATABASE learning_platform;

# Salir
\q
```

### 4. Ejecutar Seed (Datos Demo)

```bash
npm run seed
```

Esto creará:
- ✅ Usuario Admin: `admin@getdevtools.com` / `admin123`
- ✅ Usuario Profesor: `profesor@getdevtools.com` / `profesor123`
- ✅ Usuario Alumno: `alumno@getdevtools.com` / `alumno123`
- ✅ 1 Carrera de ejemplo
- ✅ 2 Cursos con lecciones
- ✅ Acceso del alumno a un curso
- ✅ Progreso de lecciones

### 5. Iniciar Backend

```bash
npm run start:dev
```

El backend estará disponible en: `http://localhost:3000`

### 6. Iniciar Frontend

En otra terminal:

```bash
cd frontend-app
npm run dev
```

El frontend estará disponible en: `http://localhost:3000` (o el puerto que Next.js asigne)

## Credenciales de Acceso

### Admin
- Email: `admin@getdevtools.com`
- Password: `admin123`
- Rol: `super_admin`

### Profesor
- Email: `profesor@getdevtools.com`
- Password: `profesor123`
- Rol: `profesor`

### Alumno
- Email: `alumno@getdevtools.com`
- Password: `alumno123`
- Rol: `alumno`

## Estructura de Datos Demo

### Carrera
- **Desarrollo de Software** (24 meses)

### Cursos
1. **Introducción a TypeScript** (4 créditos, S/150)
   - 3 lecciones
   - Alumno tiene acceso y progreso

2. **NestJS Avanzado** (6 créditos, S/200)
   - Sin lecciones aún

## Comandos Útiles

```bash
# Ejecutar seed (poblar base de datos)
npm run seed

# Iniciar backend en modo desarrollo
npm run start:dev

# Iniciar frontend
cd frontend-app && npm run dev

# Limpiar y volver a ejecutar seed
npm run seed  # El script limpia automáticamente los datos existentes
```

## Solución de Problemas

### Error: "Cannot connect to database"
- Verifica que PostgreSQL esté corriendo: `pg_isready`
- Verifica las credenciales en `.env`
- Verifica que la base de datos exista: `psql -U postgres -l`

### Error: "Table does not exist"
- El seed usa `synchronize: false`, así que las tablas deben crearse automáticamente cuando inicies el backend
- O ejecuta el backend primero: `npm run start:dev` (creará las tablas)
- Luego ejecuta el seed: `npm run seed`

### Error: "Port 3000 already in use"
- Cambia el puerto en `.env`: `PORT=3001`
- O detén el proceso que está usando el puerto 3000

## Notas

- El seed limpia automáticamente los datos existentes antes de insertar nuevos
- Si quieres mantener datos existentes, comenta las líneas de limpieza en `src/scripts/seed.ts`
- Los videos y PDFs deben subirse manualmente desde la interfaz del profesor

