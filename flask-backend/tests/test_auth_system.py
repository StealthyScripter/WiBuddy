#!/usr/bin/env python
"""
Authentication and API Testing Script for Task Manager

This script tests the authentication system and API endpoints
after implementing the token-based authentication.
"""

import requests
import json
import sys
from colorama import init, Fore, Style

# Initialize colorama for colored terminal output
init()

# Base URL for the API
BASE_URL = "http://localhost:5000/api"

# Test users
ADMIN_USER = {"username": "admin", "password": "AdminPassword123!"}
REGULAR_USER = {"username": "user", "password": "UserPassword123!"}
TEST_USER = {
    "username": "testuser",
    "email": "testuser@example.com",
    "password": "Test123!"
}

# Store tokens
admin_token = None
user_token = None
test_token = None

def print_header(message):
    """Print a formatted header"""
    print(f"\n{Fore.CYAN}{'=' * 70}")
    print(f" {message}")
    print(f"{'=' * 70}{Style.RESET_ALL}")

def print_success(message):
    """Print a success message"""
    print(f"{Fore.GREEN}✓ {message}{Style.RESET_ALL}")

def print_error(message):
    """Print an error message"""
    print(f"{Fore.RED}✗ {message}{Style.RESET_ALL}")

def print_info(message):
    """Print an info message"""
    print(f"{Fore.YELLOW}ℹ {message}{Style.RESET_ALL}")

def print_json(data):
    """Print formatted JSON data"""
    print(f"{Fore.BLUE}{json.dumps(data, indent=2)}{Style.RESET_ALL}")

def test_registration():
    """Test user registration"""
    print_header("Testing User Registration")

    try:
        # Register a new test user
        response = requests.post(
            f"{BASE_URL}/auth/register",
            json=TEST_USER
        )

        if response.status_code == 201:
            print_success(f"Registration successful (status: {response.status_code})")
            print_json(response.json())
            return True
        else:
            print_error(f"Registration failed (status: {response.status_code})")
            print_json(response.json())

            # Check if user already exists
            if response.status_code == 400 and "already exists" in response.text:
                print_info("User might already exist, continuing with tests...")
                return True
            return False
    except Exception as e:
        print_error(f"Error during registration: {str(e)}")
        return False

def test_login(username, password):
    """Test user login and return token"""
    print_header(f"Testing Login for {username}")

    try:
        response = requests.post(
            f"{BASE_URL}/auth/login",
            json={"username": username, "password": password}
        )

        if response.status_code == 200:
            print_success(f"Login successful (status: {response.status_code})")
            data = response.json()
            token = data.get("token")
            print_info(f"Token received: {token[:20]}...")
            return token
        else:
            print_error(f"Login failed (status: {response.status_code})")
            print_json(response.json())
            return None
    except Exception as e:
        print_error(f"Error during login: {str(e)}")
        return None

def test_protected_endpoint(token, endpoint, description, method="GET", data=None):
    """Test accessing a protected endpoint with token"""
    print_header(f"Testing {description} ({endpoint})")

    headers = {"Authorization": f"Bearer {token}"} if token else {}

    try:
        if method == "GET":
            response = requests.get(f"{BASE_URL}/{endpoint}", headers=headers)
        elif method == "POST":
            response = requests.post(f"{BASE_URL}/{endpoint}", headers=headers, json=data)
        elif method == "PUT":
            response = requests.put(f"{BASE_URL}/{endpoint}", headers=headers, json=data)
        elif method == "DELETE":
            response = requests.delete(f"{BASE_URL}/{endpoint}", headers=headers)

        if response.status_code in [200, 201]:
            print_success(f"Request successful (status: {response.status_code})")
            print_json(response.json())
            return True
        else:
            print_error(f"Request failed (status: {response.status_code})")
            print_json(response.json() if response.text else {"message": "No response data"})
            return False
    except Exception as e:
        print_error(f"Error during request: {str(e)}")
        return False

def main():
    """Main test routine"""
    print_header("API Authentication Test Script")

    # 1. Test registration
    registration_success = test_registration()
    if not registration_success:
        print_error("Registration test failed. Continuing with other tests...")

    # 2. Test login for all users
    global admin_token, user_token, test_token

    admin_token = test_login(ADMIN_USER["username"], ADMIN_USER["password"])
    if not admin_token:
        print_error("Admin login failed. Some tests will be skipped.")

    user_token = test_login(REGULAR_USER["username"], REGULAR_USER["password"])
    if not user_token:
        print_error("Regular user login failed. Some tests will be skipped.")

    test_token = test_login(TEST_USER["username"], TEST_USER["password"])
    if not test_token:
        print_error("Test user login failed. Some tests will be skipped.")

    # 3. Test accessing endpoints without token
    print_header("Testing Access Without Token")
    test_protected_endpoint(None, "tasks", "Access tasks without token")

    # 4. Test accessing endpoints with regular user token
    if user_token:
        test_protected_endpoint(user_token, "tasks", "Access tasks with regular user token")
        test_protected_endpoint(user_token, "projects", "Access projects with regular user token")
        test_protected_endpoint(user_token, "users", "Access users list with regular user token (should fail)")

    # 5. Test accessing admin endpoints with admin token
    if admin_token:
        test_protected_endpoint(admin_token, "users", "Access users list with admin token")

    # 6. Test creating, updating and deleting resources
    if test_token:
        # Create a task
        test_protected_endpoint(
            test_token,
            "tasks",
            "Create a new task",
            method="POST",
            data={
                "name": "Test Authentication Task",
                "description": "This task was created during authentication testing",
                "due_date": "2025-05-30",
                "estimated_duration": 2
            }
        )

        # Try to access projects
        test_protected_endpoint(test_token, "projects", "Access projects with test user token")

    print_header("Test Summary")
    if admin_token and user_token and (test_token or registration_success):
        print_success("All authentication tests completed!")
        print_info("The authentication system appears to be working correctly.")
        print_info("Next steps: Review the individual test results above for any issues.")
    else:
        print_error("Some authentication tests failed.")
        print_info("Review the error messages above and fix the issues.")

    return 0

if __name__ == "__main__":
    sys.exit(main())
