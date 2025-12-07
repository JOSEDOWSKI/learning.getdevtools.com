# Desplegar Frontend y Backend como Dos Apps Separadas

## ✅ Sí, Puedes Crear Dos Apps Separadas

Puedes crear:
- **App 1**: Backend → `apilearning.getdevtools.com`
- **App 2**: Frontend → `learning.getdevtools.com`

Y puedes desplegarlas con:
- ✅ **Git** (recomendado - automático)
- ✅ **Targz** (archivo comprimido)

## 🚀 Opción 1: Desplegar con Git (Recomendado)

### App Backend (apilearning.getdevtools.com)

1. **Crea nueva app en CapRover**:
   - Nombre: `learning-backend`
   - Tipo: One-Click App → Node.js

2. **Conecta Git**:
   - Repositorio: `JOSEDOWSKI/learning.getdevtools.com`
   - Branch: `main`
   - Dockerfile Path: `Dockerfile`

3. **Configura dominio**:
   - HTTP Settings → Agrega: `apilearning.getdevtools.com`
   - Habilita SSL

4. **Variables de entorno**:
   ```
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

### App Frontend (learning.getdevtools.com)

1. **En tu app actual** (`learninggetdevtools`):
   - Verifica Dockerfile Path: `Dockerfile.frontend`
   - Verifica dominio: `learning.getdevtools.com`
   - Elimina `apilearning.getdevtools.com` de esta app

2. **Variables de entorno**:
   ```
   NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
   PORT=3000
   NODE_ENV=production
   ```

## 📦 Opción 2: Desplegar con Targz

### Preparar Archivos

#### Para Backend:

```bash
# Desde la raíz del proyecto
tar -czf backend.tar.gz \
  --exclude='frontend-app' \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.next' \
  package.json \
  package-lock.json \
  tsconfig.json \
  nest-cli.json \
  Dockerfile \
  src/ \
  .env.example
```

#### Para Frontend:

```bash
# Desde la raíz del proyecto
tar -czf frontend.tar.gz \
  --exclude='node_modules' \
  --exclude='.git' \
  --exclude='.next' \
  frontend-app/ \
  Dockerfile.frontend
```

### Subir a CapRover

1. **En CapRover** → Tu App → "Deployment"
2. **Click en "Upload tar.gz file"**
3. **Sube el archivo** correspondiente:
   - Backend: `backend.tar.gz`
   - Frontend: `frontend.tar.gz`
4. **Configura el Dockerfile Path**:
   - Backend: `Dockerfile`
   - Frontend: `Dockerfile.frontend`
5. **Despliega**

## 📋 Resumen de Configuración

### Backend App:
- **Nombre**: `learning-backend`
- **Dominio**: `apilearning.getdevtools.com`
- **Dockerfile**: `Dockerfile`
- **Variables**: Solo las del backend (DB_*, JWT_*)

### Frontend App:
- **Nombre**: `learning-frontend` (o tu app actual)
- **Dominio**: `learning.getdevtools.com`
- **Dockerfile**: `Dockerfile.frontend`
- **Variables**: Solo las del frontend (NEXT_PUBLIC_API_URL)

## ✅ Ventajas de Dos Apps Separadas

- ✅ Cada app se despliega independientemente
- ✅ Puedes usar diferentes métodos (Git o Targz)
- ✅ Mejor organización y escalabilidad
- ✅ Fácil de mantener

## 🎯 Recomendación

**Usa Git** para ambas apps porque:
- ✅ Despliegue automático con cada push
- ✅ Más fácil de mantener
- ✅ Historial de cambios
- ✅ No necesitas crear archivos targz manualmente

¿Quieres que te guíe paso a paso para crear las dos apps?

