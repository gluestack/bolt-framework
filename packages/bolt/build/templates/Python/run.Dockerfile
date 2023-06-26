# Use an official Python runtime as a parent image
FROM python:3.10.0-alpine3.14

# Set the working directory to /app
WORKDIR /app

# Copy requirements.txt to the container
COPY requirements.txt .

# Install dependencies
RUN pip install -r requirements.txt

# Copy the rest of the application to the container
COPY . .

# Expose port 5000 for development server
EXPOSE 5000

# Start the development server
CMD ["python", "app.py"]
