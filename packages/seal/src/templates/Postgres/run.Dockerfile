# Use the official PostgreSQL image as the base image
FROM postgres:12

# Set the working directory to /app
WORKDIR /app

# Create a volume to persist the database data
VOLUME /var/lib/postgresql/data

# Expose the PostgreSQL port
EXPOSE 5432