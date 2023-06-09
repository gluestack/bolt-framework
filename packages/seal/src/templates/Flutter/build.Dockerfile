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
RUN flutter build apk --release

# Set the base image
FROM nginx:1.21.3

# Remove the default nginx configuration
RUN rm /etc/nginx/conf.d/default.conf

# Copy the build artifacts to the nginx web root directory
COPY --from=build /app/build/web/ /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
