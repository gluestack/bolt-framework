# Set the base image
FROM google/dart:2.15.0 AS build

# Set the working directory
WORKDIR /app

# Copy the pubspec files
COPY pubspec.yaml pubspec.lock ./

# Get the dependencies
RUN pub get

# Copy the rest of the application
COPY . .

# Build the app
RUN flutter build apk

# Expose the port
EXPOSE 3000

# Start the app
CMD ["flutter", "run", "--release", "-d", "web-server", "--web-port", "3000"]
