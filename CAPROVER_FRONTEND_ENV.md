# Variables de Entorno para Frontend en CapRover

## 📋 Variables Completas para CapRover

Copia y pega estas variables en CapRover → Tu App Frontend → App Configs → Environment Variables

```env
NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
PORT=3000
NODE_ENV=production
```

## 🔍 Explicación de Cada Variable

### `NEXT_PUBLIC_API_URL`
- **Valor**: `https://apilearning.getdevtools.com`
- **Descripción**: URL base de la API backend
- **Importante**: Debe empezar con `NEXT_PUBLIC_` para que Next.js la exponga al cliente

### `PORT`
- **Valor**: `3000`
- **Descripción**: Puerto en el que correrá la aplicación Next.js
- **Nota**: CapRover maneja el routing automáticamente, pero Next.js necesita saber en qué puerto escuchar

### `NODE_ENV`
- **Valor**: `production`
- **Descripción**: Indica que la aplicación está en modo producción
- **Efecto**: Next.js optimiza el build y desactiva características de desarrollo

## ✅ Lista para Copiar y Pegar

```env
NEXT_PUBLIC_API_URL=https://apilearning.getdevtools.com
PORT=3000
NODE_ENV=production
```

## 📝 Pasos en CapRover

1. Ve a tu app del frontend en CapRover
2. Click en **"App Configs"**
3. Click en **"Environment Variables"**
4. Agrega cada variable una por una, O
5. Si CapRover permite pegar múltiples líneas, pega todo el bloque de arriba
6. Click en **"Save & Update"** (o "Guardar y Reiniciar")
7. Espera a que la app se reinicie

## 🔍 Verificación

Después de configurar las variables:

1. **Verifica los logs** de la app
2. **Busca**: "Application is running on: http://0.0.0.0:3000"
3. **Prueba el frontend**: Abre `https://learning.getdevtools.com`
4. **Deberías ver**: La página de login (no la API)

## ⚠️ Notas Importantes

- **No agregues espacios** antes o después del `=` en las variables
- **No uses comillas** alrededor de los valores
- **Asegúrate** de que `NEXT_PUBLIC_API_URL` apunte al backend correcto
- **Verifica** que el backend esté funcionando en `https://apilearning.getdevtools.com` antes de desplegar el frontend

## 🆘 Si Algo No Funciona

1. **Verifica los logs** de la app en CapRover
2. **Confirma** que todas las variables estén configuradas correctamente
3. **Verifica** que el backend responda en `https://apilearning.getdevtools.com/health`
4. **Revisa** que el dominio `learning.getdevtools.com` esté configurado en HTTP Settings

