# Guía: Crear Usuario Admin y Profesor

Esta guía te ayudará a crear el primer usuario administrador y luego un profesor para comenzar a usar la plataforma.

## Opción 1: Crear Admin desde la Base de Datos (Recomendado)

### Paso 1: Conectarse a PostgreSQL

```bash
# Encuentra el contenedor de PostgreSQL
docker ps | grep postgres

# Conéctate a la base de datos (reemplaza CONTAINER_ID con el ID real)
docker exec -it CONTAINER_ID psql -U postgres -d learning_platform
```

### Paso 2: Generar Hash de Contraseña

En otra terminal, genera el hash de bcrypt para tu contraseña:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('TU_PASSWORD_AQUI', 10).then(hash => console.log(hash));"
```

**Ejemplo:**
```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

Copia el hash que se genera (algo como `$2b$10$...`)

### Paso 3: Crear Usuario Admin

En la consola de PostgreSQL, ejecuta:

```sql
INSERT INTO users (dni, full_name, email, password, role, created_at)
VALUES (
  '12345678',
  'Administrador Principal',
  'admin@getdevtools.com',
  '$2b$10$TU_HASH_AQUI',  -- Pega el hash generado en el paso anterior
  'super_admin',
  NOW()
);
```

### Paso 4: Verificar que se creó

```sql
SELECT id, dni, full_name, email, role FROM users WHERE email = 'admin@getdevtools.com';
```

## Opción 2: Crear Admin desde la API (Requiere autenticación)

Si ya tienes un usuario con permisos, puedes usar la API:

```bash
curl -X POST https://apilearning.getdevtools.com/users \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer TU_TOKEN_JWT" \
  -d '{
    "dni": "12345678",
    "full_name": "Administrador Principal",
    "email": "admin@getdevtools.com",
    "password": "admin123",
    "role": "super_admin"
  }'
```

## Crear Profesor desde el Panel de Admin

Una vez que tengas el usuario admin creado:

1. **Inicia sesión como admin:**
   - Ve a `https://learning.getdevtools.com/login`
   - Email: `admin@getdevtools.com`
   - Contraseña: la que configuraste
   - Serás redirigido a `/admin/dashboard`

2. **Crear profesor desde el panel:**
   - Ve a `/admin/users` (Gestión de Usuarios)
   - Haz clic en "Crear Usuario" (si existe el botón)
   - O edita un usuario existente y cambia su rol a `profesor`

## Crear Profesor desde la Base de Datos

Si prefieres crear el profesor directamente en la base de datos:

```sql
-- Genera el hash de la contraseña primero (como en el paso 2)
INSERT INTO users (dni, full_name, email, password, role, created_at)
VALUES (
  '87654321',
  'Profesor Ejemplo',
  'profesor@getdevtools.com',
  '$2b$10$TU_HASH_AQUI',  -- Hash de la contraseña del profesor
  'profesor',
  NOW()
);
```

## Flujo Completo Recomendado

1. ✅ **Crear Admin** (Opción 1 - Base de datos)
2. ✅ **Iniciar sesión como Admin** en `https://learning.getdevtools.com/login`
3. ✅ **Ir a `/admin/users`** y crear un nuevo usuario con rol `profesor`
   - O crear el profesor directamente en la base de datos
4. ✅ **Iniciar sesión como Profesor** con las credenciales del profesor
5. ✅ **Ir a `/professor/courses`** y crear el primer curso
6. ✅ **Verificar el curso** desde la vista de alumno o admin

## Verificar Roles

Para verificar que los usuarios tienen los roles correctos:

```sql
SELECT id, full_name, email, role FROM users ORDER BY created_at DESC;
```

## Notas Importantes

- **DNI**: Debe tener exactamente 8 dígitos
- **Email**: Debe ser único en la base de datos
- **Contraseña**: Mínimo 6 caracteres
- **Roles disponibles**: `super_admin`, `profesor`, `alumno`, `reclutador`

## Solución de Problemas

### Error: "Email ya existe"
- El email ya está registrado. Usa otro email o elimina el usuario existente.

### Error: "DNI inválido"
- El DNI debe tener exactamente 8 dígitos numéricos.

### No puedo iniciar sesión
- Verifica que el hash de la contraseña sea correcto
- Asegúrate de que el usuario existe en la base de datos
- Revisa los logs del backend para ver errores específicos

