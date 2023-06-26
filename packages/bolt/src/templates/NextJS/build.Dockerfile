# Set the base image
FROM node:latest AS builder

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . .

# Install dependencies and build the application
RUN npm install
RUN npm run build

# Set the base image
FROM node:alpine

# Set the working directory
WORKDIR /app

# Copy the built application from the builder image
COPY --from=builder /app .

# Expose the port
EXPOSE 3000

# Start the production server
CMD ["npm", "run", "start"]
