# Use an official Node runtime as a parent image
FROM node:latest as node

# Set the working directory to /app
WORKDIR /app

# Copy the rest of the application to the container
COPY . .

# Install dependencies
RUN npm install

# Build the application
RUN npm run build --prod

# Expose port 80 for the application
EXPOSE 80

# Stage 2
# Use an official Nginx image
FROM nginx:alpine

# Copy the build app to nginx dir
COPY --from=node /app/dist/angular-app /usr/share/nginx/html