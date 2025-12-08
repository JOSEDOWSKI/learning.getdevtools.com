# Dockerfile para producción con CapRover
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (necesarias para el build)
RUN npm ci

# Copiar código fuente (excluyendo frontend-app)
COPY package*.json ./
COPY tsconfig.json ./
COPY nest-cli.json ./
COPY src/ ./src/
COPY .dockerignore ./

# Compilar la aplicación
RUN npm run build

# Eliminar dependencias de desarrollo después del build
RUN npm prune --production

# Crear directorio para uploads
RUN mkdir -p /app/uploads/videos /app/uploads/pdfs

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto (se pueden sobrescribir en CapRover)
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]

