# Utiliza una imagen base oficial de Node.js para construir la aplicación Angular
FROM node:16 as build

# Establece el directorio de trabajo en /app
WORKDIR /app

# Copia el archivo package.json y package-lock.json en el directorio de trabajo
COPY package*.json ./

RUN npm install -g @angular/cli

# Instala las dependencias del proyecto
RUN npm ci

# Copia el código fuente del proyecto al directorio de trabajo
COPY . .

# Compila la aplicación Angular para producción
RUN ng build

# Utiliza una imagen base oficial de nginx para servir la aplicación Angular
FROM nginx:stable-alpine

# Copia la configuración de nginx
COPY nginx.conf /etc/nginx/conf.d/default.conf

# Copia los archivos de la aplicación Angular compilada a la carpeta predeterminada de nginx
COPY --from=build /app/dist/pokemon /usr/share/nginx/html

# Expone el puerto 80 para que la aplicación sea accesible externamente
EXPOSE 80

# Ejecuta nginx en primer plano
CMD ["nginx", "-g", "daemon off;"]
