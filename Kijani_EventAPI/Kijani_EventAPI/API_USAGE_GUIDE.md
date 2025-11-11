# Kijani Event API - Usage Guide

## Table of Contents
- [Introduction](#introduction)
- [Authentication](#authentication)
- [API Base URL](#api-base-url)
- [Complete CRUD Flow](#complete-crud-flow)
- [Event Endpoints](#event-endpoints)
- [Category Endpoints](#category-endpoints)
- [Error Handling](#error-handling)

---

## Introduction

The Kijani Event API is a RESTful API for managing community events. This guide provides practical examples of how to interact with the API using curl commands.

## Authentication

The API uses **HTTP Basic Authentication** for protected endpoints.

### Creating a User Account

First, you'll need to create a user account via Django admin or shell:

```bash
# Using Django shell
python manage.py shell

# In the shell:
from django.contrib.auth import get_user_model
User = get_user_model()

user = User.objects.create_user(
    username='johndoe',
    email='johndoe@example.com',
    password='securepassword123'
)
user.is_staff = True  # Required for creating/editing events
user.save()
exit()
```

### Authentication in Requests

For endpoints that require authentication, include credentials in your curl requests:

```bash
curl -u username:password http://localhost:8000/api/v1/events/
```

### Public vs Protected Endpoints

- **Public (No Auth Required)**:
  - GET requests to view events
  - GET requests to view categories

- **Protected (Auth Required)**:
  - POST - Create new events
  - PUT/PATCH - Update events (must be event organizer)
  - DELETE - Delete events (must be event organizer)

---

## API Base URL

```
http://localhost:8000/api/v1/events/
```

For production, replace `localhost:8000` with your actual domain.

---

## Complete CRUD Flow

This section demonstrates a complete workflow: creating an event, reading it, updating it, and finally deleting it.

### Step 1: Create an Event (CREATE)

**Endpoint**: `POST /api/v1/events/`

**Authentication**: Required (staff user)

```bash
curl -X POST http://localhost:8000/api/v1/events/ \
  -H "Content-Type: application/json" \
  -u johndoe:securepassword123 \
  -d '{
    "title": "Tech Meetup: Introduction to Django REST Framework",
    "description": "Join us for an exciting evening learning about building APIs with Django REST Framework. Perfect for beginners and intermediate developers.",
    "event_date": "2025-12-01T18:00:00Z",
    "end_date": "2025-12-01T21:00:00Z",
    "location": "Nairobi Innovation Hub, Ngong Road",
    "latitude": -1.286389,
    "longitude": 36.817223,
    "category": 1,
    "capacity": 50,
    "price": 0,
    "is_free": true,
    "registration_deadline": "2025-11-30T23:59:59Z",
    "allow_waitlist": false
  }'
```

**Success Response** (HTTP 201 Created):
```json
{
  "title": "Tech Meetup: Introduction to Django REST Framework",
  "description": "Join us for an exciting evening learning about building APIs with Django REST Framework. Perfect for beginners and intermediate developers.",
  "event_date": "2025-12-01T18:00:00Z",
  "end_date": "2025-12-01T21:00:00Z",
  "location": "Nairobi Innovation Hub, Ngong Road",
  "latitude": "-1.286389",
  "longitude": "36.817223",
  "category": 1,
  "capacity": 50,
  "price": "0.00",
  "is_free": true,
  "image_url": null,
  "registration_deadline": "2025-11-30T23:59:59Z",
  "allow_waitlist": false
}
```

**Note**: The API automatically generates a slug from the title: `tech-meetup-introduction-to-django-rest-framework`

---

### Step 2: Read Events (READ)

#### 2a. List All Events

**Endpoint**: `GET /api/v1/events/`

**Authentication**: Not required

```bash
curl http://localhost:8000/api/v1/events/
```

**Response**:
```json
{
  "count": 1,
  "next": null,
  "previous": null,
  "results": [
    {
      "id": 1,
      "title": "Tech Meetup: Introduction to Django REST Framework",
      "slug": "tech-meetup-introduction-to-django-rest-framework",
      "description": "Join us for an exciting evening learning about building APIs...",
      "event_date": "2025-12-01T18:00:00Z",
      "end_date": "2025-12-01T21:00:00Z",
      "location": "Nairobi Innovation Hub, Ngong Road",
      "organizer": {
        "id": 1,
        "username": "johndoe",
        "email": "johndoe@example.com"
      },
      "category": {
        "id": 1,
        "name": "Technology",
        "slug": "technology",
        "description": "Tech events and meetups",
        "icon": null,
        "event_count": 1
      },
      "capacity": 50,
      "current_attendees": 0,
      "available_spots": 50,
      "price": "0.00",
      "is_free": true,
      "status": "upcoming",
      "image_url": null,
      "is_full": false,
      "is_published": true,
      "created_at": "2025-10-19T09:00:00.000000Z"
    }
  ]
}
```

#### 2b. Get Single Event by Slug

**Endpoint**: `GET /api/v1/events/<slug>/`

**Authentication**: Not required

```bash
curl http://localhost:8000/api/v1/events/tech-meetup-introduction-to-django-rest-framework/
```

**Response**:
```json
{
  "id": 1,
  "title": "Tech Meetup: Introduction to Django REST Framework",
  "slug": "tech-meetup-introduction-to-django-rest-framework",
  "description": "Join us for an exciting evening learning about building APIs...",
  "event_date": "2025-12-01T18:00:00Z",
  "end_date": "2025-12-01T21:00:00Z",
  "location": "Nairobi Innovation Hub, Ngong Road",
  "latitude": "-1.286389",
  "longitude": "36.817223",
  "organizer": {
    "id": 1,
    "username": "johndoe",
    "email": "johndoe@example.com"
  },
  "category": {
    "id": 1,
    "name": "Technology",
    "slug": "technology",
    "description": "Tech events and meetups",
    "icon": null,
    "event_count": 1
  },
  "capacity": 50,
  "current_attendees": 0,
  "available_spots": 50,
  "price": "0.00",
  "is_free": true,
  "status": "upcoming",
  "image_url": null,
  "registration_deadline": "2025-11-30T23:59:59Z",
  "is_published": true,
  "allow_waitlist": false,
  "is_full": false,
  "is_past": false,
  "is_upcoming": true,
  "can_register": true,
  "created_at": "2025-10-19T09:00:00.000000Z",
  "updated_at": "2025-10-19T09:00:00.000000Z"
}
```

#### 2c. Get Upcoming Events Only

**Endpoint**: `GET /api/v1/events/upcoming/`

**Authentication**: Not required

```bash
curl http://localhost:8000/api/v1/events/upcoming/
```

#### 2d. Search Events

**Endpoint**: `GET /api/v1/events/?search=<query>`

```bash
# Search by title, description, or location
curl "http://localhost:8000/api/v1/events/?search=Django"
```

---

### Step 3: Update Event (UPDATE)

You can update events using either **PATCH** (partial update) or **PUT** (full update).

#### 3a. Partial Update with PATCH

**Endpoint**: `PATCH /api/v1/events/<slug>/`

**Authentication**: Required (must be the event organizer)

```bash
# Update only capacity and add image
curl -X PATCH http://localhost:8000/api/v1/events/tech-meetup-introduction-to-django-rest-framework/ \
  -H "Content-Type: application/json" \
  -u johndoe:securepassword123 \
  -d '{
    "capacity": 75,
    "image_url": "https://example.com/images/django-meetup.jpg"
  }'
```

**Success Response** (HTTP 200 OK):
```json
{
  "title": "Tech Meetup: Introduction to Django REST Framework",
  "description": "Join us for an exciting evening learning about building APIs...",
  "event_date": "2025-12-01T18:00:00Z",
  "end_date": "2025-12-01T21:00:00Z",
  "location": "Nairobi Innovation Hub, Ngong Road",
  "latitude": "-1.286389",
  "longitude": "36.817223",
  "category": 1,
  "capacity": 75,
  "price": "0.00",
  "is_free": true,
  "image_url": "https://example.com/images/django-meetup.jpg",
  "registration_deadline": "2025-11-30T23:59:59Z",
  "allow_waitlist": false
}
```

#### 3b. Full Update with PUT

**Endpoint**: `PUT /api/v1/events/<slug>/`

**Authentication**: Required (must be the event organizer)

```bash
# Complete replacement of event data
curl -X PUT http://localhost:8000/api/v1/events/tech-meetup-introduction-to-django-rest-framework/ \
  -H "Content-Type: application/json" \
  -u johndoe:securepassword123 \
  -d '{
    "title": "Advanced Django REST Framework Workshop",
    "description": "Deep dive into advanced DRF concepts including viewsets, serializers, and authentication. Bring your laptop!",
    "event_date": "2025-12-05T14:00:00Z",
    "end_date": "2025-12-05T18:00:00Z",
    "location": "iHub Nairobi, Bishop Magua Centre",
    "latitude": -1.293197,
    "longitude": 36.787536,
    "category": 1,
    "capacity": 30,
    "price": 1500.00,
    "is_free": false,
    "image_url": "https://example.com/images/advanced-drf.jpg",
    "registration_deadline": "2025-12-04T23:59:59Z",
    "allow_waitlist": true
  }'
```

**Success Response** (HTTP 200 OK): Returns the fully updated event data.

---

### Step 4: Delete Event (DELETE)

**Endpoint**: `DELETE /api/v1/events/<slug>/`

**Authentication**: Required (must be the event organizer)

```bash
curl -X DELETE http://localhost:8000/api/v1/events/tech-meetup-introduction-to-django-rest-framework/ \
  -u johndoe:securepassword123
```

**Success Response**: HTTP 204 No Content (empty response body)

#### Verify Deletion

```bash
# Try to retrieve the deleted event
curl http://localhost:8000/api/v1/events/tech-meetup-introduction-to-django-rest-framework/
```

**Response** (HTTP 404 Not Found):
```json
{
  "error": "http404",
  "message": "No Event matches the given query.",
  "details": {
    "detail": "No Event matches the given query."
  },
  "timestamp": "2025-10-19T09:30:00.000000+00:00"
}
```

---

## Event Endpoints

### Complete Endpoint Reference

| Method | Endpoint | Description | Auth Required |
|--------|----------|-------------|---------------|
| GET | `/api/v1/events/` | List all published events | No |
| POST | `/api/v1/events/` | Create a new event | Yes (staff) |
| GET | `/api/v1/events/upcoming/` | List upcoming events only | No |
| GET | `/api/v1/events/<slug>/` | Get event details | No |
| PUT | `/api/v1/events/<slug>/` | Full update of event | Yes (organizer) |
| PATCH | `/api/v1/events/<slug>/` | Partial update of event | Yes (organizer) |
| DELETE | `/api/v1/events/<slug>/` | Delete event | Yes (organizer) |

### Required Fields for Creating Events

```json
{
  "title": "string (required)",
  "description": "string (required)",
  "event_date": "datetime (required, must be in future)",
  "location": "string (required)",
  "capacity": "integer (required, min: 1)"
}
```

### Optional Fields

```json
{
  "end_date": "datetime",
  "registration_deadline": "datetime",
  "latitude": "decimal",
  "longitude": "decimal",
  "category": "integer (category ID)",
  "price": "decimal (default: 0.00)",
  "is_free": "boolean (default: true)",
  "image_url": "string (URL)",
  "allow_waitlist": "boolean (default: false)"
}
```

### Auto-Generated Fields

These fields are automatically set by the system:

- `id`: Unique identifier
- `slug`: URL-friendly version of title
- `organizer`: Set to authenticated user
- `current_attendees`: Defaults to 0
- `status`: Auto-calculated based on dates (upcoming/ongoing/completed)
- `created_at`: Timestamp of creation
- `updated_at`: Timestamp of last update

---

## Category Endpoints

### List All Categories

```bash
curl http://localhost:8000/api/v1/categories/
```

### Get Category Details with Events

```bash
curl http://localhost:8000/api/v1/categories/<slug>/
```

**Example Response**:
```json
{
  "id": 1,
  "name": "Technology",
  "slug": "technology",
  "description": "Tech events and meetups",
  "icon": "💻",
  "event_count": 5,
  "upcoming_events": [
    {
      "id": 1,
      "title": "Django Workshop",
      "slug": "django-workshop",
      "event_date": "2025-12-01T18:00:00Z",
      ...
    }
  ]
}
```

---

## Error Handling

### Common Error Responses

#### 400 Bad Request - Validation Error

```json
{
  "error": "validationerror",
  "message": "Invalid input data",
  "details": {
    "event_date": ["Event date must be in the future."],
    "capacity": ["Capacity must be at least 1."]
  },
  "timestamp": "2025-10-19T09:00:00.000000+00:00"
}
```

#### 401 Unauthorized - Missing Authentication

```json
{
  "error": "authenticationfailed",
  "message": "Authentication credentials were not provided.",
  "details": {
    "detail": "Authentication credentials were not provided."
  },
  "timestamp": "2025-10-19T09:00:00.000000+00:00"
}
```

#### 403 Forbidden - Permission Denied

```json
{
  "error": "permissiondenied",
  "message": "You do not have permission to perform this action.",
  "details": {
    "detail": "You do not have permission to perform this action."
  },
  "timestamp": "2025-10-19T09:00:00.000000+00:00"
}
```

#### 404 Not Found

```json
{
  "error": "http404",
  "message": "No Event matches the given query.",
  "details": {
    "detail": "No Event matches the given query."
  },
  "timestamp": "2025-10-19T09:00:00.000000+00:00"
}
```

---

## Complete Example Workflow

Here's a complete example of creating and managing an event from start to finish:

```bash
# 1. Create a paid event
curl -X POST http://localhost:8000/api/v1/events/ \
  -H "Content-Type: application/json" \
  -u johndoe:securepassword123 \
  -d '{
    "title": "Startup Networking Night",
    "description": "Connect with fellow entrepreneurs and startup founders over drinks and conversations.",
    "event_date": "2025-11-25T19:00:00Z",
    "end_date": "2025-11-25T22:00:00Z",
    "location": "The Hub Karen, Karen Road",
    "latitude": -1.319659,
    "longitude": 36.709099,
    "category": 2,
    "capacity": 100,
    "price": 2000.00,
    "is_free": false,
    "registration_deadline": "2025-11-24T18:00:00Z",
    "allow_waitlist": true,
    "image_url": "https://example.com/startup-night.jpg"
  }'

# 2. View the created event
curl http://localhost:8000/api/v1/events/startup-networking-night/

# 3. Update event capacity due to high demand
curl -X PATCH http://localhost:8000/api/v1/events/startup-networking-night/ \
  -H "Content-Type: application/json" \
  -u johndoe:securepassword123 \
  -d '{"capacity": 150}'

# 4. Search for events in a location
curl "http://localhost:8000/api/v1/events/?search=Karen"

# 5. List all upcoming events
curl http://localhost:8000/api/v1/events/upcoming/

# 6. Delete the event if cancelled
curl -X DELETE http://localhost:8000/api/v1/events/startup-networking-night/ \
  -u johndoe:securepassword123
```

---

## Tips and Best Practices

1. **Date Formats**: Always use ISO 8601 format with UTC timezone (e.g., `2025-12-01T18:00:00Z`)

2. **Slugs**: The system auto-generates URL-friendly slugs from titles. Use these slugs in URLs, not IDs.

3. **Permissions**:
   - Users must be staff members to create events
   - Only event organizers can update or delete their events

4. **Validation**:
   - Event dates must be in the future
   - End date must be after event date
   - Registration deadline must be before event date
   - Capacity cannot be reduced below current attendees

5. **Pagination**: List endpoints return paginated results (default: 10 items per page)
   - Use `?page=2` to get the next page
   - Check `next` and `previous` fields in response

6. **Search**: The search parameter works across title, description, and location fields

---

## Running the Development Server

```bash
# Activate virtual environment
source venv/bin/activate

# Run migrations
python manage.py migrate

# Create superuser (for admin access)
python manage.py createsuperuser

# Start server
python manage.py runserver
```

Access the API at: `http://localhost:8000/api/v1/events/`

Access the admin panel at: `http://localhost:8000/admin/`

---

## Support

For issues or questions:
- Check the Django REST Framework documentation: https://www.django-rest-framework.org/
- Review the Django documentation: https://docs.djangoproject.com/

Happy event organizing with Kijani Event API! 🌱
