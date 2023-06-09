# Set the base image
FROM golang:latest

# Set the working directory
WORKDIR /go/src/app

# Install required packages
RUN apt-get update && \
    apt-get install -y build-essential

# Copy the application files
COPY . .

# Expose the port
EXPOSE 8080

# Start the server
CMD ["go", "run", "main.go"]
