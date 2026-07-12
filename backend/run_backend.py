import uvicorn
from app.main import app
import sys
import os

if __name__ == "__main__":
    import multiprocessing
    multiprocessing.freeze_support()
    # Change current working directory to the directory of the executable
    if getattr(sys, 'frozen', False):
        os.chdir(os.path.dirname(sys.executable))
    
    uvicorn.run(app, host="127.0.0.1", port=8000)
