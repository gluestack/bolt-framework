# Use an official Node runtime as a parent image
FROM node:14.18.1-alpine3.14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application to the container
COPY . .

# Build the application
RUN npm run build

# Use a lighter base image
FROM nginx:1.21.3-alpine

# Copy the built application to the container
COPY --from=0 /app/dist /usr/share/nginx/html

# Expose port 80 for the application
EXPOSE 80

# Start the application
CMD ["nginx", "-g", "daemon off;"]
