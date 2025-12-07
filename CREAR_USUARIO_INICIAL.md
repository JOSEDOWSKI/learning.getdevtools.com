# Crear Usuario Inicial

## Opción 1: Desde el Frontend (Más Fácil)

1. Ve a: `https://learning.getdevtools.com/register`
2. Completa el formulario:
   - DNI: `12345678` (8 dígitos)
   - Nombre completo: Tu nombre
   - Email: tu@email.com
   - Contraseña: la que quieras
3. Click en "Registrarse"
4. Se creará como `alumno` por defecto

## Opción 2: Crear Super Admin desde la Base de Datos

Si necesitas un usuario `super_admin`, puedes crearlo directamente en PostgreSQL:

```bash
# Conecta a PostgreSQL
docker exec -it 2e94893583fd psql -U postgres -d learning_platform

# Crea el usuario (reemplaza los valores)
INSERT INTO users (dni, full_name, email, password, role, created_at)
VALUES (
  '12345678',
  'Admin Principal',
  'admin@getdevtools.com',
  '$2b$10$TuHashAqui', -- Necesitas generar el hash de bcrypt
  'super_admin',
  NOW()
);
```

## Opción 3: Crear Super Admin con Script

Ejecuta este comando para generar el hash de la contraseña:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('tu-password', 10).then(hash => console.log(hash));"
```

Luego usa ese hash en el INSERT de arriba.

## Opción 4: Usar la API directamente

```bash
curl -X POST https://apilearning.getdevtools.com/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "dni": "12345678",
    "full_name": "Tu Nombre",
    "email": "tu@email.com",
    "password": "tu-password"
  }'
```

Esto creará un usuario como `alumno`. Para cambiarlo a `super_admin`, necesitas actualizarlo en la base de datos.

## Recomendación

**Usa la Opción 1** (registro desde el frontend). Es la más fácil y rápida.

