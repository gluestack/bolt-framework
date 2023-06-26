# Set the base image
FROM elixir:latest

# Install required packages
RUN apt-get update && \
    apt-get install -y inotify-tools

# Set the working directory
WORKDIR /app

# Install dependencies
COPY mix.exs mix.lock ./
RUN mix deps.get

# Copy the application files
COPY . .

# Expose the port
EXPOSE 4000

# Start the server
CMD ["mix", "phx.server"]
