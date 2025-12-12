# WiBuddy Notes CRUD API Documentation

## Overview
This document describes the RESTful API endpoints for the Notes, Folders, Courses, and Modules functionality in the WiBuddy study assistant application.

## Authentication
All endpoints require JWT authentication. Include the token in the Authorization header:
```
Authorization: Bearer <your_jwt_token>
```

### Get JWT Token
**POST** `/api/auth/login`

Request:
```json
{
  "username": "admin",
  "password": "AdminPassword123!"
}
```

Response:
```json
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user_id": 1,
  "username": "admin"
}
```

---

## Notes API

### List All Notes
**GET** `/api/notes`

Query Parameters:
- `user_id` (optional): Filter by user ID
- `folder_id` (optional): Filter by folder ID
- `module_id` (optional): Filter by module ID
- `tags` (optional): Filter by tags (can provide multiple)

Example: `/api/notes?user_id=1&module_id=1`

Response:
```json
[
  {
    "id": 1,
    "name": "HTML Tags Reference",
    "content": ["<html>", "<body>", "<h1>", "<p>"],
    "type": "list",
    "tags": ["html", "reference"],
    "user_id": 1,
    "folder_id": 1,
    "module_id": 1,
    "ai_summary": "Quick reference for common HTML tags",
    "date_created": "2025-12-12T02:24:04.225572",
    "last_modified": "2025-12-12T02:24:04.225574"
  }
]
```

### Get Single Note
**GET** `/api/notes/<note_id>`

Example: `/api/notes/1`

Response: Same as note object above

### Create Note
**POST** `/api/notes`

Request:
```json
{
  "name": "JavaScript Basics",
  "content": ["Variables", "Functions", "Objects"],
  "type": "list",
  "tags": ["javascript", "fundamentals"],
  "user_id": 1,
  "module_id": 1,
  "folder_id": 1,
  "ai_summary": "Introduction to JavaScript"
}
```

Response: Created note object with ID

### Update Note
**PUT** `/api/notes/<note_id>`

Request (partial update supported):
```json
{
  "name": "JavaScript Essentials",
  "ai_summary": "Key JavaScript concepts for beginners"
}
```

Response: Updated note object

### Delete Note
**DELETE** `/api/notes/<note_id>`

Response:
```json
{
  "message": "Note deleted successfully"
}
```

### Search Notes
**GET** `/api/notes/search?q=<search_query>&user_id=<user_id>`

Query Parameters:
- `q` (required): Search query string
- `user_id` (optional): Filter by user ID

Example: `/api/notes/search?q=JavaScript&user_id=1`

Response: Array of matching notes

---

## Folders API

### List All Folders
**GET** `/api/folders`

Query Parameters:
- `user_id` (optional): Filter by user ID
- `parent_id` (optional): Filter by parent folder ID

Response:
```json
[
  {
    "id": 1,
    "name": "Computer Science",
    "description": "CS learning materials",
    "parent_id": null,
    "user_id": 1,
    "color": "#4CAF50",
    "date_created": "2025-12-12T02:24:04.186932",
    "last_modified": "2025-12-12T02:24:04.186935"
  }
]
```

### Get Single Folder
**GET** `/api/folders/<folder_id>`

### Create Folder
**POST** `/api/folders`

Request:
```json
{
  "name": "Mathematics",
  "description": "Math learning materials",
  "parent_id": null,
  "user_id": 1,
  "color": "#FF5722"
}
```

### Update Folder
**PUT** `/api/folders/<folder_id>`

Request (partial update supported):
```json
{
  "name": "Advanced Mathematics",
  "description": "Advanced math topics"
}
```

### Delete Folder
**DELETE** `/api/folders/<folder_id>`

Response:
```json
{
  "message": "Folder deleted successfully"
}
```

---

## Courses API

### List All Courses
**GET** `/api/courses`

