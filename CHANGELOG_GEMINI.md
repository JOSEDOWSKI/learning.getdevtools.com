# Integración de Google Gemini

## Resumen

Se ha agregado soporte completo para **Google Gemini** como proveedor de IA alternativo a OpenAI. El sistema ahora puede usar cualquiera de los dos proveedores, con Gemini como opción predeterminada.

## Cambios Realizados

### 1. Nuevas Dependencias
- `@google/generative-ai`: `^0.21.0` - SDK oficial de Google para Gemini

### 2. Nueva Arquitectura

#### Interfaz de Proveedor de IA
- `src/modules/submissions/interfaces/ai-provider.interface.ts`
  - Define la interfaz común para todos los proveedores de IA
  - Incluye el campo `provider` para identificar qué servicio se usó

#### Servicio de Gemini
- `src/modules/submissions/services/gemini.service.ts`
  - Implementación completa del servicio de Gemini
  - Modelo por defecto: `gemini-1.5-flash`
  - Soporte para respuesta JSON estructurada

#### Factory Pattern
- `src/modules/submissions/services/ai-provider.factory.ts`
  - Selecciona automáticamente el proveedor según configuración
  - Prioridad: Gemini > OpenAI > Mock
  - Permite forzar un proveedor específico con `AI_PROVIDER`

### 3. Actualizaciones

#### Servicio de OpenAI
- Actualizado para implementar la nueva interfaz
- Agregado campo `provider: 'openai'` en respuestas

#### Servicio de Submissions
- Refactorizado para usar `AiProviderFactory` en lugar de `OpenAIService` directamente
- Ahora es agnóstico del proveedor de IA

#### Módulo de Submissions
- Registra ambos servicios (OpenAI y Gemini)
- Registra el factory que los coordina

## Configuración

### Variables de Entorno

```env
# Proveedor preferido (opcional)
AI_PROVIDER=gemini  # o 'openai'

# API Keys
GEMINI_API_KEY=tu-api-key-de-gemini
OPENAI_API_KEY=tu-api-key-de-openai  # Opcional
```

### Lógica de Selección

1. Si `AI_PROVIDER` está configurado → usa ese proveedor (si tiene API key)
2. Si no está configurado:
   - Prioriza Gemini si `GEMINI_API_KEY` existe
   - Usa OpenAI si solo `OPENAI_API_KEY` existe
   - Usa Mock si ninguna API key está disponible

## Ventajas de Gemini

- ✅ **Más rápido**: Gemini 1.5 Flash es más rápido que GPT-4o
- ✅ **Mejor precio**: Generalmente más económico
- ✅ **Avances tecnológicos**: Google invierte fuertemente en mejoras
- ✅ **Mejor razonamiento**: Excelente para evaluación y análisis

## Modelos Disponibles

### Gemini
- `gemini-1.5-flash` (por defecto) - Rápido y eficiente
- `gemini-1.5-pro` - Más potente, mejor razonamiento
- `gemini-2.0-flash-exp` - Experimental, última tecnología

### OpenAI
- `gpt-4o` (por defecto)
- `gpt-4-turbo`
- `gpt-3.5-turbo`

## Migración

No se requieren cambios en el código existente. Solo configura las variables de entorno:

1. Obtén tu API Key de Gemini en [Google AI Studio](https://aistudio.google.com/)
2. Agrega `GEMINI_API_KEY` a tu `.env`
3. Opcionalmente, establece `AI_PROVIDER=gemini`
4. Reinicia la aplicación

## Compatibilidad

- ✅ Código existente compatible
- ✅ Mismo formato de respuesta para ambos proveedores
- ✅ Fallback automático si un proveedor falla
- ✅ Evaluación mock si no hay API keys configuradas

## Documentación

Ver [GEMINI_SETUP.md](./GEMINI_SETUP.md) para instrucciones detalladas de configuración.

