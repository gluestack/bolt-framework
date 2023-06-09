# Set the base image
FROM nginx:latest

# Copy the local development configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the local development website files
COPY . /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
