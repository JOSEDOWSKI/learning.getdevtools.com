# Endpoints de la API - Lista Completa

Base URL: `https://learning.getdevtools.com`

## 🔐 Autenticación

### POST /auth/register
Registrar un nuevo usuario
```json
{
  "dni": "12345678",
  "full_name": "Juan Pérez",
  "email": "juan@example.com",
  "password": "password123"
}
```

### POST /auth/login
Iniciar sesión
```json
{
  "email": "juan@example.com",
  "password": "password123"
}
```

### POST /auth/profile
Obtener perfil (requiere JWT)
Headers: `Authorization: Bearer [token]`

## 👥 Usuarios

### GET /users
Listar todos los usuarios (requiere JWT)

### GET /users/me
Obtener mi perfil (requiere JWT)

### GET /users/:id
Obtener usuario por ID (requiere JWT)

## 📚 Cursos

### GET /courses
Listar todos los cursos

### GET /courses/:id
Obtener un curso específico

### POST /courses
Crear un curso (requiere JWT, rol: profesor/admin)

### GET /courses/careers
Listar todas las carreras

### GET /courses/careers/:id
Obtener una carrera específica

## 📝 Submissions (Entregas)

### POST /submissions
Crear una entrega (requiere JWT)
```json
{
  "course_id": 1,
  "project_url": "https://github.com/usuario/proyecto"
}
```

### GET /submissions
Listar entregas (requiere JWT)

### GET /submissions/:id
Obtener una entrega (requiere JWT)

### GET /submissions/:id/evaluation
Obtener evaluación de una entrega (requiere JWT)

## 🎓 Certificados

### POST /certificates/course/:courseId
Generar certificado de curso (requiere JWT)

### POST /certificates/career/:careerId
Generar título nacional (requiere JWT)

### GET /certificates
Listar certificados (requiere JWT)

### GET /certificates/verify/:hash
Verificar certificado (público)

## 🔑 Acceso

### POST /access
Otorgar acceso a curso (requiere JWT)
```json
{
  "student_id": 1,
  "course_id": 1,
  "access_type": "scholarship"
}
```

### GET /access/me
Mis accesos (requiere JWT)

### GET /access/check/:courseId
Verificar acceso a curso (requiere JWT)

## 🏥 Health Check

### GET /health
Verificar estado del servidor
Respuesta: `{"status":"ok","timestamp":"..."}`

## 📖 Ejemplos de Uso

Ver `API_EXAMPLES.md` para ejemplos detallados con curl.

