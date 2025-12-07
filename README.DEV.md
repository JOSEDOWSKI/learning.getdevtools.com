# Plataforma Educativa Nacional - Guía de Desarrollo

## Requisitos Previos

- **Node.js 20+** (requerido para NestJS 11)
- PostgreSQL 14+
- npm o yarn

⚠️ **IMPORTANTE**: NestJS 11 requiere Node.js v20 o superior. Las versiones anteriores de Node.js no son compatibles.

## Instalación

1. Clonar el repositorio
2. Instalar dependencias:
```bash
npm install
```

3. Configurar variables de entorno:
```bash
cp .env.example .env
```

Editar `.env` con tus credenciales de base de datos y API keys.

4. Crear la base de datos:
```bash
createdb learning_platform
```

5. Ejecutar migraciones (en desarrollo, TypeORM sincroniza automáticamente):
```bash
npm run start:dev
```

## Estructura del Proyecto

```
src/
├── modules/
│   ├── auth/          # Autenticación y JWT
│   ├── users/         # Gestión de usuarios
│   ├── courses/       # Cursos y carreras
│   ├── submissions/   # Entregas y evaluación por IA
│   ├── certificates/  # Certificados y títulos nacionales
│   ├── access/        # Control de acceso a cursos
│   ├── wallets/       # Billeteras virtuales
│   ├── transactions/  # Transacciones (sin pagos por ahora)
│   ├── skills/        # Matriz de habilidades
│   └── admin/         # Configuración y auditoría
├── config/            # Configuración de base de datos
└── main.ts           # Punto de entrada
```

## Endpoints Principales

### Autenticación
- `POST /auth/register` - Registro de usuario
- `POST /auth/login` - Inicio de sesión
- `POST /auth/profile` - Perfil del usuario (requiere JWT)

### Cursos
- `GET /courses` - Listar todos los cursos
- `GET /courses/:id` - Obtener un curso
- `POST /courses` - Crear curso (requiere JWT)
- `GET /courses/careers` - Listar carreras
- `POST /courses/careers` - Crear carrera (requiere JWT)

### Submissions
- `POST /submissions` - Crear entrega (requiere JWT)
- `GET /submissions` - Listar entregas
- `GET /submissions/:id` - Obtener entrega
- `GET /submissions/:id/evaluation` - Obtener evaluación

### Certificados
- `POST /certificates/course/:courseId` - Generar certificado de curso
- `POST /certificates/career/:careerId` - Generar título nacional
- `GET /certificates` - Listar certificados
- `GET /certificates/verify/:hash` - Verificar certificado

### Acceso
- `POST /access` - Otorgar acceso a curso (requiere JWT)
- `GET /access/me` - Mis accesos (requiere JWT)
- `GET /access/check/:courseId` - Verificar acceso (requiere JWT)

## Notas de Desarrollo

- **Sin Pagos**: La funcionalidad de pagos está omitida. Los accesos se otorgan manualmente mediante el endpoint `/access`.
- **Evaluación por IA**: Soporta **Google Gemini** (recomendado) y **OpenAI**. 
  - Configura `GEMINI_API_KEY` o `OPENAI_API_KEY` en `.env`
  - Por defecto usa Gemini si está disponible
  - Ver [GEMINI_SETUP.md](./GEMINI_SETUP.md) para más detalles
- **Validación DNI**: Actualmente solo valida formato (8 dígitos). La integración con RENIEC se implementará después.

## Scripts Disponibles

- `npm run start:dev` - Iniciar en modo desarrollo
- `npm run build` - Compilar para producción
- `npm run start:prod` - Ejecutar en producción
- `npm run lint` - Ejecutar linter

## Base de Datos

El esquema está definido en `schema.dbml`. TypeORM crea las tablas automáticamente en desarrollo (`synchronize: true`).

**⚠️ ADVERTENCIA**: En producción, usar migraciones en lugar de `synchronize: true`.

