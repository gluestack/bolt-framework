# Set the base image
FROM node:latest AS builder

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . .

# Install dependencies and build the application
RUN yarn install
RUN yarn redwood deploy

# Set the base image
FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy the built application from the builder image
COPY --from=builder /app/web/dist .

# Expose the port
EXPOSE 8910

# Start the server
CMD ["node", "api/dist/functions/router.js"]
