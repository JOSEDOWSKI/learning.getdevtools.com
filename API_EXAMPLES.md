# Ejemplos de Uso de la API

## 1. Registro de Usuario

```bash
curl -X POST http://localhost:3000/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "full_name": "Juan Pérez",
    "email": "juan@example.com",
    "password": "password123",
    "role": "alumno"
  }'
```

## 2. Inicio de Sesión

```bash
curl -X POST http://localhost:3000/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "juan@example.com",
    "password": "password123"
  }'
```

Respuesta:
```json
{
  "access_token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": 1,
    "email": "juan@example.com",
    "full_name": "Juan Pérez",
    "role": "alumno"
  }
}
```

## 3. Crear un Curso (como Profesor)

```bash
curl -X POST http://localhost:3000/courses \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "professor_id": 2,
    "title": "Introducción a Node.js",
    "description": "Curso básico de Node.js",
    "credits": 3,
    "base_price": 150.00,
    "revenue_share_pct": 80.0,
    "rubric": "Funcionalidad (40%), Código (30%), Documentación (20%), Creatividad (10%)"
  }'
```

## 4. Crear una Carrera

```bash
curl -X POST http://localhost:3000/courses/careers \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "name": "Desarrollo de Software",
    "description": "Carrera completa de desarrollo",
    "total_months": 24,
    "status": "active"
  }'
```

## 5. Otorgar Acceso a un Curso (sin pago)

```bash
curl -X POST http://localhost:3000/access \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "student_id": 1,
    "course_id": 1,
    "access_type": "scholarship"
  }'
```

## 6. Crear una Entrega (Submission)

```bash
curl -X POST http://localhost:3000/submissions \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_TOKEN" \
  -d '{
    "course_id": 1,
    "project_url": "https://github.com/usuario/proyecto"
  }'
```

## 7. Obtener Evaluación de una Entrega

```bash
curl -X GET http://localhost:3000/submissions/1/evaluation \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 8. Generar Certificado de Curso

```bash
curl -X POST http://localhost:3000/certificates/course/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 9. Generar Título Nacional (después de completar 24 meses)

```bash
curl -X POST http://localhost:3000/certificates/career/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 10. Verificar Certificado

```bash
curl -X GET http://localhost:3000/certificates/verify/HASH_DEL_CERTIFICADO
```

## 11. Ver Mis Accesos

```bash
curl -X GET http://localhost:3000/access/me \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## 12. Verificar Acceso a un Curso

```bash
curl -X GET http://localhost:3000/access/check/1 \
  -H "Authorization: Bearer YOUR_TOKEN"
```

## Notas Importantes

- Reemplaza `YOUR_TOKEN` con el token JWT obtenido del login
- Todos los endpoints que requieren autenticación necesitan el header `Authorization: Bearer TOKEN`
- Los IDs (1, 2, etc.) son ejemplos, usa los IDs reales de tu base de datos
- Para evaluación por IA, configura `OPENAI_API_KEY` en tu `.env`

