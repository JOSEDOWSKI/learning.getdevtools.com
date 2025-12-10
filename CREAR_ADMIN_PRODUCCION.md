# Crear Usuario Admin en Producción

## Problema
El backend está funcionando correctamente, pero no hay usuarios en la base de datos, por lo que no puedes iniciar sesión.

## Solución: Crear Admin desde CapRover

### Opción 1: Usar el Terminal de CapRover (Recomendado)

1. **Ve a CapRover Dashboard**
2. **Selecciona la app de PostgreSQL** (`postgresqllearning`)
3. **Haz clic en "Terminal"** o "One-Click Apps/Databases" → "Terminal"
4. **Ejecuta este comando para conectarte a PostgreSQL:**

```bash
psql -U postgres -d postgres
```

5. **Genera el hash de la contraseña** (en otra terminal o antes de conectarte):

```bash
# En el terminal de CapRover, ejecuta:
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

O si no tienes Node.js en el contenedor, usa este comando en tu máquina local:

```bash
node -e "const bcrypt = require('bcrypt'); bcrypt.hash('admin123', 10).then(hash => console.log(hash));"
```

6. **Copia el hash generado** (algo como `$2b$10$...`)

7. **En la consola de PostgreSQL, ejecuta:**

```sql
INSERT INTO users (dni, full_name, email, password, role, created_at, updated_at)
VALUES (
  '12345678',
  'Administrador Principal',
  'admin@getdevtools.com',
  '$2b$10$TU_HASH_AQUI',  -- Pega el hash generado en el paso anterior
  'super_admin',
  NOW(),
  NOW()
);
```

**Ejemplo completo** (reemplaza el hash con el que generaste):

```sql
INSERT INTO users (dni, full_name, email, password, role, created_at, updated_at)
VALUES (
  '12345678',
  'Administrador Principal',
  'admin@getdevtools.com',
  '$2b$10$abcdefghijklmnopqrstuvwxyz1234567890ABCDEFGHIJKLMNOPQRSTUV',
  'super_admin',
  NOW(),
  NOW()
);
```

8. **Verifica que se creó:**

```sql
SELECT id, dni, full_name, email, role FROM users WHERE email = 'admin@getdevtools.com';
```

9. **Sal de PostgreSQL:**

```sql
\q
```

### Opción 2: Usar Docker Exec (Si tienes acceso SSH)

Si tienes acceso SSH al servidor de CapRover:

```bash
# Encuentra el contenedor de PostgreSQL
docker ps | grep postgres

# Conéctate al contenedor (reemplaza CONTAINER_ID)
docker exec -it CONTAINER_ID psql -U postgres -d postgres

# Luego ejecuta el INSERT de arriba
```

### Opción 3: Crear Admin desde el Frontend (Registro)

Si el registro está habilitado, puedes:

1. Ve a `https://learning.getdevtools.com/register`
2. Regístrate con:
   - DNI: `12345678`
   - Nombre: `Administrador Principal`
   - Email: `admin@getdevtools.com`
   - Contraseña: `admin123` (o la que prefieras)
3. Esto creará un usuario como `alumno` por defecto
4. Luego necesitas cambiar el rol a `super_admin` en la base de datos:

```sql
UPDATE users SET role = 'super_admin' WHERE email = 'admin@getdevtools.com';
```

## Credenciales por Defecto

Después de crear el admin, puedes iniciar sesión con:

- **Email:** `admin@getdevtools.com`
- **Contraseña:** `admin123` (o la que configuraste)

## Crear Otros Usuarios

### Profesor

```sql
-- Primero genera el hash de la contraseña
-- Luego ejecuta:
INSERT INTO users (dni, full_name, email, password, role, created_at, updated_at)
VALUES (
  '87654321',
  'Profesor Ejemplo',
  'profesor@getdevtools.com',
  '$2b$10$TU_HASH_AQUI',  -- Hash de 'profesor123'
  'profesor',
  NOW(),
  NOW()
);
```

### Alumno

```sql
INSERT INTO users (dni, full_name, email, password, role, created_at, updated_at)
VALUES (
  '11223344',
  'Alumno Demo',
  'alumno@getdevtools.com',
  '$2b$10$TU_HASH_AQUI',  -- Hash de 'alumno123'
  'alumno',
  NOW(),
  NOW()
);
```

## Verificar Usuarios

Para ver todos los usuarios:

```sql
SELECT id, dni, full_name, email, role, created_at FROM users ORDER BY created_at DESC;
```

## Notas Importantes

- **DNI**: Debe tener exactamente 8 dígitos
- **Email**: Debe ser único
- **Contraseña**: Mínimo 6 caracteres
- **Roles disponibles**: `super_admin`, `profesor`, `alumno`, `reclutador`
- **Base de datos**: `postgres` (no `learning_platform`)

## Solución de Problemas

### Error: "relation 'users' does not exist"
- Las tablas aún no se han creado. El backend debería crearlas automáticamente con `synchronize: true`
- Verifica los logs del backend para ver si hay errores de conexión

### Error: "duplicate key value violates unique constraint"
- El email ya existe. Usa otro email o elimina el usuario existente primero

### No puedo conectarme a PostgreSQL
- Verifica que la app de PostgreSQL esté corriendo en CapRover
- Verifica las credenciales: `postgres` / `151022qaz`

