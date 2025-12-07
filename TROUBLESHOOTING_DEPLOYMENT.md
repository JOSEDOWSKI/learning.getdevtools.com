# Troubleshooting: App no Responde en https://learning.getdevtools.com/

## Verificaciones Paso a Paso

### 1. Verificar que la App está Desplegada en CapRover

1. **Accede a CapRover**: https://captain.panel.getdevtools.com
2. **Ve a "Apps"** en el menú lateral
3. **Busca tu app**: `learninggetdevtools` (o el nombre que le diste)
4. **Verifica el estado**: Debe estar en estado "Running" (Verde)

### 2. Verificar el Dominio

1. **Ve a tu app en CapRover**
2. **Click en "HTTP Settings"**
3. **Verifica que el dominio esté configurado**:
   - Debe aparecer `learning.getdevtools.com`
   - Debe tener SSL habilitado (Let's Encrypt)

Si no está configurado:
- Click en "Enable HTTPS"
- Agrega el dominio: `learning.getdevtools.com`
- CapRover configurará SSL automáticamente

### 3. Verificar los Logs de la App

1. **Ve a tu app en CapRover**
2. **Click en "App Logs"**
3. **Busca errores**, especialmente:
   - ❌ "Unable to connect to the database"
   - ❌ "Error: listen EADDRINUSE"
   - ❌ "Module not found"
   - ✅ "Application is running on: http://0.0.0.0:3000"

### 4. Verificar Variables de Entorno

1. **Ve a tu app → "App Configs" → "Environment Variables"**
2. **Verifica que todas las variables estén configuradas**:
   ```env
   DB_HOST=srv-captain--postgresqllearning
   DB_PORT=5432
   DB_USERNAME=postgres
   DB_PASSWORD=151022qaz
   DB_DATABASE=learning_platform
   JWT_SECRET=4+8zM/GiX+T6r7azuYrblIBcBMI/k4eduOjTMqxjVg8=
   JWT_EXPIRES_IN=7d
   PORT=3000
   NODE_ENV=production
   ```

### 5. Verificar que la Base de Datos Existe

```bash
docker exec -it 2e94893583fd psql -U postgres -c "\l" | grep learning_platform
```

Si no existe, créala:
```bash
docker exec -it 2e94893583fd psql -U postgres -c "CREATE DATABASE learning_platform;"
```

### 6. Forzar una Nueva Construcción

1. **Ve a tu app en CapRover**
2. **Click en "Deployment"**
3. **Click en "Force Build"** (Forzar construcción)
4. **Espera a que termine** (puede tardar varios minutos)

### 7. Verificar el Webhook (si lo configuraste)

1. **Ve a GitHub**: https://github.com/JOSEDOWSKI/learning.getdevtools.com/settings/hooks
2. **Verifica que el webhook esté activo** (punto verde)
3. **Revisa "Recent Deliveries"** para ver si hay errores

## Problemas Comunes y Soluciones

### Problema: "Your app will be here!"

**Causa**: La app no se ha desplegado o no está corriendo.

**Solución**:
1. Verifica que la app esté en estado "Running" en CapRover
2. Revisa los logs para ver errores
3. Verifica que el dominio esté configurado correctamente

### Problema: Error de Conexión a Base de Datos

**Solución**:
1. Verifica que la base de datos `learning_platform` exista
2. Verifica las variables de entorno (especialmente `DB_HOST` y `DB_PASSWORD`)
3. Verifica que PostgreSQL esté corriendo

### Problema: Error en el Build

**Solución**:
1. Ve a "App Logs" y busca errores de compilación
2. Verifica que el Dockerfile esté correcto
3. Intenta hacer "Force Build"

### Problema: Puerto en Uso

**Solución**:
- CapRover maneja los puertos automáticamente
- Asegúrate de que `PORT=3000` esté en las variables de entorno
- No necesitas configurar el puerto manualmente

## Comandos Útiles para Verificar

### Ver el estado de la app desde SSH:

```bash
docker ps | grep learning
```

### Ver los logs desde SSH:

```bash
docker logs srv-captain--learninggetdevtools.1.[ID] --tail 50
```

### Verificar que el contenedor está corriendo:

```bash
docker ps | grep learninggetdevtools
```

## Checklist de Verificación

- [ ] App está en estado "Running" en CapRover
- [ ] Dominio `learning.getdevtools.com` está configurado
- [ ] SSL está habilitado
- [ ] Variables de entorno están configuradas
- [ ] Base de datos `learning_platform` existe
- [ ] No hay errores en los logs
- [ ] El build se completó exitosamente
- [ ] El webhook está configurado (si lo usas)

## Próximos Pasos

1. **Revisa los logs** de la app en CapRover
2. **Verifica el dominio** en HTTP Settings
3. **Forza un nuevo build** si es necesario
4. **Comparte los errores** que veas en los logs para ayudarte mejor

