# Crear Tablas en la Base de Datos

## 🔴 Problema: Tabla "users" no existe

El error `relation "users" does not exist` significa que las tablas no se han creado en la base de datos.

## ✅ Solución Aplicada

He habilitado `synchronize: true` en la configuración de TypeORM. Esto hará que TypeORM cree automáticamente todas las tablas cuando el backend se inicie.

## 🚀 Próximos Pasos

1. **Espera a que el backend se despliegue** (o haz "Force Build")
2. **Cuando el backend inicie**, TypeORM creará automáticamente todas las tablas
3. **Verifica en los logs** que no haya errores de creación de tablas

## ⚠️ Importante

Después de que las tablas se creen, puedes:
- **Opción 1**: Dejar `synchronize: true` (fácil, pero menos seguro en producción)
- **Opción 2**: Cambiar a `synchronize: false` y usar migraciones (más seguro)

## 🔍 Verificación

Después del despliegue:

1. **Intenta hacer login** de nuevo
2. **Si funciona**, las tablas se crearon correctamente
3. **Si aún falla**, revisa los logs para ver si hay errores al crear las tablas

## 📋 Tablas que se Crearán

TypeORM creará automáticamente:
- `users`
- `wallets`
- `careers`
- `courses`
- `submissions`
- `certificates`
- Y todas las demás tablas definidas en las entidades

¡El backend creará las tablas automáticamente en el próximo despliegue!

