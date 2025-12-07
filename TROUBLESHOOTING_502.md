# Troubleshooting: Error 502 Bad Gateway

## 🔴 Problema: Error 502

El error 502 significa que **nginx puede recibir la petición, pero no puede conectarse a tu aplicación backend**.

## ✅ Soluciones Inmediatas

### 1. Verificar que la App esté Corriendo

En CapRover:
1. Ve a tu app `learninggetdevtools`
2. **Estado debe ser "Running"** (verde)
3. Si está detenida, click en "Start" o revisa los logs

### 2. Revisar los Logs de la App

1. Ve a tu app → **"App Logs"**
2. **Busca estos mensajes de éxito**:
   - ✅ "Application is running on: http://0.0.0.0:3000"
   - ✅ "TypeOrmModule dependencies initialized"
3. **Busca errores**:
   - ❌ "Unable to connect to the database"
   - ❌ "Error: listen EADDRINUSE"
   - ❌ "Module not found"

### 3. Verificar Variables de Entorno

1. Ve a "App Configs" → "Environment Variables"
2. **Asegúrate de que `PORT=3000` esté configurado**
3. Verifica todas las variables de base de datos

### 4. Verificar que la App Escuche en 0.0.0.0

He actualizado el código para que escuche en `0.0.0.0` en lugar de `localhost`. Esto es necesario para Docker/CapRover.

**El cambio ya está en GitHub**. Necesitas:
1. Hacer "Force Build" en CapRover, O
2. Si tienes webhook, el próximo push lo desplegará automáticamente

### 5. Forzar Nueva Construcción

1. Ve a "Deployment"
2. Click en **"Force Build"**
3. Espera a que termine (puede tardar varios minutos)
4. Verifica los logs después del build

## 🔍 Diagnóstico desde SSH

Si tienes acceso SSH al servidor:

```bash
# Ver si el contenedor está corriendo
docker ps | grep learninggetdevtools

# Ver los logs
docker logs srv-captain--learninggetdevtools.1.[ID] --tail 50

# Verificar que escucha en el puerto correcto
docker exec -it srv-captain--learninggetdevtools.1.[ID] netstat -tlnp | grep 3000
```

## 📋 Checklist de Verificación

- [ ] App en estado "Running" en CapRover
- [ ] Logs muestran "Application is running on: http://0.0.0.0:3000"
- [ ] Variable `PORT=3000` configurada
- [ ] No hay errores de conexión a base de datos
- [ ] Último build fue exitoso
- [ ] La app escucha en `0.0.0.0` (no `localhost`)

## 🚀 Solución Rápida

1. **Verifica los logs** en CapRover
2. **Haz "Force Build"** para aplicar el cambio de `0.0.0.0`
3. **Espera a que termine** el build
4. **Verifica los logs** de nuevo
5. **Prueba**: https://learning.getdevtools.com/health

## 💡 Cambio Aplicado

He actualizado `src/main.ts` para que escuche en `0.0.0.0`:

```typescript
await app.listen(port, '0.0.0.0');
```

Esto es **necesario** para que Docker/CapRover pueda conectarse a la app.

El cambio ya está en GitHub. Solo necesitas hacer un nuevo build.

