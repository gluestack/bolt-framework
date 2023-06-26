# Set the base image
FROM crystallang/crystal:latest-alpine AS builder

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . .

# Install dependencies and build the application
RUN shards install --production
RUN crystal build --release src/app.cr

# Set the base image
FROM alpine:latest

# Set the working directory
WORKDIR /app

# Copy the built application from the builder image
COPY --from=builder /app/bin/app .

# Expose the port
EXPOSE 3000

# Start the production server
CMD ["./app"]
