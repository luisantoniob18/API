# Usa una imagen ligera de Node.js 18 para el entorno de construcción
FROM node:18-alpine AS build-stage

# Establece el directorio de trabajo
WORKDIR /app

# Copia y instala las dependencias
COPY package*.json ./
RUN npm install

# Copia el resto de los archivos y genera la aplicación
COPY . .
RUN npm run generate

# Usa una imagen ligera para la etapa de producción
FROM node:18-alpine AS production-stage

# Establece el directorio de trabajo
WORKDIR /app

# Copia los archivos estáticos generados
COPY --from=build-stage /app/dist ./dist

# Instala un servidor web simple para servir la aplicación
RUN npm install -g http-server

# Expone el puerto
EXPOSE 8080

# Comando para iniciar el servidor
CMD ["http-server", "dist"]




















 





