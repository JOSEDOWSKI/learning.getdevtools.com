# Frontend - Plataforma Educativa Nacional

Frontend moderno construido con Next.js 14, TypeScript y Tailwind CSS.

## 🚀 Inicio Rápido

### Instalación

```bash
cd frontend-app
npm install
```

### Desarrollo Local

```bash
npm run dev
```

Abre [http://localhost:3000](http://localhost:3000) en tu navegador.

### Configuración

Crea un archivo `.env.local` (ya está creado con valores por defecto):

```env
NEXT_PUBLIC_API_URL=https://learning.getdevtools.com
```

Para desarrollo local, cambia a:
```env
NEXT_PUBLIC_API_URL=http://localhost:3000
```

## 📁 Estructura del Proyecto

```
frontend-app/
├── app/                    # Páginas y rutas (App Router)
│   ├── login/             # Página de login
│   ├── register/          # Página de registro
│   ├── dashboard/         # Dashboard principal
│   ├── courses/           # Lista y detalle de cursos
│   ├── careers/           # Lista de carreras
│   ├── submissions/       # Mis entregas
│   └── certificates/      # Mis certificados
├── components/             # Componentes reutilizables
│   └── Layout.tsx         # Layout principal con navegación
├── lib/                    # Utilidades y servicios
│   ├── api.ts             # Cliente API
│   └── auth.tsx           # Contexto de autenticación
└── middleware.ts          # Protección de rutas
```

## 🎨 Características

- ✅ **Autenticación completa**: Login y registro
- ✅ **Dashboard**: Vista general con estadísticas
- ✅ **Cursos**: Lista y detalle de cursos
- ✅ **Carreras**: Vista de carreras completas
- ✅ **Entregas**: Sistema de submissions con evaluación
- ✅ **Certificados**: Visualización y verificación
- ✅ **Diseño moderno**: Tailwind CSS
- ✅ **Responsive**: Funciona en móvil y desktop
- ✅ **TypeScript**: Tipado completo

## 🔗 Integración con Backend

El frontend se conecta automáticamente a la API backend configurada en `NEXT_PUBLIC_API_URL`.

### Endpoints Utilizados

- `/auth/login` - Inicio de sesión
- `/auth/register` - Registro
- `/auth/profile` - Perfil del usuario
- `/courses` - Lista de cursos
- `/courses/:id` - Detalle de curso
- `/courses/careers` - Lista de carreras
- `/submissions` - Entregas del usuario
- `/certificates` - Certificados del usuario

## 🛠️ Scripts Disponibles

- `npm run dev` - Servidor de desarrollo
- `npm run build` - Compilar para producción
- `npm run start` - Servidor de producción
- `npm run lint` - Ejecutar linter

## 📦 Despliegue

### Opción 1: Vercel (Recomendado para Next.js)

1. Conecta tu repositorio a Vercel
2. Configura la variable de entorno `NEXT_PUBLIC_API_URL`
3. Despliega automáticamente

### Opción 2: CapRover

1. Crea una nueva app en CapRover
2. Configura el Dockerfile (Next.js)
3. Agrega las variables de entorno
4. Conecta el repositorio

## 🎯 Próximas Mejoras

- [ ] Página de detalle de carrera
- [ ] Sistema de búsqueda y filtros
- [ ] Notificaciones en tiempo real
- [ ] Perfil de usuario editable
- [ ] Panel de administración
- [ ] Modo oscuro

## 📝 Notas

- El frontend está completamente funcional y listo para usar
- Todas las páginas están protegidas (requieren autenticación)
- El diseño es responsive y moderno
- Integración completa con la API backend
