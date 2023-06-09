# Set the base image
FROM crystallang/crystal:latest-alpine

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . .

# Install dependencies
RUN shards install

# Expose the port
EXPOSE 3000

# Start the development server
CMD ["crystal", "run", "src/app.cr"]
