# Set the base image
FROM elixir:latest AS builder

# Install required packages
RUN apt-get update && \
    apt-get install -y build-essential

# Set the working directory
WORKDIR /app

# Install dependencies
COPY mix.exs mix.lock ./
RUN mix deps.get --only prod

# Copy the application files
COPY . .

# Build the release
RUN MIX_ENV=prod mix release

# Set the base image
FROM debian:buster-slim

# Install required packages
RUN apt-get update && \
    apt-get install -y openssl

# Set the working directory
WORKDIR /app

# Copy the release from the builder image
COPY --from=builder /app/_build/prod/rel/app .

# Expose the port
EXPOSE 4000

# Start the server
CMD ["bin/app", "start"]
