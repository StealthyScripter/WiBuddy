# Project Title

## Introduction
A brief description of what your project does and its purpose.

## Initialization

To initialize the database and get the application running, follow these steps:

### Prerequisites
- Ensure you have Python installed (version X.X or higher).
- Install `pip` if it’s not already installed.

### Setup Steps

1. **Create a Virtual Environment** (optional but recommended)
   ```bash
   python -m venv venv

2. **Activate the Virtual Environment**
    
    -###On Windows:
    ```bash
        venv\Scripts\activate
    
   -###On macOS/Linux:
    ```bash
    source venv/bin/activate

3 **Install Dependencies**
```bash
    pip install -r requirements.txt```

4. **Run the Application**
```bash
python run.py


This starts the application.

5. **Run Tests**
```bash
python3 -m unittest discover -s tests/


using coverage to check the code that has been tested
pip install coverage
coverage run -m unittest discover -s tests
coverage report

