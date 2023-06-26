# Set the base image
FROM nginx:latest

# Copy the production configuration file
COPY nginx.conf /etc/nginx/nginx.conf

# Copy the production website files
COPY dist /usr/share/nginx/html

# Expose the port
EXPOSE 80

# Start the nginx server
CMD ["nginx", "-g", "daemon off;"]
