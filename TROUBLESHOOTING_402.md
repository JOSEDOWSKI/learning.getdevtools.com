# Troubleshooting: Error 402 de Nginx en CapRover

## 🔴 Problema: Error 402

El error 402 generalmente indica un problema de configuración del dominio o routing en CapRover.

## ✅ Soluciones

### 1. Verificar Configuración del Dominio en CapRover

1. **Accede a CapRover**: https://captain.panel.getdevtools.com
2. **Ve a tu app**: `learninggetdevtools`
3. **Click en "HTTP Settings"**
4. **Verifica**:
   - ✅ El dominio `learning.getdevtools.com` debe estar en la lista
   - ✅ Debe tener un check verde (activo)
   - ✅ SSL debe estar habilitado

### 2. Si el Dominio NO está Configurado

1. **En "HTTP Settings"**, agrega el dominio:
   - Click en el campo de dominio
   - Escribe: `learning.getdevtools.com`
   - Click en "Save & Update"

2. **Habilita SSL**:
   - Debe aparecer una opción para habilitar SSL
   - Click en "Enable HTTPS" o similar
   - CapRover configurará Let's Encrypt automáticamente

### 3. Verificar que la App esté Corriendo

1. **Ve a tu app en CapRover**
2. **Verifica el estado**: Debe estar "Running" (verde)
3. **Revisa los logs**: Ve a "App Logs" y busca errores

### 4. Verificar el Puerto

1. **Ve a "App Configs" → "Environment Variables"**
2. **Verifica que `PORT=3000` esté configurado**
3. **CapRover maneja el routing automáticamente**, no necesitas configurar el puerto manualmente

### 5. Forzar Reconstrucción

1. **Ve a "Deployment"**
2. **Click en "Force Build"**
3. **Espera a que termine**

### 6. Verificar DNS

Asegúrate de que el DNS esté apuntando correctamente:

```bash
# Verifica el DNS
nslookup learning.getdevtools.com
# O
dig learning.getdevtools.com
```

Debe apuntar a la IP de tu servidor CapRover.

## 🔧 Comandos Útiles para Diagnosticar

### Verificar que el contenedor está corriendo:

```bash
docker ps | grep learninggetdevtools
```

### Ver los logs del contenedor:

```bash
docker logs srv-captain--learninggetdevtools.1.[ID] --tail 50
```

### Verificar el puerto interno:

```bash
docker port srv-captain--learninggetdevtools.1.[ID]
```

## 📋 Checklist Rápido

- [ ] Dominio configurado en "HTTP Settings"
- [ ] SSL habilitado
- [ ] App en estado "Running"
- [ ] Variable `PORT=3000` configurada
- [ ] No hay errores en los logs
- [ ] DNS apuntando correctamente

## 🚨 Si Nada Funciona

1. **Elimina y vuelve a agregar el dominio**:
   - En "HTTP Settings", elimina `learning.getdevtools.com`
   - Guarda
   - Vuelve a agregarlo
   - Habilita SSL de nuevo

2. **Reinicia la app**:
   - Click en "Restart App" o similar

3. **Verifica en CapRover Dashboard**:
   - Ve a "Apps" → Verifica que todas las apps estén corriendo
   - Verifica que no haya conflictos de puertos

## 💡 Alternativa Temporal

Mientras solucionas el problema, puedes acceder directamente al puerto:

```bash
# Desde tu servidor
curl http://localhost:3000/health
```

O si tienes acceso SSH, puedes hacer un túnel:
```bash
ssh -L 3000:localhost:3000 usuario@tu-servidor
```

Luego accede a: `http://localhost:3000/health`

