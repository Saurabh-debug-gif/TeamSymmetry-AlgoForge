import os

UPLOAD_DIR = os.getenv("UPLOAD_DIR", "uploads")
PASSING_SCORE = float(os.getenv("PASSING_SCORE", "80.0"))
OPENAI_API_KEY = os.getenv("OPENAI_API_KEY", "")
CORS_ORIGINS = os.getenv("CORS_ORIGINS", "*").split(",")