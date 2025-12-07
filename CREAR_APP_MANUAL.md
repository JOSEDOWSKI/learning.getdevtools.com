# Crear App Manualmente en CapRover

## 🚀 Crear App Backend (apilearning.getdevtools.com)

### Paso 1: Crear App Vacía

1. **En CapRover**, ve a "Apps"
2. **Click en "One-Click Apps/Databases"**
3. **Busca "Empty"** o "Blank App" o simplemente:
4. **Click en el botón "+"** o "New App" (arriba a la derecha)
5. **Escribe el nombre**: `learning-backend`
6. **Click en "Create New App"**

### Paso 2: Configurar Deployment

1. **Ve a tu nueva app** `learning-backend`
2. **Click en "Deployment"**
3. **Selecciona "Deploy from GitHub"** (o "Deploy from Git")
4. **Configura**:
   - Repository: `JOSEDOWSKI/learning.getdevtools.com`
   - Branch: `main`
   - **Dockerfile Path**: `Dockerfile` ⚠️ IMPORTANTE
5. **Click en "Save & Update"**

### Paso 3: Configurar Dominio

1. **Ve a "HTTP Settings"**
2. **En "Domain"**, escribe: `apilearning.getdevtools.com`
3. **Click en "Save"**
4. **Habilita SSL** (Let's Encrypt)

### Paso 4: Variables de Entorno

1. **Ve a "App Configs"**
2. **Click en "Environment Variables"**
3. **Agrega estas variables**:

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

4. **Click en "Save & Update"**

### Paso 5: Desplegar

1. **Ve a "Deployment"**
2. **Click en "Force Build"** (si no se despliega automáticamente)
3. **Espera a que termine**

## 🎨 Configurar App Frontend (learning.getdevtools.com)

### En tu App Actual:

1. **Ve a "Deployment"**
2. **Verifica que "Dockerfile Path" sea**: `Dockerfile.frontend`
3. **Si no, cámbialo y guarda**

4. **Ve a "HTTP Settings"**
5. **Verifica que el dominio sea**: `learning.getdevtools.com`
6. **Elimina** `apilearning.getdevtools.com` si está ahí

7. **Ve a "App Configs" → "Environment Variables"**
8. **Deja solo estas variables**:

```env
NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
PORT=3000
NODE_ENV=production
```

9. **Elimina** las variables del backend (DB_*, JWT_*)

10. **Click en "Save & Update"**

## 📋 Resumen

### Backend App (`learning-backend`):
- Dockerfile: `Dockerfile`
- Dominio: `apilearning.getdevtools.com`
- Variables: Solo backend

### Frontend App (tu app actual):
- Dockerfile: `Dockerfile.frontend`
- Dominio: `learning.getdevtools.com`
- Variables: Solo frontend

## ✅ Verificación

Después de configurar:

1. **Backend**: `https://apilearning.getdevtools.com/health`
   - Debe responder: `{"status":"ok"}`

2. **Frontend**: `https://learning.getdevtools.com`
   - Debe mostrar la página de login

## 🆘 Si No Encuentras "New App"

Busca:
- Botón **"+"** en la esquina superior derecha
- **"Create New App"**
- **"Add New App"**
- O simplemente crea una app desde "One-Click Apps" → "Empty" o "Blank"

