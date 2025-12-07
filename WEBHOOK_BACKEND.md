# Configurar Webhook del Backend en GitHub

## ✅ Sí, se crea exactamente igual

El webhook del backend se configura **exactamente igual** que el del frontend.

## 📋 Pasos en GitHub

1. **Ve a**: https://github.com/JOSEDOWSKI/learning.getdevtools.com/settings/hooks

2. **Click en "Add webhook"** (o "Agregar webhook")

3. **Configura el webhook**:
   - **Payload URL**: 
     ```
     https://captain.panel.getdevtools.com/api/v2/user/apps/webhooks/triggerbuild?namespace=captain&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJkYXRhIjp7InRva2VuVmVyc2lvbiI6ImE2ZGJiNzMwLTdlZmUtNDQ1MC04N2M5LWVjNGRlYzI5Y2ExMiIsImFwcE5hbWUiOiJsZWFybmluZy1iYWNrZW5kIiwibmFtZXNwYWNlIjoiY2FwdGFpbiJ9LCJpYXQiOjE3NjUxNDcxNjN9.1hhrMGxZRX92EjNW4xRh-7BqZO8pxUfI4Upbkq2TJ6w
     ```
   - **Content type**: `application/json`
   - **Which events**: Selecciona **"Just the push event"** (o "Solo el evento push")
   - **Active**: ✅ Marcado

4. **Click en "Add webhook"**

## 🔍 Verificación

Después de crear el webhook:

1. **Haz un push a `backend`**:
   ```bash
   git checkout backend
   git commit --allow-empty -m "Test webhook"
   git push origin backend
   ```

2. **Ve a GitHub** → Settings → Hooks → Click en tu webhook
3. **Revisa "Recent Deliveries"**
4. **Deberías ver** una entrega exitosa (código 200)

## 📝 Nota

**Ya tienes GitHub Actions configurado** (`.github/workflows/deploy-backend.yml`) que también activa el webhook automáticamente cuando haces push a `backend`.

Tienes **dos opciones**:
- ✅ **Opción 1**: Webhook en GitHub (se activa con push)
- ✅ **Opción 2**: GitHub Actions (ya configurado, también activa el webhook)

Puedes usar cualquiera de las dos, o ambas. Ambas funcionan igual.

## ✅ Resumen

- **Frontend**: Webhook para branch `main`
- **Backend**: Webhook para branch `backend` (mismo proceso)

¡Es exactamente igual! 🎉

