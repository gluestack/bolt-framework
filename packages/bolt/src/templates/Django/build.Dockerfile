# Set the base image
FROM python:3.9-slim-buster

# Set the working directory
WORKDIR /app

# Copy the requirements file
COPY requirements.txt .

# Install the requirements
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Expose the port
EXPOSE 8000

# Start the server
CMD ["gunicorn", "--bind", "0.0.0.0:8000", "myproject.wsgi"]
