# Set the base image
FROM ruby:latest AS builder

# Set the working directory
WORKDIR /app

# Copy the application files
COPY . .

# Install dependencies and build the application
RUN bundle install
RUN rake assets:precompile RAILS_ENV=production

# Set the base image
FROM ruby:alpine

# Set the working directory
WORKDIR /app

# Copy the built application from the builder image
COPY --from=builder /app .

# Expose the port
EXPOSE 3000

# Start the server
CMD ["rails", "server", "-b", "0.0.0.0", "-e", "production"]
