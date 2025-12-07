# Checklist de Despliegue - Verificación Rápida

## ✅ Verificaciones en CapRover

### 1. Estado de la App
- [ ] Ve a CapRover → Apps → Tu app (`learninggetdevtools`)
- [ ] Estado debe ser **"Running"** (verde)
- [ ] Si está en "Stopped" o con error, revisa los logs

### 2. Dominio Configurado
- [ ] Ve a tu app → **"HTTP Settings"**
- [ ] Verifica que `learning.getdevtools.com` esté en la lista
- [ ] SSL debe estar habilitado (Let's Encrypt)
- [ ] Si no está, agrega el dominio y habilita HTTPS

### 3. Variables de Entorno
- [ ] Ve a tu app → **"App Configs"** → **"Environment Variables"**
- [ ] Verifica que todas estas variables estén configuradas:

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

### 4. Base de Datos
- [ ] Verifica que la base de datos existe:
  ```bash
  docker exec -it 2e94893583fd psql -U postgres -c "\l" | grep learning_platform
  ```
- [ ] Si no existe, créala:
  ```bash
  docker exec -it 2e94893583fd psql -U postgres -c "CREATE DATABASE learning_platform;"
  ```

### 5. Logs de la App
- [ ] Ve a tu app → **"App Logs"**
- [ ] Busca estos mensajes de éxito:
  - ✅ "TypeOrmModule dependencies initialized"
  - ✅ "Application is running on: http://0.0.0.0:3000"
- [ ] Si ves errores, anótalos y busca la solución en `TROUBLESHOOTING_DEPLOYMENT.md`

### 6. Último Build
- [ ] Ve a tu app → **"Deployment"**
- [ ] Verifica que el último build haya sido exitoso
- [ ] Si hay errores, click en **"Force Build"**

## 🔧 Acciones si No Funciona

### Si la app no está corriendo:
1. Revisa los logs
2. Verifica las variables de entorno
3. Intenta "Force Build"

### Si el dominio no responde:
1. Verifica que el dominio esté en "HTTP Settings"
2. Verifica que SSL esté habilitado
3. Espera unos minutos para que el DNS se propague

### Si hay errores de base de datos:
1. Verifica que la base de datos exista
2. Verifica las variables `DB_HOST`, `DB_PASSWORD`, `DB_DATABASE`
3. Verifica que PostgreSQL esté corriendo

## 🚀 Después de Verificar Todo

1. **Haz un pequeño cambio** y haz push:
   ```bash
   echo "# Test" >> README.md
   git add README.md
   git commit -m "Test deployment"
   git push origin main
   ```

2. **Espera a que el webhook/GitHub Actions despliegue**

3. **Verifica en**: https://learning.getdevtools.com/health
   - Debería responder: `{"status":"ok","timestamp":"..."}`

## 📞 Si Aún No Funciona

Comparte:
1. El estado de la app en CapRover
2. Los últimos 20-30 líneas de los logs
3. Si el dominio está configurado
4. Si las variables de entorno están configuradas

