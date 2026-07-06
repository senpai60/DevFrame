# DevFrame Backend API Documentation

This documentation provides frontend developers with the details needed to integrate the Authentication API into the client application. The system uses a JWT-based stateless architecture along with GitHub OAuth for logging in.

## Base URL
The API base URL for authentication endpoints is:
```text
http://localhost:3000/api/v1/auth
```

---

## Authentication Flow Overview

1. **Login**: The frontend redirects the user to the `/github` endpoint.
2. **OAuth Callback**: GitHub redirects the user back to the backend. The backend authenticates the user, generates access and refresh tokens, sets the refresh token in an `HttpOnly` cookie, and redirects the user to the frontend (e.g., `/dashboard?token=<access_token>`).
3. **Session Management**: The frontend stores the `access_token` in memory (or local storage). The refresh token lives in an `HttpOnly` cookie and is sent automatically by the browser to the backend when needed.
4. **Refreshing Tokens**: Before the `access_token` expires (every 15m), the frontend calls the `/refresh` endpoint to get a new one.

---

## API Endpoints

### 1. Initiate GitHub Login
- **URL**: `GET /api/v1/auth/github`
- **Description**: Redirect the user to this URL to start the OAuth flow. Do not use AJAX/Fetch for this; you must perform a full browser navigation (`window.location.href = 'http://localhost:3000/api/v1/auth/github'`).

### 2. Get Current User Profile
- **URL**: `GET /api/v1/auth/me`
- **Headers Required**: 
  - `Authorization: Bearer <access_token>`
- **Description**: Fetches the currently authenticated user's details.
- **Response (200 OK)**:
  ```json
  {
    "user": {
      "_id": "...",
      "name": "John Doe",
      "username": "johndoe",
      "email": "john@example.com",
      "avatar": "https://..."
    }
  }
  ```
- **Error (401 Unauthorized)**: Token is missing, invalid, or expired.

### 3. Refresh Access Token
- **URL**: `POST /api/v1/auth/refresh`
- **Description**: Call this endpoint when your `access_token` expires to retrieve a new one. The backend will read the secure `HttpOnly` cookie (`devframe_token`) automatically.
- **Important Requirement**: You must configure your request to include credentials (cookies) to send the `HttpOnly` cookie.
- **Response (200 OK)**:
  ```json
  {
    "accessToken": "eyJhbGciOiJIUzI1NiIsInR..."
  }
  ```
- **Error (401 Unauthorized)**: The refresh token in the cookie has expired, or the user logged out.

### 4. Logout
- **URL**: `POST /api/v1/auth/logout`
- **Description**: Invalidates the current session by clearing the database refresh token and deleting the browser cookie.
- **Important Requirement**: You must configure your request to include credentials.
- **Response (200 OK)**:
  ```json
  {
    "message": "Logged out successfully"
  }
  ```

---

## Frontend Integration Tips

### Handling CORS & Cookies (Important!)
Since refresh tokens are stored in an `HttpOnly` cookie, **all authentication-related requests that need the cookie (`/refresh` and `/logout`) must include credentials**. 

If you are using **Axios**, configure it globally:
```javascript
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:3000/api/v1",
  withCredentials: true, // MUST BE TRUE to send/receive cookies
});

// To attach the access token to authenticated requests:
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("accessToken"); // Or your state management store
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export default api;
```

If you are using **Fetch API**, make sure to add `credentials: 'include'`:
```javascript
fetch("http://localhost:3000/api/v1/auth/refresh", {
  method: "POST",
  credentials: "include", // MUST BE INCLUDED
})
```

### Retrieving the Token on Login
When the user successfully logs in through GitHub, the backend will redirect them to your frontend URL:
`http://localhost:3000/dashboard?token=eyJhbGci...`

On your frontend router (e.g., in React inside the Dashboard component), check for the `token` URL query parameter, save it to your state/local storage, and clean up the URL:
```javascript
import { useEffect } from "react";
import { useSearchParams } from "react-router-dom";

function Dashboard() {
  const [searchParams, setSearchParams] = useSearchParams();

  useEffect(() => {
    const token = searchParams.get("token");
    if (token) {
      // Save token in memory or localStorage
      localStorage.setItem("accessToken", token);
      
      // Clean up the URL
      searchParams.delete("token");
      setSearchParams(searchParams);
    }
  }, []);

  return <div>Welcome to Dashboard!</div>;
}
```
