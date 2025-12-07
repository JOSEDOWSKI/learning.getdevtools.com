# Solución: Frontend y Backend en la Misma App

## 🔴 Problema Actual

Tienes frontend y backend en la misma app de CapRover, pero CapRover solo puede servir **una aplicación** por app. Actualmente está configurado para servir el **frontend** (`Dockerfile.frontend`).

## ✅ Soluciones

### Opción 1: Dos Apps Separadas (Recomendado) ⭐

Crea **dos apps separadas** en CapRover:

#### App 1: Backend (`apilearning.getdevtools.com`)
- **Nombre**: `learning-backend` o `learning-api`
- **Dockerfile**: `./Dockerfile` (el del backend)
- **Dominio**: `apilearning.getdevtools.com`
- **Variables**:
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

#### App 2: Frontend (`learning.getdevtools.com`)
- **Nombre**: `learning-frontend` o `learning-web`
- **Dockerfile**: `./Dockerfile.frontend`
- **Dominio**: `learning.getdevtools.com`
- **Variables**:
  ```
  NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
  PORT=3000
  NODE_ENV=production
  ```

### Opción 2: Usar Nginx como Proxy Reverso

Crear un Dockerfile que sirva ambos usando Nginx, pero esto es más complejo.

## 🚀 Pasos para Opción 1 (Recomendado)

### 1. Crear App del Backend

1. En CapRover, crea una **nueva app**:
   - Nombre: `learning-backend`
   - Tipo: One-Click App → Node.js

2. Conecta el repositorio:
   - Repositorio: `JOSEDOWSKI/learning.getdevtools.com`
   - Branch: `main`
   - Dockerfile Path: `Dockerfile` (no `Dockerfile.frontend`)

3. Configura el dominio:
   - HTTP Settings → Agrega: `apilearning.getdevtools.com`
   - Habilita SSL

4. Variables de entorno (solo del backend):
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

### 2. Configurar App del Frontend (la actual)

1. En tu app actual (`learninggetdevtools`):
   - Verifica que el Dockerfile Path sea: `Dockerfile.frontend`
   - Verifica que el dominio sea: `learning.getdevtools.com`
   - Variables de entorno (solo del frontend):
     ```
     NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
     PORT=3000
     NODE_ENV=production
     ```

## 📋 Resumen

- **Backend**: App separada → `apilearning.getdevtools.com` → `Dockerfile`
- **Frontend**: App actual → `learning.getdevtools.com` → `Dockerfile.frontend`

## ⚠️ Importante

No puedes tener ambos en la misma app. Necesitas **dos apps separadas** en CapRover.

