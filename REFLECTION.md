# Module 14 Assignment Reflection

**Student Name:** Lekhana Sandra  
**Date:** December 8, 2024  
**Course:** IS 601 - Python for Web API Development

## Project Overview

This project implements a complete BREAD (Browse, Read, Edit, Add, Delete) operations system for calculations with JWT-based user authentication. The application is built using FastAPI, includes comprehensive Playwright E2E tests, and features automated CI/CD deployment to Docker Hub.

## Key Experiences and Learning Outcomes

### 1. Full-Stack Development with FastAPI

**Experience:**
Developed a complete web application combining backend API development with an interactive frontend interface. Implemented user authentication, database operations, and RESTful API endpoints.

**Key Learnings:**
- FastAPI's automatic API documentation with Swagger UI is incredibly helpful for testing
- Proper separation of concerns (models, schemas, routers) makes the codebase maintainable
- SQLAlchemy ORM simplifies database operations while maintaining flexibility
- JWT token-based authentication provides stateless, scalable user sessions

**Challenges Faced:**
Initially struggled with Python 3.13 compatibility issues, particularly with bcrypt and pydantic dependencies. Resolved by downgrading bcrypt to version 4.0.1 and adding email-validator as an explicit dependency.

### 2. End-to-End Testing with Playwright

**Experience:**
Created comprehensive E2E tests covering authentication flows and BREAD operations. Tests run automatically in CI/CD pipeline and provide valuable feedback on application functionality.

**Key Learnings:**
- Playwright's page object model makes tests readable and maintainable
- Test isolation is crucial - each test creates its own user to avoid conflicts
- Proper wait strategies (toBeVisible with timeouts) prevent flaky tests
- Browser automation reveals UI/UX issues that manual testing might miss

**Challenges Faced:**
Encountered issues with Playwright browser installation in GitHub Actions. Fixed by using `npx playwright install --with-deps chromium` to ensure all system dependencies were installed.

### 3. CI/CD Pipeline with GitHub Actions

**Experience:**
Implemented automated testing and Docker deployment pipeline that runs on every push to the main branch.

**Key Learnings:**
- GitHub Actions workflow syntax for multi-job pipelines
- Importance of caching dependencies to speed up builds
- Secrets management for secure Docker Hub authentication
- Conditional job execution based on branch and event type

**Challenges Faced:**
Multiple iterations were needed to get the workflow configuration right. Issues included:
- Missing Node.js setup for Playwright
- Playwright browser installation without system dependencies
- Action version deprecations (v3 → v4)

### 4. Docker Containerization

**Experience:**
Created a production-ready Docker image with proper layering and optimization.

**Key Learnings:**
- Multi-stage builds can reduce image size
- Proper .dockerignore prevents unnecessary files in images
- Environment variables provide flexibility for different deployments
- Docker tags (latest, sha, branch) enable versioning and rollback

**Challenges Faced:**
Initial Dockerfile didn't copy the .env file correctly. Resolved by explicitly including it in the COPY command.

### 5. Frontend Development

**Experience:**
Built an interactive single-page application using vanilla JavaScript, HTML, and CSS.

**Key Learnings:**
- LocalStorage for persisting JWT tokens across sessions
- Fetch API for making authenticated requests
- DOM manipulation for dynamic UI updates
- Event delegation for handling dynamic elements

**Challenges Faced:**
Managing authentication state across page reloads required careful handling of localStorage and token validation.

## Technical Challenges and Solutions

### Challenge 1: Python 3.13 Compatibility
**Problem:** bcrypt 5.0.0 had compatibility issues with Python 3.13
**Solution:** Downgraded to bcrypt 4.0.1 which has stable Python 3.13 support
**Learning:** Always check package compatibility with your Python version

### Challenge 2: Pydantic EmailStr Validation
**Problem:** Missing email-validator dependency caused import errors
**Solution:** Added email-validator==2.1.0 to requirements.txt
**Learning:** Pydantic extras like [email] require additional dependencies

### Challenge 3: GitHub Actions Browser Installation
**Problem:** Playwright browsers not installing properly in CI
**Solution:** Used `--with-deps` flag to install system dependencies
**Learning:** CI environments may lack system libraries that work locally

### Challenge 4: Test File Creation Issues
**Problem:** Test file was created but empty (0 bytes)
**Solution:** Ensured heredoc syntax was correct in terminal
**Learning:** Always verify file contents after creation

## Best Practices Applied

1. **Security:**
   - JWT tokens with expiration
   - Password hashing with bcrypt
   - Input validation with Pydantic
   - Secrets management in GitHub Actions

2. **Code Organization:**
   - Clear separation of concerns (MVC pattern)
   - Reusable authentication dependencies
   - Modular router structure
   - Type hints throughout

3. **Testing:**
   - Comprehensive E2E test coverage
   - Test isolation with unique users
   - Both positive and negative test scenarios
   - Automated test execution in CI

4. **DevOps:**
   - Automated CI/CD pipeline
   - Docker containerization
   - Multi-stage deployments
   - Proper version tagging

## What Worked Well

- FastAPI's automatic API documentation saved significant testing time
- Playwright tests caught several UI bugs early
- Docker containerization made deployment consistent
- Git workflow with meaningful commits helped track progress
- Modular code structure made debugging easier

## Areas for Improvement

- Could add database migrations with Alembic
- Frontend could benefit from a framework like React
- More comprehensive test coverage (edge cases)
- API rate limiting for production readiness
- Logging and monitoring setup
- Input sanitization and CSRF protection

## Conclusion

This project provided hands-on experience with modern web development practices, from backend API design to frontend implementation, automated testing, and DevOps. The integration of multiple technologies (FastAPI, SQLAlchemy, Playwright, Docker, GitHub Actions) simulates real-world software development workflows.

The most valuable lesson was understanding how automated testing and CI/CD pipelines catch issues early and ensure code quality. The challenges faced with dependency management and CI configuration were frustrating but taught important lessons about environment consistency and debugging skills.

Overall, this assignment successfully demonstrates BREAD operations, user authentication, comprehensive testing, and automated deployment - all essential skills for modern web development.

## Repository Information

- **GitHub Repository:** https://github.com/slekhana/module14-calculations
- **Docker Hub:** https://hub.docker.com/r/YOUR_DOCKERHUB_USERNAME/module14-calculations
- **Live Demo:** Not deployed (local/container only)

## Time Investment

- Backend Development: 3 hours
- Frontend Development: 2 hours
- Playwright Tests: 2 hours
- Docker & CI/CD: 2 hours
- Debugging & Fixes: 3 hours
- **Total:** ~12 hours
