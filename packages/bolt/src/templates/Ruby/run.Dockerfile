# Set the base image
FROM ruby:latest

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . .

# Install dependencies
RUN bundle install

# Expose the port
EXPOSE 3000

# Start the server
CMD ["rails", "server", "-b", "0.0.0.0"]
