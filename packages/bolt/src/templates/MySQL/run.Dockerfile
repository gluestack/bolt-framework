# Use the official MySQL image as the base image
FROM mysql:latest

# Set the working directory to /app
WORKDIR /app

# Create a volume for the MySQL data directory
VOLUME /var/lib/mysql

# Expose port 3306 for MySQL
EXPOSE 3306

# Start the MySQL server
CMD ["mysqld"]