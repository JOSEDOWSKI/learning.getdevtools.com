# Configuración de Registro Público

## Variables de Entorno

### `ALLOW_PUBLIC_REGISTER` (Backend)

Controla si el registro público está habilitado o no.

**Valores:**
- `true` (default): Permite registro público desde la landing page
- `false`: Bloquea el registro público, solo admins pueden crear usuarios

**Ejemplo de uso en CapRover:**

```env
ALLOW_PUBLIC_REGISTER=true   # Para fase beta - permite registro público
ALLOW_PUBLIC_REGISTER=false  # Para cerrar registros - solo admins pueden crear usuarios
```

**Cuándo usar `false`:**
- Cuando detectas abuso (bots, spam)
- Cuando quieres control total sobre quién se registra
- Durante mantenimiento o migraciones
- Cuando alcanzas límite de usuarios en beta

**Cuándo usar `true`:**
- Durante fase beta para probar límites
- Cuando quieres crecimiento orgánico
- Desarrollo y testing

### `INVITE_CODE_PROFESOR` (Backend - Opcional)

Código de invitación requerido para registrarse como profesor.

**Ejemplo:**

```env
INVITE_CODE_PROFESOR=PROF2024XYZ
```

**Comportamiento:**
- Si **NO** está configurado: Cualquiera puede registrarse como profesor sin código
- Si **SÍ** está configurado: Solo usuarios con el código correcto pueden registrarse como profesor

**Uso recomendado:**
- Configurar un código durante la fase beta para controlar quién puede ser profesor
- Cambiar el código periódicamente si se filtra
- Usar códigos diferentes por campaña o evento

## Flujos de Registro

### 1. Registro como Alumno

**Desde la landing page:**
- Usuario hace clic en "Crear cuenta alumno"
- Va a `/register?role=alumno`
- Completa el formulario
- Se crea automáticamente como `alumno`

**No requiere código de invitación**

### 2. Registro como Profesor

**Desde la landing page:**
- Usuario hace clic en "Quiero ser profesor"
- Va a `/register?role=profesor`
- Completa el formulario + código de invitación (si está configurado)
- Se crea como `profesor`

**Requiere código si `INVITE_CODE_PROFESOR` está configurado**

### 3. Creación por Admin

**Solo super_admin puede crear usuarios desde el panel:**
- Endpoint: `POST /users` (requiere JWT de super_admin)
- Puede crear usuarios con cualquier rol (excepto super_admin)
- Útil para crear profesores sin código de invitación

## Seguridad

### Protecciones Implementadas

1. **Super Admin bloqueado:** No se puede crear `super_admin` vía registro público
2. **Roles permitidos:** Solo `alumno` y `profesor` en registro público
3. **Código de invitación:** Opcional para profesores
4. **Flag de control:** `ALLOW_PUBLIC_REGISTER` para cerrar registros cuando sea necesario

### Recomendaciones

1. **Durante Beta:**
   ```env
   ALLOW_PUBLIC_REGISTER=true
   INVITE_CODE_PROFESOR=TU_CODIGO_BETA
   ```

2. **Si detectas abuso:**
   ```env
   ALLOW_PUBLIC_REGISTER=false
   ```
   Solo admins pueden crear usuarios

3. **Producción estable:**
   ```env
   ALLOW_PUBLIC_REGISTER=true
   INVITE_CODE_PROFESOR=CODIGO_SEGURO_CAMBIADO_PERIODICAMENTE
   ```

## Ejemplos de Configuración

### Configuración Beta (Actual)
```env
ALLOW_PUBLIC_REGISTER=true
INVITE_CODE_PROFESOR=BETA2024
```

### Configuración Cerrada (Solo Admins)
```env
ALLOW_PUBLIC_REGISTER=false
```

### Configuración Abierta (Sin código para profesores)
```env
ALLOW_PUBLIC_REGISTER=true
# INVITE_CODE_PROFESOR no configurado = sin código requerido
```

## Próximos Pasos

Para implementar el sistema de códigos de invitación por curso y referidos que mencionaste, necesitaríamos:

1. **Tabla `referral_codes`** para códigos de curso/profesor
2. **Tabla `referrals`** para tracking de referidos
3. **Endpoints** para generar códigos y ver estadísticas
4. **Dashboard** para profesores con estadísticas de referidos

¿Quieres que implemente esto ahora o prefieres probar primero el sistema actual?

