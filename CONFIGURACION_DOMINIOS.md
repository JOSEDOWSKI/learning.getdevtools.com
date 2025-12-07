# Configuración de Dominios - Frontend y Backend

## 🎯 Configuración Correcta

- **Frontend**: `https://learning.getdevtools.com` (raíz)
- **Backend API**: `https://apilearning.getdevtools.com` (subdominio)

## 📋 Pasos para Configurar

### 1. Mover el Backend a `apilearning.getdevtools.com`

En CapRover:

1. **Ve a tu app del backend** (`learninggetdevtools`)
2. **Ve a "HTTP Settings"**
3. **Elimina** `learning.getdevtools.com` del dominio
4. **Agrega** `apilearning.getdevtools.com`
5. **Habilita SSL** para el nuevo dominio
6. **Guarda los cambios**

### 2. Desplegar el Frontend en `learning.getdevtools.com`

#### Opción A: CapRover (Mismo servidor)

1. **Crea una nueva app en CapRover**:
   - Nombre: `learning-frontend` (o `learning-web`)
   - Tipo: One-Click App → Node.js

2. **Conecta el repositorio**:
   - Repositorio: `JOSEDOWSKI/learning.getdevtools.com`
   - Branch: `main`
   - Dockerfile Path: `frontend-app/Dockerfile`

3. **Configura el dominio**:
   - En "HTTP Settings", agrega: `learning.getdevtools.com`
   - Habilita SSL

4. **Variables de Entorno**:
   ```
   NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
   PORT=3000
   NODE_ENV=production
   ```

5. **Despliega**

#### Opción B: Vercel (Recomendado)

1. **Ve a**: https://vercel.com
2. **Conecta tu repositorio**: `JOSEDOWSKI/learning.getdevtools.com`
3. **Configura**:
   - Root Directory: `frontend-app`
   - Framework: Next.js
4. **Variables de Entorno**:
   - `NEXT_PUBLIC_API_URL` = `https://apilearning.getdevtools.com`
5. **Dominio Personalizado**:
   - Agrega `learning.getdevtools.com` en Settings → Domains
   - Configura el DNS según las instrucciones de Vercel
6. **Despliega**

### 3. Actualizar Variables de Entorno del Frontend

El frontend necesita apuntar al nuevo dominio de la API:

```env
NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
```

## 🔄 Resumen de Cambios

### Antes:
- Backend: `https://learning.getdevtools.com` ❌
- Frontend: No desplegado

### Después:
- Frontend: `https://learning.getdevtools.com` ✅
- Backend: `https://apilearning.getdevtools.com` ✅

## 📝 Checklist

- [ ] Mover backend a `apilearning.getdevtools.com` en CapRover
- [ ] Verificar que el backend funciona en `https://apilearning.getdevtools.com/health`
- [ ] Desplegar frontend en CapRover o Vercel
- [ ] Configurar dominio `learning.getdevtools.com` para el frontend
- [ ] Configurar variable `NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com`
- [ ] Verificar que el frontend funciona en `https://learning.getdevtools.com`
- [ ] Probar login/registro desde el frontend

## 🧪 Verificación

### Backend:
```bash
curl https://apilearning.getdevtools.com/health
```
Debería responder: `{"status":"ok","timestamp":"..."}`

### Frontend:
Abre en el navegador: `https://learning.getdevtools.com`
Deberías ver la página de login (no la API)

## ⚠️ Nota Importante

Después de mover el backend, cualquier aplicación o servicio que use la API debe actualizar la URL a `https://apilearning.getdevtools.com`.