Query Parameters:
- `user_id` (optional): Filter by user ID
- `field` (optional): Filter by study field (TECHNOLOGY, NURSING, BUSINESS, etc.)

Response:
```json
[
  {
    "id": 1,
    "name": "Introduction to Web Development",
    "code": "CS101",
    "description": "Learn the basics of web development",
    "field": "StudyField.TECHNOLOGY",
    "instructor": "Dr. Smith",
    "semester": "Fall 2024",
    "credits": 3,
    "start_date": null,
    "end_date": null,
    "progress": 0.0,
    "color": "#2196F3",
    "tags": null,
    "user_id": 1,
    "date_created": "2025-12-12T02:24:04.198390",
    "last_modified": "2025-12-12T02:24:04.198392"
  }
]
```

### Get Single Course
**GET** `/api/courses/<course_id>`

### Create Course
**POST** `/api/courses`

Request:
```json
{
  "name": "Data Structures",
  "code": "CS201",
  "description": "Learn data structures and algorithms",
  "field": "TECHNOLOGY",
  "instructor": "Dr. Johnson",
  "semester": "Spring 2025",
  "credits": 4,
  "user_id": 1,
  "color": "#9C27B0",
  "tags": ["programming", "algorithms"]
}
```

### Update Course
**PUT** `/api/courses/<course_id>`

Request (partial update supported):
```json
{
  "progress": 45.5,
  "semester": "Fall 2025"
}
```

### Delete Course
**DELETE** `/api/courses/<course_id>`

Note: This will also delete all associated modules (cascade delete)

### Update Course Progress
**PUT** `/api/courses/<course_id>/progress`

Automatically recalculates progress based on completed modules

Response: Updated course object with recalculated progress

---

## Modules API

### List All Modules
**GET** `/api/modules`

Query Parameters:
- `course_id` (optional): Filter by course ID

Response:
```json
[
  {
    "id": 1,
    "course_id": 1,
    "name": "HTML Basics",
    "description": "Learn HTML fundamentals",
    "order": 1,
    "learning_objectives": ["Understand HTML structure", "Create basic web pages"],
    "progress": 0.0,
    "estimated_hours": 10,
    "completed_hours": 0,
    "due_date": null,
    "date_created": "2025-12-12T02:24:04.210668",
    "last_modified": "2025-12-12T02:24:04.210670"
  }
]
```

### Get Single Module
**GET** `/api/modules/<module_id>`

### Create Module
**POST** `/api/modules`

Request:
```json
{
  "course_id": 1,
  "name": "JavaScript Advanced",
  "description": "Advanced JavaScript concepts",
  "order": 3,
  "learning_objectives": ["Master async programming", "Understand closures"],
  "estimated_hours": 20,
  "due_date": "2025-01-15T00:00:00"
}
```

### Update Module
**PUT** `/api/modules/<module_id>`

Request (partial update supported):
```json
{
  "progress": 75.0,
  "completed_hours": 15
}
```

Note: Updating a module's progress will automatically recalculate the parent course's progress

### Delete Module
**DELETE** `/api/modules/<module_id>`

Note: This will also update the parent course's progress

---

## Data Models

### Note
- `id`: Integer (auto-generated)
- `name`: String (required, max 200 chars)
- `content`: Array of strings
- `type`: String ('text', 'list', 'media')
- `tags`: Array of strings
- `items`: Array of strings (for list-type notes)
- `user_id`: Integer (foreign key)
- `folder_id`: Integer (foreign key, nullable)
- `module_id`: Integer (foreign key, nullable)
- `image_url`: String (nullable)
- `images`: Array of objects
- `ai_summary`: Text (nullable)
- `date_created`: DateTime (auto-generated)
- `last_modified`: DateTime (auto-updated)

### Folder
- `id`: Integer (auto-generated)
- `name`: String (required, max 200 chars)
- `description`: Text (nullable)
- `parent_id`: Integer (self-referential, nullable)
- `user_id`: Integer (foreign key, nullable)
- `color`: String (max 50 chars, nullable)
- `date_created`: DateTime (auto-generated)
- `last_modified`: DateTime (auto-updated)

