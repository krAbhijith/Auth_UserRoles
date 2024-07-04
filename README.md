```markdown
# Authentication API Documentation

## Base URL
`/api`

## Authentication
Most endpoints require authentication. Include the JWT token in the Authorization header:
`Authorization: Bearer <token>`

## Endpoints

### 1. Create User
Creates a new user account.

- **URL:** `/users`
- **Method:** `POST`
- **Auth required:** Yes
- **Permissions:** Admin can create any role, Manager can create User role

#### Request Body
```json
{
  "user": {
    "name": "string",
    "email": "string",
    "password": "string",
    "role": "string",
    "bio": "string" (optional)
  }
}
```

#### Success Response
- **Code:** 200 OK
- **Content:**
```json
{
  "user": {
    "name": "string",
    "email": "string",
    "role": "string",
    "bio": "string",
    "token": "string"
  }
}
```

#### Error Response
- **Code:** 400 BAD REQUEST
- **Content:** `{ "error": "invalid user role" }`

- **Code:** 401 UNAUTHORIZED
- **Content:** `{ "error": "You don't have permission for creating <role>" }`

### 2. User Login
Authenticates a user and returns user data.

- **URL:** `/users/login`
- **Method:** `POST`
- **Auth required:** No

#### Request Body
```json
{
  "user": {
    "email": "string",
    "password": "string"
  }
}
```

#### Success Response
- **Code:** 200 OK
- **Content:**
```json
{
  "user": {
    "name": "string",
    "email": "string",
    "role": "string",
    "bio": "string",
    "token": "string"
  }
}
```

#### Error Response
- **Code:** 400 BAD REQUEST
- **Content:** `{ "error": "Invalid login credentials" }`

### 3. Get Current User
Retrieves the current logged-in user's information.

- **URL:** `/user`
- **Method:** `GET`
- **Auth required:** Yes

#### Success Response
- **Code:** 200 OK
- **Content:**
```json
{
  "user": {
    "name": "string",
    "email": "string",
    "role": "string",
    "bio": "string"
  }
}
```

### 4. Update Current User
Updates the current logged-in user's information.

- **URL:** `/user`
- **Method:** `PUT`
- **Auth required:** Yes

#### Request Body
```json
{
  "user": {
    "name": "string",
    "password": "string",
    "email": "string", (only for admin)
    "role": "string", (only for admin)
    "bio": "string" (only for admin)
  }
}
```

#### Success Response
- **Code:** 200 OK
- **Content:**
```json
{
  "user": {
    "name": "string",
    "email": "string",
    "role": "string",
    "bio": "string"
  }
}
```

#### Error Response
- **Code:** 400 BAD REQUEST
- **Content:** `{ "error": "Invalid update" }`

### 5. Update User by Email
Updates a user's information by their email. Admin and Manager.

- **URL:** `/user/:email`
- **Method:** `PUT`
- **Auth required:** Yes
- **Permissions:** Admin, Manager

#### Request Body
```json
{
  "user": {
    "name": "string",
    "email": "string",
    "password": "string",
    "bio": "string",
    "role": "string" (only for admin)
  }
}
```

#### Success Response
- **Code:** 200 OK
- **Content:**
```json
{
  "user": {
    "name": "string",
    "email": "string",
    "role": "string",
    "bio": "string"
  }
}
```

#### Error Response
- **Code:** 404 NOT FOUND
- **Content:** `{ "error": "User not found" }`

- **Code:** 401 UNAUTHORIZED
- **Content:** `{ "error": "Invalid update" }`

### 6. Delete Current User
Deletes the current logged-in user's account.

- **URL:** `/user`
- **Method:** `DELETE`
- **Auth required:** Yes

#### Success Response
- **Code:** 200 OK
- **Content:** `{ "message": "User deleted successfully" }`

#### Error Response
- **Code:** 400 BAD REQUEST
- **Content:** `{ "error": "You are the only admin. You cannot perform this action" }`

### 7. Delete User by Email
Deletes a user's account by their email. Admin can delete all kind of users and manager can delete user accounts.

- **URL:** `/user/:email`
- **Method:** `DELETE`
- **Auth required:** Yes
- **Permissions:** Admin, Manager

#### Success Response
- **Code:** 200 OK
- **Content:** `{ "message": "User deleted successfully" }`

#### Error Response
- **Code:** 404 NOT FOUND
- **Content:** `{ "error": "User not found" }`

- **Code:** 401 UNAUTHORIZED
- **Content:** `{ "error": "You don't have permission to perform this action" }`

## Error Handling
The API uses the following error codes:

- 400: Bad Request
- 401: Unauthorized
- 404: Not Found
- 500: Internal Server Error

Error responses will include a JSON object with an `error` key explaining the error.

## User Roles
The API supports the following user roles:
- ADMIN
- MANAGER
- USER

Different roles have different permissions for creating and updating users.
```