# Guía: Sistema de Créditos para Carrera con 24 Cursos

## 📊 Distribución Recomendada de Créditos

Para una carrera completa con **24 cursos**, te recomiendo la siguiente distribución:

### Opción 1: Distribución Estándar (Total: 96 créditos)

**Cursos Básicos/Introductorios (8 cursos) - 3 créditos cada uno:**
- Fundamentos de programación
- Introducción a bases de datos
- Matemáticas básicas
- Comunicación
- Etc.
- **Subtotal: 24 créditos**

**Cursos Intermedios (10 cursos) - 4 créditos cada uno:**
- Programación avanzada
- Arquitectura de software
- Diseño de interfaces
- Etc.
- **Subtotal: 40 créditos**

**Cursos Avanzados/Proyectos (6 cursos) - 5 créditos cada uno:**
- Proyecto final
- Especialización avanzada
- Trabajo de investigación
- Etc.
- **Subtotal: 30 créditos**

**Total: 96 créditos** (promedio de 4 créditos por curso)

### Opción 2: Distribución Equilibrada (Total: 72 créditos)

Si prefieres una carga más ligera, puedes usar **3 créditos por curso**:
- **24 cursos × 3 créditos = 72 créditos totales**

### Opción 3: Distribución Variable (Total: 84-108 créditos)

**Cursos Básicos:** 2-3 créditos
**Cursos Intermedios:** 3-4 créditos  
**Cursos Avanzados:** 4-6 créditos

## 🎯 Recomendación Específica

Para una **carrera profesional completa**, te recomiendo:

### Estructura Sugerida:

1. **Fundamentos (6 cursos) - 3 créditos c/u = 18 créditos**
   - Introducción a la programación
   - Fundamentos de desarrollo web
   - Bases de datos básicas
   - Git y control de versiones
   - HTML/CSS/JavaScript básico
   - Lógica de programación

2. **Desarrollo (10 cursos) - 4 créditos c/u = 40 créditos**
   - Frontend avanzado (React/Vue)
   - Backend con Node.js/Python
   - APIs REST y GraphQL
   - Bases de datos avanzadas
   - Testing y QA
   - DevOps básico
   - Seguridad web
   - Arquitectura de software
   - Patrones de diseño
   - Desarrollo móvil

3. **Especialización (6 cursos) - 5 créditos c/u = 30 créditos**
   - Proyecto Full Stack
   - Microservicios
   - Cloud Computing
   - Machine Learning aplicado
   - Proyecto de integración
   - Trabajo de grado/Portfolio

4. **Electivos (2 cursos) - 4 créditos c/u = 8 créditos**
   - Temas especializados según interés

**Total: 96 créditos**

## 💡 Valores Típicos por Tipo de Curso

| Tipo de Curso | Créditos Recomendados | Razón |
|---------------|----------------------|-------|
| **Introductorio** | 2-3 | Contenido básico, menos horas |
| **Intermedio** | 3-4 | Contenido moderado, práctica regular |
| **Avanzado** | 4-5 | Contenido complejo, más práctica |
| **Proyecto/Práctica** | 5-6 | Trabajo práctico extenso |
| **Trabajo Final** | 6 | Proyecto integral de carrera |

## 📝 Al Crear Cursos

Cuando crees cada curso en `/professor/courses`, usa estos valores:

- **Cursos básicos:** 3 créditos
- **Cursos intermedios:** 4 créditos
- **Cursos avanzados:** 5 créditos
- **Proyectos finales:** 6 créditos

## ✅ Ejemplo Práctico

Si estás creando un curso de "React Avanzado":
- **Título:** React Avanzado
- **Descripción:** Curso sobre hooks avanzados, context API, y optimización
- **Créditos:** 4 (es un curso intermedio-avanzado)
- **Precio:** S/ 150 (o el precio que consideres)

## 📋 Checklist para Crear la Carrera

1. ✅ Planifica los 24 cursos y su orden
2. ✅ Asigna créditos según la complejidad (3-5 créditos)
3. ✅ Crea los cursos desde `/professor/courses`
4. ✅ Crea la carrera desde el panel de admin (si existe)
5. ✅ Asocia los cursos a la carrera en el orden correcto

## 🎓 Nota Final

Los créditos son principalmente informativos para el estudiante. El sistema los muestra pero no los valida automáticamente. Lo importante es mantener consistencia en la asignación.

