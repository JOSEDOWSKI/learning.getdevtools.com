# Configuración de Google Gemini

## Introducción

La plataforma ahora soporta tanto **OpenAI** como **Google Gemini** para la evaluación automática de proyectos. Por defecto, el sistema usa **Gemini** si está configurado, ya que ofrece mejor rendimiento y avances tecnológicos más rápidos.

## Ventajas de Gemini

- ✅ **Más rápido**: Gemini 2.0 Flash es más rápido que GPT-4o
- ✅ **Mejor precio**: Generalmente más económico que OpenAI
- ✅ **Avances tecnológicos**: Google invierte fuertemente en mejoras continuas
- ✅ **Mejor razonamiento**: Excelente para tareas de evaluación y análisis

## Configuración

### 1. Obtener API Key de Gemini

1. Ve a [Google AI Studio](https://aistudio.google.com/)
2. Inicia sesión con tu cuenta de Google
3. Crea un nuevo proyecto o selecciona uno existente
4. Genera una API Key
5. Copia la API Key

### 2. Configurar Variables de Entorno

Agrega las siguientes variables a tu archivo `.env`:

```env
# Proveedor de IA (opciones: 'gemini' o 'openai')
AI_PROVIDER=gemini

# API Key de Google Gemini
GEMINI_API_KEY=tu-api-key-de-gemini

# API Key de OpenAI (opcional, como respaldo)
OPENAI_API_KEY=tu-api-key-de-openai
```

### 3. Instalar Dependencias

```bash
npm install
```

Esto instalará automáticamente `@google/generative-ai`.

## Lógica de Selección del Proveedor

El sistema selecciona el proveedor de IA en el siguiente orden:

1. **Si `AI_PROVIDER` está configurado**:
   - Usa el proveedor especificado si tiene API key válida
   
2. **Si `AI_PROVIDER` no está configurado**:
   - Prioriza **Gemini** si `GEMINI_API_KEY` está disponible
   - Usa **OpenAI** si solo `OPENAI_API_KEY` está disponible
   - Usa **Mock** (evaluación simulada) si ninguna API key está configurada

## Modelos Disponibles

### Gemini
- **Modelo por defecto**: `gemini-2.0-flash-exp`
- **Alternativas**: `gemini-1.5-pro`, `gemini-1.5-flash`

Para cambiar el modelo, edita `src/modules/submissions/services/gemini.service.ts`:

```typescript
private modelVersion = 'gemini-1.5-pro'; // Cambiar aquí
```

### OpenAI
- **Modelo por defecto**: `gpt-4o`
- **Alternativas**: `gpt-4-turbo`, `gpt-3.5-turbo`

Para cambiar el modelo, edita `src/modules/submissions/services/openai.service.ts`:

```typescript
private modelVersion = 'gpt-4o'; // Cambiar aquí
```

## Verificar Configuración

Puedes verificar qué proveedor está activo revisando los logs cuando se crea una evaluación, o agregando un endpoint de diagnóstico:

```typescript
// En submissions.controller.ts (opcional)
@Get('ai/status')
getAiStatus() {
  return {
    provider: this.aiProvider.getCurrentProvider(),
    geminiConfigured: !!process.env.GEMINI_API_KEY,
    openaiConfigured: !!process.env.OPENAI_API_KEY,
  };
}
```

## Migración desde OpenAI

Si ya estabas usando OpenAI y quieres migrar a Gemini:

1. Obtén tu API Key de Gemini
2. Agrega `GEMINI_API_KEY` a tu `.env`
3. Opcionalmente, establece `AI_PROVIDER=gemini` para forzar el uso de Gemini
4. Reinicia la aplicación

El sistema automáticamente usará Gemini si está disponible.

## Costos

### Gemini
- **Gratis**: 15 solicitudes por minuto
- **Pago**: Consulta [Google AI Studio Pricing](https://aistudio.google.com/pricing)

### OpenAI
- Consulta [OpenAI Pricing](https://openai.com/pricing)

## Troubleshooting

### Error: "No response from Gemini"
- Verifica que tu API Key sea válida
- Revisa que tengas cuota disponible
- Verifica la conexión a internet

### Error: "API key not found"
- Asegúrate de que `GEMINI_API_KEY` esté en tu archivo `.env`
- Reinicia la aplicación después de agregar la variable

### El sistema usa Mock en lugar de Gemini
- Verifica que `GEMINI_API_KEY` esté correctamente configurada
- Revisa los logs para ver errores de autenticación
- Asegúrate de que el paquete `@google/generative-ai` esté instalado

## Ejemplo de Respuesta

Ambos proveedores devuelven el mismo formato:

```json
{
  "score": 17.5,
  "feedback_summary": "Excelente proyecto con código bien estructurado...",
  "rubric_breakdown": {
    "funcionalidad": {
      "score": 90,
      "comments": "Todas las funcionalidades implementadas correctamente"
    },
    "codigo": {
      "score": 85,
      "comments": "Código limpio y bien organizado"
    }
  },
  "model_version": "gemini-2.0-flash-exp",
  "provider": "gemini"
}
```

## Recursos Adicionales

- [Google AI Studio](https://aistudio.google.com/)
- [Documentación de Gemini API](https://ai.google.dev/docs)
- [SDK de Node.js para Gemini](https://www.npmjs.com/package/@google/generative-ai)

