# Configuración del Webhook de CapRover en GitHub

## URL del Webhook

```
https://captain.panel.getdevtools.com/api/v2/user/apps/webhooks/triggerbuild?namespace=captain&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkPXVCJ9.eyJkYXRhIjp7InRva2VuVmVyc2lvbiI6ImM3M2ZiOTEyLWRkNDUtNGViZC04NThlLTkzNjdhZjBlM2Q2MSIsImFwcE5hbWUiOiJsZWFybmluZ2dldGRldnRvb2xzIiwibmFtZXNwYWNlIjoiY2FwdGFpbiJ9LCJpYXQiOjE3NjUxNDE2NzZ9.JGxsvEcjvqwIA3vcl7XwNxlOqdtV_ahjb9upf502qOM
```

## Pasos para Configurar el Webhook en GitHub

### 1. Acceder a la Configuración del Repositorio

1. Ve a: https://github.com/JOSEDOWSKI/learning.getdevtools.com
2. Click en **Settings** (Configuración)
3. En el menú lateral, click en **Webhooks**
4. Click en **Add webhook** (Agregar webhook)

### 2. Configurar el Webhook

**Payload URL:**
```
https://captain.panel.getdevtools.com/api/v2/user/apps/webhooks/triggerbuild?namespace=captain&token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkPXVCJ9.eyJkYXRhIjp7InRva2VuVmVyc2lvbiI6ImM3M2ZiOTEyLWRkNDUtNGViZC04NThlLTkzNjdhZjBlM2Q2MSIsImFwcE5hbWUiOiJsZWFybmluZ2dldGRldnRvb2xzIiwibmFtZXNwYWNlIjoiY2FwdGFpbiJ9LCJpYXQiOjE3NjUxNDE2NzZ9.JGxsvEcjvqwIA3vcl7XwNxlOqdtV_ahjb9upf502qOM
```

**Content type:**
- Selecciona: `application/json`

**Which events would you like to trigger this webhook?**
- Selecciona: **Just the push event** (Solo el evento push)
  - O **Let me select individual events** y marca solo "Pushes"

**Active:**
- ✅ Marca la casilla (debe estar activo)

### 3. Guardar

Click en **Add webhook** (Agregar webhook)

## Cómo Funciona

1. **Haces un commit y push** a GitHub
2. **GitHub envía el webhook** a CapRover
3. **CapRover detecta el cambio** y inicia automáticamente una nueva construcción
4. **La aplicación se despliega** automáticamente

## Verificar que Funciona

### En GitHub:
1. Ve a **Settings** → **Webhooks**
2. Deberías ver tu webhook listado
3. Puedes hacer click en él para ver los "Recent Deliveries" (entregas recientes)
4. Después de un push, deberías ver una entrega exitosa (verde)

### En CapRover:
1. Ve a tu aplicación
2. En la sección "Deployment", verás el historial de construcciones
3. Después de un push, verás que se inicia automáticamente una nueva construcción

## Probar el Webhook

1. Haz un pequeño cambio en el código:
   ```bash
   echo "# Test" >> README.md
   git add README.md
   git commit -m "Test webhook"
   git push origin main
   ```

2. Verifica en CapRover que se inicie automáticamente una nueva construcción

## Troubleshooting

### El webhook no se dispara
- Verifica que la URL esté correcta (copia completa)
- Verifica que el webhook esté activo en GitHub
- Revisa los "Recent Deliveries" en GitHub para ver si hay errores

### Error 404 en el webhook
- Verifica que la URL del webhook sea correcta
- Asegúrate de que el token no haya expirado

### Error 401/403
- El token puede haber expirado
- Genera un nuevo token en CapRover y actualiza el webhook

## Nota de Seguridad

⚠️ **IMPORTANTE**: El token en la URL es sensible. No lo compartas públicamente. Si el token se compromete, puedes regenerarlo en CapRover.

## Alternativa: GitHub Actions

Si prefieres usar GitHub Actions en lugar del webhook (más control y visibilidad), puedes usar el workflow que ya está configurado en `.github/workflows/deploy-caprover.yml`. Solo necesitas configurar los secrets mencionados en `GITHUB_ACTIONS_SETUP.md`.

