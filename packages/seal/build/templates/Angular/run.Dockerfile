# Stage 1
# Use an official Node runtime as a parent image
FROM node:latest as node

# Set the working directory to /app
WORKDIR /app

# Copy the rest of the application to the container
COPY . .

# Install dependencies and build
RUN npm install
RUN npm run build --prod

# Stage 2
# Use an official Nginx image
FROM nginx:alpine

# Copy the build app to nginx dir
COPY --from=node /app/dist/angular-app /usr/share/nginx/html