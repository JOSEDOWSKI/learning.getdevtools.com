# Template de Variables de Entorno para CapRover

Copia y pega estas variables en CapRover → Tu App → App Configs → Environment Variables

## 🔐 Variables de Base de Datos

```env
DB_HOST=srv-captain--postgresqllearning
DB_PORT=5432
DB_USERNAME=postgres
DB_PASSWORD=151022qaz
DB_DATABASE=learning_platform
```

**✅ Configurado con tus datos específicos**

## 🔑 Variables de JWT

```env
JWT_SECRET=REEMPLAZA_CON_UN_SECRET_LARGO_Y_SEGURO
JWT_EXPIRES_IN=7d
```

**Para generar un JWT_SECRET seguro**, ejecuta en tu terminal:
```bash
openssl rand -base64 32
```

## 🖥️ Variables del Servidor

```env
PORT=3000
NODE_ENV=production
```

## 🤖 Variables de IA (Opcional - Elige una)

### Opción 1: Gemini (Recomendado)
```env
AI_PROVIDER=gemini
GEMINI_API_KEY=tu-api-key-de-gemini
```

### Opción 2: OpenAI
```env
AI_PROVIDER=openai
OPENAI_API_KEY=tu-api-key-de-openai
```

### Opción 3: Sin IA (usará evaluación mock)
```env
# No agregues ninguna variable de IA
```

## 📋 Checklist de Configuración

- [ ] PostgreSQL instalado en CapRover
- [ ] Base de datos `learning_platform` creada
- [ ] Variables de base de datos configuradas
- [ ] JWT_SECRET generado y configurado
- [ ] Variables del servidor configuradas
- [ ] Variables de IA configuradas (opcional)
- [ ] App reiniciada después de configurar variables
- [ ] Logs verificados (sin errores de conexión)

## 🔍 Cómo Verificar que Funciona

1. **Verifica los logs**:
   - Ve a tu app → "App Logs"
   - Busca: "TypeOrmModule dependencies initialized"
   - Busca: "Application is running on: http://0.0.0.0:3000"

2. **Prueba el endpoint de health**:
   ```bash
   curl https://tu-app.caprover.tu-dominio.com/health
   ```
   Debería responder: `{"status":"ok","timestamp":"..."}`

3. **Verifica las tablas en PostgreSQL**:
   ```bash
   docker exec -it srv-captain--postgres psql -U postgres -d learning_platform -c "\dt"
   ```
   Deberías ver 16 tablas listadas

