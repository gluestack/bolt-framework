FROM minio/minio

# Expose port 9000 for Minio
EXPOSE 9000

# Expose port 9000 for Console
EXPOSE 9001

# Start Minio server
CMD ["server", "/data", "--console-address", ":9001"]