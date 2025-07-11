# Build phase
FROM node:18-alpine AS build

WORKDIR /app

COPY package.json ./
COPY package-lock.json ./
RUN npm install

COPY . .
RUN npm run build

# Serve phase using nginx
FROM nginx:alpine

COPY --from=build /app/dist /usr/share/nginx/html

# Optional: Replace default nginx config
# COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]
