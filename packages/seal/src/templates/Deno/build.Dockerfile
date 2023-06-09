# Set the base image
FROM denoland/deno:latest AS builder

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . .

# Bundle the application
RUN deno bundle app.ts app.bundle.js

# Set the base image
FROM denoland/deno

# Set the working directory
WORKDIR /app

# Copy the bundled application from the builder image
COPY --from=builder /app/app.bundle.js .

# Expose the port
EXPOSE 3000

# Start the server
CMD ["deno", "run", "--allow-net", "app.bundle.js"]
