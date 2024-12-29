#!/bin/bash

# Run backend tests
echo "Running backend tests..."
cd backend
pytest tests/ -v --cov=app

# Run frontend tests
echo "Running frontend tests..."
cd ../frontend
npm test

# Print summary
echo "All tests completed!"
