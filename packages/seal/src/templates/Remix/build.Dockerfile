# Set the base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Build the production website files
RUN npm run build

# Expose the port
EXPOSE 3000

# Start the production server
CMD ["npm", "start"]
