# Poblar Datos Iniciales en Producción

Como cambiaste de base de datos (`learning_platform` → `postgres`), necesitas crear todos los datos nuevamente.

## Pasos para Poblar Datos

### 1. Crear Usuario Admin

Primero, crea el usuario admin siguiendo la guía en `CREAR_ADMIN_PRODUCCION.md`.

### 2. Crear Usuario Profesor

Después de iniciar sesión como admin, puedes crear un profesor desde el panel de administración:

1. Inicia sesión como admin en `https://learning.getdevtools.com/login`
2. Ve a `/admin/users` (si existe) o crea el profesor directamente en la base de datos:

```sql
-- Genera el hash primero (en tu máquina local):
-- node -e "const bcrypt = require('bcrypt'); bcrypt.hash('profesor123', 10).then(hash => console.log(hash));"

INSERT INTO users (dni, full_name, email, password, role, created_at, updated_at)
VALUES (
  '87654321',
  'Profesor Ejemplo',
  'profesor@getdevtools.com',
  '$2b$10$TU_HASH_AQUI',  -- Pega el hash generado
  'profesor',
  NOW(),
  NOW()
);
```

### 3. Crear Carreras y Cursos

#### Opción A: Desde el Frontend (Recomendado)

1. **Inicia sesión como Profesor:**
   - Email: `profesor@getdevtools.com`
   - Contraseña: `profesor123` (o la que configuraste)

2. **Crea un Curso:**
   - Ve a `/professor/courses`
   - Haz clic en "Crear Curso"
   - Completa el formulario:
     - Título: "Introducción a TypeScript"
     - Descripción: "Aprende los fundamentos de TypeScript"
     - Precio: 150.00
     - Créditos: 4
   - Guarda el curso

3. **Agrega Lecciones al Curso:**
   - Haz clic en "Editar" en el curso creado
   - Haz clic en "+ Agregar Lección"
   - Completa:
     - Título: "Introducción a TypeScript"
     - Contenido: "En esta lección aprenderás..."
     - Orden: 1
   - Guarda la lección
   - Repite para más lecciones

4. **Crea una Carrera:**
   - Ve a `/admin/careers` (como admin)
   - O desde la base de datos (ver Opción B)

#### Opción B: Desde la Base de Datos (SQL)

Si prefieres crear datos directamente en la base de datos:

```sql
-- 1. Obtener el ID del profesor (ajusta el email si es diferente)
SELECT id FROM users WHERE email = 'profesor@getdevtools.com';

-- 2. Crear un curso (reemplaza PROFESSOR_ID con el ID obtenido)
INSERT INTO courses (professor_id, title, description, base_price, revenue_share_pct, is_shared_access, credits, rubric, created_at, updated_at)
VALUES (
  PROFESSOR_ID,  -- Reemplaza con el ID del profesor
  'Introducción a TypeScript',
  'Aprende los fundamentos de TypeScript desde cero',
  150.00,
  70,
  false,
  4,
  null,
  NOW(),
  NOW()
);

-- 3. Obtener el ID del curso creado
SELECT id FROM courses WHERE title = 'Introducción a TypeScript';

-- 4. Crear lecciones (reemplaza COURSE_ID con el ID obtenido)
INSERT INTO lessons (course_id, title, content, order_index, video_url, pdf_url, video_filename, pdf_filename, created_at, updated_at)
VALUES 
  (COURSE_ID, 'Introducción a TypeScript', 'En esta lección aprenderás los conceptos básicos...', 1, null, null, null, null, NOW(), NOW()),
  (COURSE_ID, 'Tipos y Interfaces', 'Aprende a definir tipos e interfaces...', 2, null, null, null, null, NOW(), NOW()),
  (COURSE_ID, 'Clases y Herencia', 'Domina la programación orientada a objetos...', 3, null, null, null, null, NOW(), NOW());

-- 5. Crear una carrera
INSERT INTO careers (name, description, total_months, status, created_at, updated_at)
VALUES (
  'Desarrollo de Software',
  'Carrera completa de desarrollo de software con las últimas tecnologías',
  24,
  'active',
  NOW(),
  NOW()
);

-- 6. Obtener IDs de carrera y curso
SELECT id FROM careers WHERE name = 'Desarrollo de Software';
SELECT id FROM courses WHERE title = 'Introducción a TypeScript';

-- 7. Asociar curso a la carrera (reemplaza CAREER_ID y COURSE_ID)
INSERT INTO career_curriculum (career_id, course_id, order_index, created_at, updated_at)
VALUES (
  CAREER_ID,  -- ID de la carrera
  COURSE_ID,  -- ID del curso
  1,
  NOW(),
  NOW()
);
```

