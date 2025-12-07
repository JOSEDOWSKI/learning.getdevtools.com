# Troubleshooting: Error 500 en Login

## 🔴 Problema: Error 500

Un error 500 significa que hay un problema en el servidor. Las causas más comunes son:

## ✅ Soluciones

### 1. Verificar Logs del Backend

**En CapRover**:
1. Ve a tu app `learning-backend`
2. Click en **"App Logs"**
3. **Busca errores** relacionados con:
   - Conexión a base de datos
   - JWT_SECRET no configurado
   - Usuario no encontrado
   - Error en bcrypt

### 2. Verificar Variables de Entorno

Asegúrate de que estas variables estén configuradas en CapRover:

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

**⚠️ IMPORTANTE**: `JWT_SECRET` debe estar configurado, si no, el login fallará.

### 3. Verificar Conexión a Base de Datos

El error puede ser que la base de datos no esté accesible. Verifica:

1. **En CapRover** → App `postgresqllearning` → Debe estar "Running"
2. **Verifica las variables** `DB_HOST`, `DB_PORT`, etc.
3. **Prueba la conexión** desde los logs del backend

### 4. Verificar que el Usuario Exista

Si el usuario no existe en la base de datos, puede causar un error 500. 

**Solución**: Crea un usuario primero desde el registro.

### 5. Verificar JWT Configuration

El `JWT_SECRET` debe estar configurado en `auth.module.ts`. Verifica que esté correcto.

## 🔍 Diagnóstico Rápido

### Desde la Consola del Navegador:

1. Abre `https://learning.getdevtools.com`
2. Abre la consola (F12)
3. Intenta hacer login
4. Ve a la pestaña **Network**
5. Click en la petición `/auth/login`
6. Ve a **Response** para ver el error específico

### Desde los Logs de CapRover:

Los logs mostrarán el error exacto. Busca líneas que digan:
- `Error validating user:`
- `Error in login:`
- `Login error:`

## 📋 Checklist

- [ ] Variables de entorno configuradas correctamente
- [ ] `JWT_SECRET` está configurado
- [ ] Base de datos está accesible
- [ ] Usuario existe en la base de datos
- [ ] Logs del backend revisados
- [ ] Error específico identificado

## 🆘 Si el Error Persiste

Comparte:
1. **El error exacto** de los logs de CapRover
2. **La respuesta** de la petición en Network (consola del navegador)
3. **Las variables de entorno** que tienes configuradas

