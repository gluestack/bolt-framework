# Set the base image
FROM node:latest

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . .

# Install dependencies
RUN npm run install --workspaces --if-present

# Expose the port
EXPOSE 3000

# Start the development server
CMD ["npm", "run", "dev"]