### 4. Dar Acceso a un Alumno

Para que un alumno pueda ver un curso:

```sql
-- Obtener IDs
SELECT id FROM users WHERE email = 'alumno@getdevtools.com';  -- ID del alumno
SELECT id FROM courses WHERE title = 'Introducción a TypeScript';  -- ID del curso

-- Crear acceso (reemplaza STUDENT_ID y COURSE_ID)
INSERT INTO course_access (student_id, course_id, access_type, is_active, created_at, updated_at)
VALUES (
  STUDENT_ID,  -- ID del alumno
  COURSE_ID,  -- ID del curso
  'purchased',  -- o 'free', 'company', etc.
  true,
  NOW(),
  NOW()
);
```

## Script Completo de Ejemplo

Aquí tienes un script SQL completo que puedes ejecutar (ajusta los IDs según tus datos):

```sql
-- 1. Crear Profesor (si no existe)
INSERT INTO users (dni, full_name, email, password, role, created_at, updated_at)
SELECT '87654321', 'Profesor Ejemplo', 'profesor@getdevtools.com', '$2b$10$TU_HASH_AQUI', 'profesor', NOW(), NOW()
WHERE NOT EXISTS (SELECT 1 FROM users WHERE email = 'profesor@getdevtools.com');

-- 2. Obtener ID del profesor
DO $$
DECLARE
  v_professor_id INTEGER;
  v_course_id INTEGER;
  v_career_id INTEGER;
BEGIN
  -- Obtener ID del profesor
  SELECT id INTO v_professor_id FROM users WHERE email = 'profesor@getdevtools.com';
  
  -- Crear curso
  INSERT INTO courses (professor_id, title, description, base_price, revenue_share_pct, is_shared_access, credits, created_at, updated_at)
  VALUES (v_professor_id, 'Introducción a TypeScript', 'Aprende los fundamentos de TypeScript', 150.00, 70, false, 4, NOW(), NOW())
  RETURNING id INTO v_course_id;
  
  -- Crear lecciones
  INSERT INTO lessons (course_id, title, content, order_index, created_at, updated_at)
  VALUES 
    (v_course_id, 'Introducción a TypeScript', 'Contenido de la lección 1', 1, NOW(), NOW()),
    (v_course_id, 'Tipos y Interfaces', 'Contenido de la lección 2', 2, NOW(), NOW());
  
  -- Crear carrera
  INSERT INTO careers (name, description, total_months, status, created_at, updated_at)
  VALUES ('Desarrollo de Software', 'Carrera completa de desarrollo', 24, 'active', NOW(), NOW())
  RETURNING id INTO v_career_id;
  
  -- Asociar curso a carrera
  INSERT INTO career_curriculum (career_id, course_id, order_index, created_at, updated_at)
  VALUES (v_career_id, v_course_id, 1, NOW(), NOW());
END $$;
```

## Verificar Datos Creados

```sql
-- Ver usuarios
SELECT id, full_name, email, role FROM users ORDER BY created_at DESC;

-- Ver cursos
SELECT id, title, professor_id FROM courses;

-- Ver lecciones
SELECT id, title, course_id, order_index FROM lessons ORDER BY course_id, order_index;

-- Ver carreras
SELECT id, name, status FROM careers;

-- Ver asociaciones carrera-curso
SELECT cc.id, c.name as career, co.title as course, cc.order_index 
FROM career_curriculum cc
JOIN careers c ON cc.career_id = c.id
JOIN courses co ON cc.course_id = co.id;
```

## Notas Importantes

- **Base de datos:** `postgres` (no `learning_platform`)
- **Tablas:** Se crean automáticamente con `synchronize: true` en TypeORM
- **IDs:** Los IDs se generan automáticamente, pero necesitas obtenerlos para crear relaciones
- **Timestamps:** Usa `NOW()` para `created_at` y `updated_at`

## Próximos Pasos

1. ✅ Crear usuario admin
2. ✅ Crear usuario profesor
3. ✅ Crear cursos y lecciones
4. ✅ Crear carreras
5. ✅ Asociar cursos a carreras
6. ✅ Dar acceso a alumnos (opcional)

