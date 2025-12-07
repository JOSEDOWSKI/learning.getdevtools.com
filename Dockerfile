# Dockerfile para producción con CapRover
FROM node:20-alpine

WORKDIR /app

# Copiar archivos de dependencias
COPY package*.json ./

# Instalar dependencias de producción
RUN npm ci --only=production

# Copiar código fuente
COPY . .

# Compilar la aplicación
RUN npm run build

# Exponer puerto
EXPOSE 3000

# Variables de entorno por defecto (se pueden sobrescribir en CapRover)
ENV NODE_ENV=production
ENV PORT=3000

# Comando para iniciar la aplicación
CMD ["node", "dist/main"]

