# Dockerfile para producción con CapRover
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar todas las dependencias (necesarias para el build)
RUN npm ci

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Eliminar dependencias de desarrollo después del build
RUN npm prune --production

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto (se pueden sobrescribir en CapRover)
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]

