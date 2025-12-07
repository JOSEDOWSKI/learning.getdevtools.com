# Configuración de GitHub Actions para CapRover

## Secrets Necesarios en GitHub

Ve a tu repositorio en GitHub: **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Necesitas crear los siguientes **3 secrets**:

### 1. `CAPROVER_SERVER`
- **Valor**: La URL de tu servidor CapRover
- **Ejemplo**: `https://captain.yourdomain.com` o `https://your-ip:3000`
- **Cómo obtenerlo**: Es la URL donde accedes al panel de CapRover

### 2. `CAPROVER_APP_NAME`
- **Valor**: El nombre de tu aplicación en CapRover
- **Ejemplo**: `learning-platform`
- **Cómo obtenerlo**: Es el nombre que diste a tu app cuando la creaste en CapRover

### 3. `CAPROVER_APP_TOKEN`
- **Valor**: El token de despliegue de tu aplicación
- **Cómo obtenerlo**:
  1. Ve a tu app en CapRover
  2. Click en "App Configs"
  3. Busca la sección "Deployment" → "Method 1: Deploy from GitHub/Bitbucket/GitLab"
  4. Copia el "App Token" que aparece ahí

## Configuración Paso a Paso

### Paso 1: Obtener el Token de CapRover

1. Accede a tu panel de CapRover
2. Ve a tu aplicación (o créala si no existe)
3. Click en "App Configs"
4. En la sección "Deployment", busca "Method 1: Deploy from GitHub/Bitbucket/GitLab"
5. Verás algo como:
   ```
   App Token: abc123def456ghi789...
   ```
6. Copia ese token completo

### Paso 2: Configurar Secrets en GitHub

1. Ve a tu repositorio en GitHub: https://github.com/JOSEDOWSKI/learning.getdevtools.com
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Secrets and variables** → **Actions**
4. Click en **New repository secret**

#### Secret 1: CAPROVER_SERVER
- **Name**: `CAPROVER_SERVER`
- **Secret**: `https://captain.tu-dominio.com` (o la URL de tu CapRover)
- Click **Add secret**

#### Secret 2: CAPROVER_APP_NAME
- **Name**: `CAPROVER_APP_NAME`
- **Secret**: `learning-platform` (o el nombre que quieras darle)
- Click **Add secret**

#### Secret 3: CAPROVER_APP_TOKEN
- **Name**: `CAPROVER_APP_TOKEN`
- **Secret**: El token que copiaste del paso 1
- Click **Add secret**

### Paso 3: Verificar el Workflow

El archivo `.github/workflows/deploy-caprover.yml` ya está creado y configurado para:
- Desplegar automáticamente cuando hagas `git push` a la rama `main` o `master`
- También puedes ejecutarlo manualmente desde la pestaña "Actions" en GitHub

## Cómo Funciona

1. **Push a main/master**: Cuando hagas `git push origin main`, GitHub Actions se ejecutará automáticamente
2. **Deploy automático**: El workflow desplegará tu código a CapRover
3. **Build en CapRover**: CapRover construirá la imagen Docker y la desplegará

## Verificar el Despliegue

1. Ve a la pestaña **Actions** en tu repositorio de GitHub
2. Verás el workflow ejecutándose
3. Si hay errores, los verás en los logs
4. En CapRover, verás que la app se está actualizando

## Troubleshooting

### Error: "Invalid server URL"
- Verifica que `CAPROVER_SERVER` tenga el formato correcto: `https://captain.tu-dominio.com`
- Asegúrate de que no termine con `/`

### Error: "App not found"
- Verifica que `CAPROVER_APP_NAME` coincida exactamente con el nombre de tu app en CapRover
- El nombre es case-sensitive

### Error: "Invalid token"
- Verifica que copiaste el token completo
- El token puede cambiar si lo regeneras en CapRover
- Asegúrate de que no haya espacios extra

### El workflow no se ejecuta
- Verifica que el archivo `.github/workflows/deploy-caprover.yml` esté en el repositorio
- Verifica que estés haciendo push a la rama `main` o `master`
- Ve a **Actions** en GitHub para ver si hay algún error

## Variables Opcionales (No Secrets)

Si quieres usar variables en lugar de secrets para datos no sensibles, puedes crear **Variables** en lugar de **Secrets**:

1. Ve a **Settings** → **Secrets and variables** → **Actions**
2. Click en la pestaña **Variables**
3. Click en **New repository variable**

**Nota**: Para CapRover, todos los datos son sensibles, así que usa **Secrets**, no Variables.

## Seguridad

- ✅ Los secrets están encriptados
- ✅ Solo colaboradores del repositorio pueden usarlos
- ✅ No se pasan a workflows de pull requests desde forks
- ✅ Nunca se muestran en los logs

## Próximos Pasos

1. Configura los 3 secrets en GitHub
2. Haz push de tu código:
   ```bash
   git add .
   git commit -m "Configurar GitHub Actions"
   git push origin main
   ```
3. Ve a la pestaña **Actions** en GitHub para ver el despliegue
4. Verifica en CapRover que la app se actualice

