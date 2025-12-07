​🇵🇪 Proyecto: Plataforma Educativa Nacional - Dirección Digital
​1. Visión del Proyecto
​Crear una plataforma de alto rendimiento que condense una carrera universitaria de 5 años en 24 meses intensivos. Basada en un modelo de Certificaciones Apilables, donde cada curso mensual otorga un certificado, y la suma de todos desbloquea un Título a Nombre de la Nación.
​Pilares Clave:
​Inmersión Total: 1 curso al mes (Bootcamp Style).
​IA-Grading: Calificación automatizada mediante LLMs.
​Identity First: Validación biométrica vinculada a DNI.
​Teacher Marketplace: Modelo de Revenue Share para atraer a los mejores profesionales.
​2. Stack Tecnológico Sugerido
​Backend: Node.js (TypeScript) con NestJS o Python con FastAPI.
​Base de Datos: PostgreSQL (Relacional, para integridad transaccional).
​IA Engine: OpenAI API (GPT-4o) o Anthropic Claude 3.5 Sonnet.
​Cache/Queue: Redis (Para procesar las evaluaciones de IA en segundo plano).
​Pagos: Integración con Pasarelas locales (Niubiz/Izipay) para soporte de Yape y Plin.
​3. Arquitectura de Datos (DBML Summary)
​El diseño de la base de datos soporta:
​Acceso Corporativo: Compra de "seats" (vacantes) por empresas para cursos específicos (ej. Inglés).
​Finanzas: Billeteras virtuales para profesores con cálculo de comisión de plataforma automática.
​Certificación: Verificación lógica de 24 meses aprobados antes de emitir el título nacional.
​4. Flujo de Calificación por IA (Backend Logic)
​Submission: El alumno sube el entregable (project_url).
​Job Queue: Se crea un job en Redis para evitar timeouts.
​Prompt Construction: El backend une: Rúbrica del curso + Contenido del alumno + Instrucciones de Senior PM.
​AI Request: Se envía a la IA y se recibe un JSON estructurado.
​Result: Se guarda en ai_evaluations y se notifica al alumno.
​5. Roadmap de Implementación (MVP)
​Fase 1: Core & Auth (Semanas 1-4)
​Implementar tabla users y autenticación.
​Sistema de roles (Alumno, Admin, Profesor).
​Integración básica con API de validación de identidad.
​Fase 2: Módulo Académico y Pagos (Semanas 5-8)
​CRUD de courses y career_curriculum.
​Integración de pasarela de pagos y tabla transactions.
​Lógica de course_access (Paywall).
​Fase 3: Motor de IA y Certificación (Semanas 9-12)
​Integración con OpenAI para calificación de proyectos.
​Generación de PDFs de certificados con hash digital único.
​Panel de Admin para aprobación de Títulos Nacionales.
​6. Endpoints Críticos (Preview)
​POST /auth/register (Validación DNI)
​POST /payments/checkout (Generación de QR Yape/Plin)
​POST /submissions (Subida de proyecto y trigger de IA)
​GET /admin/payouts (Control de saldos de profesores)
​Nota para el desarrollador: Revisa el archivo schema.dbml adjunto para entender las relaciones de llaves foráneas antes de ejecutar las migraciones iniciales.