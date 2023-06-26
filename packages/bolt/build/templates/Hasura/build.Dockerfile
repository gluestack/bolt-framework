FROM hasura/graphql-engine:latest

# Install Hasura CLI
RUN apt-get update && apt-get install -y curl
RUN curl -L https://github.com/hasura/graphql-engine/raw/stable/cli/get.sh | bash

# Set the working directory
WORKDIR /app

# Create a volume
VOLUME /hasura

# Expose port for Hasura GraphQL Engine
EXPOSE 8080

# Start Hasura GraphQL Engine and run Hasura commands
CMD ["graphql-engine", "serve"]