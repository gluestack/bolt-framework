# Set the base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Install dependencies
COPY package*.json ./
RUN npm install

# Copy the local development website files
COPY . .

# Expose the port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
