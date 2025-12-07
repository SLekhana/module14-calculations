cat > README.md << 'EOF'
# Module 14: BREAD Functionality for Calculations

A FastAPI application implementing BREAD (Browse, Read, Edit, Add, Delete) operations for calculations with user authentication.

## Features

- User Authentication: JWT-based authentication
- BREAD Operations for calculations
- Interactive web interface
- Comprehensive Playwright E2E tests
- CI/CD pipeline with GitHub Actions
- Docker containerization

## Local Setup

1. Clone repository
2. Create virtual environment: `python3 -m venv venv`
3. Activate: `source venv/bin/activate`
4. Install dependencies: `pip install -r requirements.txt`
5. Install Playwright: `playwright install chromium`
6. Run: `uvicorn app.main:app --reload`
7. Access: http://localhost:8000

## Running Tests
```bash
npx playwright test
```

## Docker Usage

Build: `docker build -t module14-calculations .`
Run: `docker run -p 8000:8000 module14-calculations`

## API Endpoints

- POST /auth/register - Register user
- POST /auth/login - Login user
- GET /calculations - Browse all calculations
- GET /calculations/{id} - Read calculation
- POST /calculations - Add calculation
- PUT /calculations/{id} - Edit calculation
- DELETE /calculations/{id} - Delete calculation

## Technologies

- FastAPI, SQLAlchemy, JWT Authentication
- Playwright for testing
- Docker, GitHub Actions

## Author

Lekhana Sandra
