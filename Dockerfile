# Usar una imagen base de Node
FROM node:20-alpine

# Establecer el directorio de trabajo en el contenedor
WORKDIR /app

# Copiar package.json e instalar dependencias
COPY package*.json ./
RUN npm install --production

# Copiar el resto del código al contenedor
COPY . .

# Exponer el puerto en el que corre el backend (ajusta según config)
EXPOSE 4000

# Comando para ejecutar la app
CMD ["node", "server.js"]
