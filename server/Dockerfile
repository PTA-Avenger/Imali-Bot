# Use the official Python image
FROM python:3.10-slim

# Set the working directory
WORKDIR /app

# Copy requirements and install dependencies
COPY requirements.txt .
# Install system dependencies for build if needed, and python libs
# We install pytorch CPU version to save size (HF Spaces has CPU by default)
# If you duplicate the Space to a GPU tier, remove the --extra-index-url part
RUN pip install --no-cache-dir torch --index-url https://download.pytorch.org/whl/cpu
RUN pip install --no-cache-dir -r requirements.txt

# Copy the rest of the application
COPY . .

# Create the user that Hugging Face expects (user ID 1000)
# This is required for security on HF Spaces
RUN useradd -m -u 1000 user
USER user
ENV HOME=/home/user \
    PATH=/home/user/.local/bin:$PATH

# Expose port 7860 (Hugging Face specific port)
EXPOSE 7860

# Command to run the application
# We listen on 0.0.0.0 and port 7860
CMD ["uvicorn", "model_server:app", "--host", "0.0.0.0", "--port", "7860"]