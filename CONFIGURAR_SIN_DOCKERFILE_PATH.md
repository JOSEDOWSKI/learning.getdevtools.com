# Configurar Apps sin Dockerfile Path en CapRover

## 🔧 Solución: Usar captain-definition

CapRover usa el archivo `captain-definition` para saber qué Dockerfile usar.

## 📋 Pasos

### App Backend (apilearning.getdevtools.com)

1. **Crea la app** `learning-backend` en CapRover

2. **Conecta el repositorio**:
   - Repository: `JOSEDOWSKI/learning.getdevtools.com`
   - Branch: `main`

3. **Antes de desplegar**, necesitas que el archivo `captain-definition` apunte al backend:
   - **Opción A**: Renombra temporalmente los archivos:
     ```bash
     # En tu repositorio local
     mv captain-definition captain-definition-frontend-temp
     mv captain-definition-backend captain-definition
     git add captain-definition
     git commit -m "Configurar captain-definition para backend"
     git push origin main
     ```
   - **Opción B**: Usa un branch diferente para el backend

4. **Despliega** la app backend

5. **Después**, vuelve a cambiar para el frontend:
   ```bash
   mv captain-definition captain-definition-backend-temp
   mv captain-definition-frontend-temp captain-definition
   git add captain-definition
   git commit -m "Configurar captain-definition para frontend"
   git push origin main
   ```

### App Frontend (learning.getdevtools.com)

1. **En tu app actual**, asegúrate de que `captain-definition` apunte a `Dockerfile.frontend`
2. **Si no**, cambia el archivo y haz push

## 🎯 Mejor Solución: Usar Branches Diferentes

### Branch `main` (Frontend):
- `captain-definition` → `Dockerfile.frontend`
- App: `learning-frontend`

### Branch `backend` (Backend):
- `captain-definition` → `Dockerfile`
- App: `learning-backend`

**Pasos**:

1. **Crea branch para backend**:
   ```bash
   git checkout -b backend
   mv captain-definition captain-definition-frontend
   mv captain-definition-backend captain-definition
   git add captain-definition captain-definition-frontend
   git commit -m "Configurar captain-definition para backend"
   git push origin backend
   ```

2. **En CapRover**:
   - App Backend → Deployment → Branch: `backend`
   - App Frontend → Deployment → Branch: `main`

## ✅ Solución Rápida: Dos captain-definition

He creado:
- `captain-definition-backend` → Para el backend
- `captain-definition-frontend` → Para el frontend

**Para usar**:

1. **Backend**: Renombra `captain-definition-backend` a `captain-definition` y haz push
2. **Frontend**: Renombra `captain-definition-frontend` a `captain-definition` y haz push

## 🚀 Recomendación Final

**Usa branches diferentes**:
- `main` → Frontend
- `backend` → Backend

Así cada app puede usar su propio `captain-definition` sin conflictos.

