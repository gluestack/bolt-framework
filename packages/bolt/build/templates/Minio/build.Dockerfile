FROM minio/minio

# Expose port 9000 for Minio
EXPOSE 9000

# Start Minio server
CMD ["/usr/bin/minio", "server", "/data"]