"""
WSGI entry point for Render deployment
This file is used by Gunicorn to start the Flask application
"""
import os
import sys

# Add the backend_api directory to the Python path
sys.path.insert(0, os.path.dirname(__file__))

# Import the Flask app from src.main
from main import app

if __name__ == '__main__':
    app.run()

