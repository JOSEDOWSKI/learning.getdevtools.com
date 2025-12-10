# 🔴 Solución Completa: Error 502 en Producción

## 📋 Situación Actual

Tienes **dos apps separadas** en CapRover:

1. **`learninggetdevtools`** - Frontend (Next.js)
   - Variables configuradas: ✅
   - Estado: Inactivo (502)

2. **`learning-backend`** - Backend (NestJS)
   - Variables configuradas: ✅ (DB_HOST=10.0.1.7)
   - Problema: Intenta conectarse a `localhost` en lugar de `10.0.1.7`

## 🔍 Problema 1: Backend no lee DB_HOST

### Síntoma
Los logs muestran:
```
Error: connect ECONNREFUSED 127.0.0.1:5432
Error: connect ECONNREFUSED ::1:5432
```

Esto significa que está intentando conectarse a `localhost` aunque `DB_HOST=10.0.1.7` está configurado.

### Solución

**Opción A: Usar el nombre del servicio (Recomendado)**

En CapRover, en la app `learning-backend`, cambia:
```env
DB_HOST=10.0.1.7
```

Por:
```env
DB_HOST=srv-captain--postgresqllearning
```

**¿Por qué?** El nombre del servicio es más confiable que la IP, ya que la IP puede cambiar si el contenedor se reinicia.

**Opción B: Verificar que la variable se esté leyendo**

1. Después de hacer push de los cambios (con el logging que agregué)
2. Revisa los logs del backend
3. Deberías ver:
   ```
   🚀 Starting application...
   📋 Environment Variables:
     DB_HOST: 10.0.1.7
     ...
   ```
4. Si ves `DB_HOST: NOT SET`, la variable no se está pasando correctamente

### Pasos para el Backend

1. **Verifica las variables en CapRover**:
   - Ve a `learning-backend` → "App Configs" → "Environment Variables"
   - Asegúrate de que `DB_HOST` esté configurado
   - **Recomendación**: Cambia a `srv-captain--postgresqllearning`

2. **Haz push de los cambios** (el logging que agregué):
   ```bash
   git add src/main.ts src/config/database.config.ts
   git commit -m "Agregar logging para diagnóstico de DB_HOST"
   git push origin backend
   ```

3. **Espera el despliegue automático** (o fuerza un build)

4. **Revisa los logs**:
   - Deberías ver los valores de las variables de entorno
   - Si `DB_HOST` aparece como "NOT SET", la variable no se está pasando

## 🔍 Problema 2: Frontend Inactivo (502)

### Síntoma
- App `learninggetdevtools` en estado "inactivo"
- Error 502 al acceder a `https://learning.getdevtools.com`

### Solución

1. **Verifica el Build**:
   - Ve a `learninggetdevtools` → "Deployment"
   - Revisa si el último build fue exitoso
   - Si falló, haz "Force Build"

2. **Verifica las Variables**:
   - Ve a "App Configs" → "Environment Variables"
   - Asegúrate de tener:
     ```env
     NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
     NODE_ENV=production
     PORT=3000
     ```

3. **Verifica los Logs**:
   - Ve a "App Logs"
   - Busca errores como:
     - "Cannot find module 'server.js'"
     - "Module not found"
     - "ENOENT: no such file or directory"

4. **Si el build fue exitoso pero sigue inactivo**:
   - Fuerza un nuevo build
   - Espera a que termine
   - La app debería iniciar automáticamente

## 📋 Checklist Completo

### Backend (`learning-backend`):
- [ ] Variable `DB_HOST` configurada (preferiblemente `srv-captain--postgresqllearning`)
- [ ] Variable `DB_PORT=5432` configurada
- [ ] Variable `DB_USERNAME=postgres` configurada
- [ ] Variable `DB_PASSWORD=151022qaz` configurada
- [ ] Variable `DB_DATABASE=learning_platform` configurada
- [ ] Variable `PORT=3000` configurada
- [ ] Variable `NODE_ENV=production` configurada
- [ ] App en estado "Running"
- [ ] Logs muestran "Application is running on: http://0.0.0.0:3000"
- [ ] Logs muestran "TypeOrmModule dependencies initialized" (sin errores)

### Frontend (`learninggetdevtools`):
- [ ] Variable `NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com` configurada
- [ ] Variable `NODE_ENV=production` configurada
- [ ] Variable `PORT=3000` configurada
- [ ] Último build exitoso
- [ ] App en estado "Running"
- [ ] Logs muestran "Ready on http://0.0.0.0:3000"

## 🚀 Pasos Recomendados (En Orden)

### Para el Backend:

1. **Cambia `DB_HOST` a `srv-captain--postgresqllearning`** en CapRover
2. **Haz push de los cambios** (logging):
   ```bash
   git add src/main.ts src/config/database.config.ts
   git commit -m "Agregar logging para diagnóstico DB_HOST"
   git push origin backend
   ```
3. **Espera el despliegue automático**
4. **Revisa los logs** para verificar que `DB_HOST` se lea correctamente
5. **Verifica** que la app esté "Running" y sin errores de conexión

### Para el Frontend:

1. **Verifica las variables** en CapRover
2. **Fuerza un nuevo build** si es necesario
3. **Espera a que termine** el build
4. **Verifica** que la app esté "Running"
5. **Prueba** `https://learning.getdevtools.com`

## ⚠️ Nota Importante sobre DB_HOST

**Recomendación**: Usa `srv-captain--postgresqllearning` en lugar de `10.0.1.7` porque:
- El nombre del servicio es más estable (no cambia si el contenedor se reinicia)
- Es la forma recomendada en CapRover/Docker
- Funciona mejor con la red interna de Docker

Si `10.0.1.7` es la IP correcta y funciona, puedes mantenerla, pero verifica que la variable se esté leyendo correctamente con los logs que agregué.

## 🔗 Verificación Final

Después de aplicar los cambios:

### Backend:
```bash
curl https://apilearning.getdevtools.com/health
```
Debería responder: `{"status":"ok",...}`

### Frontend:
```bash
curl https://learning.getdevtools.com
```
Debería responder con HTML (no 502)

