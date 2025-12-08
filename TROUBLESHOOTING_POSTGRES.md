# Troubleshooting: Encontrar el Nombre del Contenedor de PostgreSQL

## Problema: "No such container"

Si obtienes el error "No such container", necesitas encontrar el nombre correcto del contenedor.

## Solución: Encontrar el Contenedor Correcto

### Opción 1: Listar todos los contenedores de PostgreSQL

```bash
docker ps | grep postgres
```

O listar todos los contenedores:

```bash
docker ps -a | grep postgres
```

### Opción 2: Buscar por el patrón de CapRover

Los contenedores de CapRover generalmente siguen el patrón `srv-captain--[nombre-app]`:

```bash
docker ps | grep captain
```

### Opción 3: Buscar por imagen de PostgreSQL

```bash
docker ps --filter "ancestor=postgres" --format "{{.Names}}"
```

O:

```bash
docker ps --filter "ancestor=postgres"
```

## Una vez que encuentres el nombre correcto

Reemplaza `srv-captain--postgresqllearning` con el nombre real que encuentres.

Por ejemplo, si el nombre es `srv-captain--postgres`, usa:

```bash
docker exec -it srv-captain--postgres psql -U postgres -c "CREATE DATABASE learning_platform;"
```

## Alternativa: Usar el ID del contenedor

Si encuentras el contenedor pero con otro nombre, puedes usar su ID:

```bash
# Primero encuentra el ID
docker ps | grep postgres

# Luego usa el ID (primeras letras/números)
docker exec -it [ID_DEL_CONTENEDOR] psql -U postgres -c "CREATE DATABASE learning_platform;"
```

## Verificar desde CapRover

1. Ve a tu app de PostgreSQL en CapRover
2. Click en "App Logs" o "Terminal"
3. El nombre del contenedor debería aparecer en la información

## Comando Completo para Crear la Base de Datos

Una vez que tengas el nombre correcto:

```bash
docker exec -it [NOMBRE_CORRECTO] psql -U postgres -c "CREATE DATABASE learning_platform;"
```

## Verificar que se creó

```bash
docker exec -it [NOMBRE_CORRECTO] psql -U postgres -c "\l" | grep learning_platform
```

