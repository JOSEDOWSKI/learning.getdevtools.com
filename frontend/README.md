# Frontend Local - Plataforma Educativa

## 🚀 Inicio Rápido

Este es un frontend básico para desarrollo local. Solo abre el archivo `index.html` en tu navegador.

### Opción 1: Abrir Directamente

```bash
# Desde la carpeta frontend
cd frontend
# Abre index.html en tu navegador
```

O simplemente:
```bash
# Desde la raíz del proyecto
open frontend/index.html
# O en Linux:
xdg-open frontend/index.html
```

### Opción 2: Servidor Local Simple

```bash
# Con Python
cd frontend
python3 -m http.server 8080
# Luego abre: http://localhost:8080
```

```bash
# Con Node.js (si tienes http-server instalado)
npx http-server frontend -p 8080
# Luego abre: http://localhost:8080
```

## 🔧 Configuración

El frontend se conecta automáticamente a:
- **Local**: `http://localhost:3000` (si estás en localhost)
- **Producción**: `https://learning.getdevtools.com` (si estás en otro dominio)

## 📝 Nota

Este es un frontend **muy básico** solo para verificar que la API funciona.

Para un frontend completo, considera:
- **Next.js** (recomendado)
- **React + Vite**
- **Vue.js**

Ver `FRONTEND_OPTIONS.md` en la raíz del proyecto para más opciones.

