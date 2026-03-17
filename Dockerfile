# 1. Use an official, lightweight Python image
FROM python:3.10-slim

# 2. Set the working directory inside the container
WORKDIR /app

# 3. Install ffmpeg (Whisper absolutely requires this for audio processing)
RUN apt-get update && apt-get install -y ffmpeg

# 4. Copy the requirements and install them
COPY requirements.txt .
RUN pip install --no-cache-dir -r requirements.txt

# 5. Copy the rest of your app's code into the container
COPY . .

# 6. Expose the port FastAPI runs on
EXPOSE 8000

# 7. The command to start the server
CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]