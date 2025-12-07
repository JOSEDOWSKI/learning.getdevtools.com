# ✅ Configuración Completa - Frontend y Backend Separados

## 🎯 Configuración Final

### App Frontend (learning.getdevtools.com)
- **Branch**: `main`
- **Dockerfile**: `Dockerfile.frontend`
- **Dominio**: `learning.getdevtools.com`
- **Webhook**: Ya configurado (se activa con push a `main`)

### App Backend (apilearning.getdevtools.com)
- **Branch**: `backend`
- **Dockerfile**: `Dockerfile`
- **Dominio**: `apilearning.getdevtools.com`
- **Webhook**: Configurado en GitHub Actions (se activa con push a `backend`)

## 📋 Variables de Entorno

### Frontend App:
```env
NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
PORT=3000
NODE_ENV=production
```

### Backend App:
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

## 🚀 Despliegue Automático

### Frontend:
- Push a `main` → Se despliega automáticamente

### Backend:
- Push a `backend` → GitHub Actions activa el webhook → Se despliega automáticamente

## ✅ Todo Configurado

- ✅ Branch `backend` creado
- ✅ `captain-definition` configurado para backend
- ✅ `captain-definition` configurado para frontend en `main`
- ✅ GitHub Actions configurado para backend
- ✅ Webhook configurado

## 🔍 Verificación

### Backend:
```bash
curl https://apilearning.getdevtools.com/health
```
Debería responder: `{"status":"ok","timestamp":"..."}`

### Frontend:
Abre: `https://learning.getdevtools.com`
Deberías ver la página de login

## 📝 Próximos Pasos

1. **Configura la app backend en CapRover**:
   - Nombre: `learning-backend`
   - Branch: `backend`
   - Dominio: `apilearning.getdevtools.com`
   - Variables: Solo las del backend

2. **Verifica la app frontend**:
   - Branch: `main`
   - Dominio: `learning.getdevtools.com`
   - Variables: Solo las del frontend

3. **Haz un push a `backend`** para desplegar el backend:
   ```bash
   git checkout backend
   # Haz cualquier cambio pequeño
   git commit --allow-empty -m "Trigger backend deployment"
   git push origin backend
   ```

¡Todo está listo! 🎉

