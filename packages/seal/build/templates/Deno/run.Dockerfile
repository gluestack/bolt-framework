# Set the base image
FROM denoland/deno:latest

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . .

# Expose the port
EXPOSE 3000

# Start the server
CMD ["deno", "run", "--allow-net", "app.ts"]
