# Use an official Node runtime as a parent image
FROM node:14.18.1-alpine3.14

# Set the working directory to /app
WORKDIR /app

# Copy package.json and package-lock.json to the container
COPY package*.json ./

# Install dependencies
RUN npm install --production

# Copy the rest of the application to the container
COPY . .

# Expose port 3000 for the application
EXPOSE 3000

# Start the application
CMD ["npm", "run", "start"]
