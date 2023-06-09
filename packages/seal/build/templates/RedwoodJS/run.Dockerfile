# Set the base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . .

# Install dependencies
RUN yarn install

# Expose the port
EXPOSE 8910

# Start the server
CMD ["yarn", "redwood", "dev"]