### Course
- `id`: Integer (auto-generated)
- `name`: String (required, max 200 chars)
- `code`: String (max 50 chars, nullable)
- `description`: Text (nullable)
- `field`: Enum (TECHNOLOGY, NURSING, BUSINESS, ENGINEERING, SCIENCE, ARTS, OTHER)
- `instructor`: String (max 100 chars, nullable)
- `semester`: String (max 50 chars, nullable)
- `credits`: Integer (nullable)
- `start_date`: DateTime (nullable)
- `end_date`: DateTime (nullable)
- `progress`: Float (0-100, default 0.0)
- `color`: String (max 50 chars, nullable)
- `tags`: Array of strings
- `user_id`: Integer (foreign key, nullable)
- `date_created`: DateTime (auto-generated)
- `last_modified`: DateTime (auto-updated)

### Module
- `id`: Integer (auto-generated)
- `course_id`: Integer (required, foreign key with cascade delete)
- `name`: String (required, max 200 chars)
- `description`: Text (nullable)
- `order`: Integer (default 0)
- `learning_objectives`: Array of strings
- `progress`: Float (0-100, default 0.0)
- `estimated_hours`: Integer (nullable)
- `completed_hours`: Integer (default 0)
- `due_date`: DateTime (nullable)
- `date_created`: DateTime (auto-generated)
- `last_modified`: DateTime (auto-updated)

---

## Study Fields Enum
- TECHNOLOGY
- NURSING
- BUSINESS
- ENGINEERING
- SCIENCE
- ARTS
- OTHER

---

## Error Responses

### 400 Bad Request
```json
{
  "message": "Validation error",
  "errors": {
    "name": ["Field is required"]
  }
}
```

### 401 Unauthorized
```json
{
  "message": "Token is missing or invalid"
}
```

### 404 Not Found
```json
{
  "message": "Error retrieving note: 404 Not Found: The requested resource was not found on the server."
}
```

### 500 Internal Server Error
```json
{
  "message": "Error creating note: <error details>"
}
```

---

## Example Workflow

### 1. Login
```bash
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "AdminPassword123!"}'
```

### 2. Create a Course
```bash
TOKEN="<your_token_here>"
curl -X POST http://localhost:5000/api/courses \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python Programming",
    "code": "PY101",
    "field": "TECHNOLOGY",
    "credits": 3,
    "user_id": 1
  }'
```

### 3. Create a Module
```bash
curl -X POST http://localhost:5000/api/modules \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "course_id": 1,
    "name": "Variables and Data Types",
    "order": 1,
    "estimated_hours": 5
  }'
```

### 4. Create a Note
```bash
curl -X POST http://localhost:5000/api/notes \
  -H "Authorization: Bearer $TOKEN" \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Python Variables",
    "content": ["int", "float", "string", "boolean"],
    "type": "list",
    "tags": ["python", "basics"],
    "module_id": 1,
    "user_id": 1
  }'
```

### 5. Search Notes
```bash
curl -X GET "http://localhost:5000/api/notes/search?q=Python&user_id=1" \
  -H "Authorization: Bearer $TOKEN"
```

---

## Database Initialization

To initialize the database with sample data:

```bash
cd flask-backend
python init_db.py
```

This creates:
- Admin user (username: admin, password: AdminPassword123!)
- Regular user (username: user, password: UserPassword123!)
- Sample folder, course, modules, and notes

---

## Notes

1. All endpoints require authentication except `/api/auth/login` and `/api/auth/register`
2. Partial updates are supported for PUT endpoints
3. Deleting a course will cascade delete all its modules
4. Folders support nested hierarchies via `parent_id`
5. Updating module progress automatically recalculates course progress
6. Notes can belong to both a folder and a module
7. Search is case-insensitive and searches in note names and AI summaries
