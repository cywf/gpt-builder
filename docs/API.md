# API Documentation

## Overview

The GPT Builder API provides RESTful endpoints for managing GPT profiles, prompts, and templates. All endpoints return JSON responses.

## Base URL

```
http://localhost:3001/api
```

## Authentication

Currently, the API does not require authentication. This is intended for local/personal use.

## Endpoints

### Health Check

#### GET /api/health

Check if the API server is running.

**Response:**
```json
{
  "status": "ok",
  "timestamp": "2024-01-15T10:30:00.000Z"
}
```

---

## Profiles

### List All Profiles

#### GET /api/profiles

Returns an array of all GPT profiles.

**Response:**
```json
[
  {
    "id": "1234567890",
    "name": "Code Assistant",
    "description": "Helps with programming tasks",
    "systemInstructions": "You are an expert programmer...",
    "initiationPrompt": "Hello! I'm ready to help with your code.",
    "temperature": 0.7,
    "maxTokens": 2000,
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Get Profile

#### GET /api/profiles/:id

Returns a single profile by ID.

**Parameters:**
- `id` (string) - Profile ID

**Response:**
```json
{
  "id": "1234567890",
  "name": "Code Assistant",
  "description": "Helps with programming tasks",
  "systemInstructions": "You are an expert programmer...",
  "initiationPrompt": "Hello! I'm ready to help with your code.",
  "temperature": 0.7,
  "maxTokens": 2000,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Create Profile

#### POST /api/profiles

Creates a new GPT profile.

**Request Body:**
```json
{
  "name": "Code Assistant",
  "description": "Helps with programming tasks",
  "systemInstructions": "You are an expert programmer...",
  "initiationPrompt": "Hello! I'm ready to help with your code.",
  "temperature": 0.7,
  "maxTokens": 2000
}
```

**Response:**
```json
{
  "id": "1234567890",
  "name": "Code Assistant",
  "description": "Helps with programming tasks",
  "systemInstructions": "You are an expert programmer...",
  "initiationPrompt": "Hello! I'm ready to help with your code.",
  "temperature": 0.7,
  "maxTokens": 2000,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

**Status Codes:**
- `201` - Created successfully
- `500` - Server error

### Update Profile

#### PUT /api/profiles/:id

Updates an existing profile.

**Parameters:**
- `id` (string) - Profile ID

**Request Body:**
```json
{
  "name": "Updated Code Assistant",
  "description": "Updated description",
  "systemInstructions": "Updated instructions...",
  "initiationPrompt": "Updated prompt",
  "temperature": 0.8,
  "maxTokens": 3000
}
```

**Response:**
```json
{
  "id": "1234567890",
  "name": "Updated Code Assistant",
  "description": "Updated description",
  "systemInstructions": "Updated instructions...",
  "initiationPrompt": "Updated prompt",
  "temperature": 0.8,
  "maxTokens": 3000,
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T11:45:00.000Z"
}
```

**Status Codes:**
- `200` - Updated successfully
- `404` - Profile not found
- `500` - Server error

### Delete Profile

#### DELETE /api/profiles/:id

Deletes a profile.

**Parameters:**
- `id` (string) - Profile ID

**Response:**
```json
{
  "message": "Profile deleted successfully"
}
```

**Status Codes:**
- `200` - Deleted successfully
- `404` - Profile not found
- `500` - Server error

### Export Profile

#### GET /api/profiles/:id/export

Exports a profile in a clean JSON format suitable for import into AI platforms.

**Parameters:**
- `id` (string) - Profile ID

**Response:**
```json
{
  "name": "Code Assistant",
  "description": "Helps with programming tasks",
  "systemInstructions": "You are an expert programmer...",
  "initiationPrompt": "Hello! I'm ready to help with your code.",
  "temperature": 0.7,
  "maxTokens": 2000,
  "exportedAt": "2024-01-15T10:30:00.000Z"
}
```

---

## Prompts

### List All Prompts

#### GET /api/prompts

Returns an array of all prompts.

**Response:**
```json
[
  {
    "id": "1234567890",
    "title": "Code Review Prompt",
    "content": "Please review the following code...",
    "category": "coding",
    "tags": ["review", "code-quality"],
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Create Prompt

#### POST /api/prompts

Creates a new prompt.

**Request Body:**
```json
{
  "title": "Code Review Prompt",
  "content": "Please review the following code...",
  "category": "coding",
  "tags": ["review", "code-quality"]
}
```

**Response:**
```json
{
  "id": "1234567890",
  "title": "Code Review Prompt",
  "content": "Please review the following code...",
  "category": "coding",
  "tags": ["review", "code-quality"],
  "createdAt": "2024-01-15T10:30:00.000Z",
  "updatedAt": "2024-01-15T10:30:00.000Z"
}
```

### Update Prompt

#### PUT /api/prompts/:id

Updates an existing prompt.

**Parameters:**
- `id` (string) - Prompt ID

**Request Body:**
```json
{
  "title": "Updated Title",
  "content": "Updated content...",
  "category": "coding",
  "tags": ["updated", "tags"]
}
```

### Delete Prompt

#### DELETE /api/prompts/:id

Deletes a prompt.

**Parameters:**
- `id` (string) - Prompt ID

---

## Templates

### List All Templates

#### GET /api/templates

Returns an array of all templates.

**Response:**
```json
[
  {
    "id": "1234567890",
    "name": "Coding Assistant Template",
    "description": "A template for coding assistants",
    "systemInstructions": "You are an expert programmer...",
    "initiationPrompt": "Hello! I'm ready to help.",
    "category": "coding",
    "isPublic": true,
    "author": "John Doe",
    "createdAt": "2024-01-15T10:30:00.000Z",
    "updatedAt": "2024-01-15T10:30:00.000Z"
  }
]
```

### Create Template

#### POST /api/templates

Creates a new template.

**Request Body:**
```json
{
  "name": "Coding Assistant Template",
  "description": "A template for coding assistants",
  "systemInstructions": "You are an expert programmer...",
  "initiationPrompt": "Hello! I'm ready to help.",
  "category": "coding",
  "isPublic": true,
  "author": "John Doe"
}
```

### Update Template

#### PUT /api/templates/:id

Updates an existing template.

### Delete Template

#### DELETE /api/templates/:id

Deletes a template.

---

## Error Responses

All endpoints may return the following error responses:

**400 Bad Request:**
```json
{
  "error": "Invalid request parameters"
}
```

**404 Not Found:**
```json
{
  "error": "Resource not found"
}
```

**500 Internal Server Error:**
```json
{
  "error": "Internal server error message"
}
```

## Data Storage

Data is stored in JSON files in the `data/` directory:
- `data/profiles.json` - GPT profiles
- `data/prompts.json` - Prompts library
- `data/templates.json` - Template library

These files are created automatically when the server starts if they don't exist.
