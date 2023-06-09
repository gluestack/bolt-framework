# Set the base image
FROM golang:latest AS builder

# Set the working directory
WORKDIR /go/src/app

# Copy the application files
COPY . .

# Build the binary
RUN CGO_ENABLED=0 GOOS=linux go build -a -installsuffix cgo -o app .

# Set the base image
FROM alpine:latest

# Install required packages
RUN apk --no-cache add ca-certificates

# Set the working directory
WORKDIR /root/

# Copy the binary from the builder image
COPY --from=builder /go/src/app/app .

# Expose the port
EXPOSE 8080

# Start the server
CMD ["./app"]
