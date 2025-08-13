# HTTP Client Service Documentation

This service provides a comprehensive HTTP client wrapper for Angular applications with built-in error handling, retry logic, and utility methods.

## Features

- ✅ **CRUD Operations**: GET, POST, PUT, PATCH, DELETE
- ✅ **File Operations**: Upload and download files
- ✅ **Error Handling**: Built-in error handling with retry logic
- ✅ **Timeout Management**: Configurable timeouts for different operations
- ✅ **Header Management**: Easy header creation and management
- ✅ **Query String Building**: Utility method for building query strings
- ✅ **Flexible URL Building**: Support for custom base URLs and full endpoints

## Setup

### 1. App Configuration

Update your `app.config.ts` to include the HTTP client providers:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideHttpClient(withInterceptorsFromDi()),
    {
      provide: 'baseUrl',
      useValue: 'https://your-api-base-url.com' // Replace with your API URL
    }
  ]
};
```

### 2. Import the Service

```typescript
import { HttpClientService, RequestParameters } from './services/http-client.service';
```

## Basic Usage

### GET Request

```typescript
// Get all users
getUsers(): Observable<User[]> {
  const requestParameter: Partial<RequestParameters> = {
    controller: 'users',
    headers: this.httpClientService.createHeaders()
  };
  return this.httpClientService.get<User[]>(requestParameter);
}

// Get user by ID
getUserById(id: string): Observable<User> {
  const requestParameter: Partial<RequestParameters> = {
    controller: 'users',
    headers: this.httpClientService.createHeaders()
  };
  return this.httpClientService.get<User>(requestParameter, id);
}
```

### POST Request

```typescript
// Create new user
createUser(user: User): Observable<User> {
  const requestParameter: Partial<RequestParameters> = {
    controller: 'users',
    headers: this.httpClientService.createHeaders()
  };
  return this.httpClientService.post<User>(requestParameter, user);
}
```

### PUT Request

```typescript
// Update user
updateUser(user: User): Observable<User> {
  const requestParameter: Partial<RequestParameters> = {
    controller: 'users',
    headers: this.httpClientService.createHeaders()
  };
  return this.httpClientService.put<User>(requestParameter, user);
}
```

### DELETE Request

```typescript
// Delete user
deleteUser(id: string): Observable<any> {
  const requestParameter: Partial<RequestParameters> = {
    controller: 'users',
    headers: this.httpClientService.createHeaders()
  };
  return this.httpClientService.delete<any>(requestParameter, id);
}
```

## Advanced Usage

### Query Parameters

```typescript
// Get posts with pagination
getPosts(page: number = 1, limit: number = 10): Observable<Post[]> {
  const queryParams = this.httpClientService.buildQueryString({ page, limit });
  const requestParameter: Partial<RequestParameters> = {
    controller: 'posts',
    queryString: queryParams,
    headers: this.httpClientService.createHeaders()
  };
  return this.httpClientService.get<Post[]>(requestParameter);
}
```

### Authorization Headers

```typescript
// Create post with authorization
createPost(post: Post, authToken: string): Observable<Post> {
  const requestParameter: Partial<RequestParameters> = {
    controller: 'posts',
    headers: this.httpClientService.createHeaders('application/json', `Bearer ${authToken}`)
  };
  return this.httpClientService.post<Post>(requestParameter, post);
}
```

### File Upload

```typescript
// Upload user avatar
uploadUserAvatar(userId: string, file: File): Observable<any> {
  const requestParameter: Partial<RequestParameters> = {
    controller: 'users',
    action: 'avatar',
    queryString: `userId=${userId}`,
    headers: this.httpClientService.createHeaders()
  };
  return this.httpClientService.uploadFile<any>(requestParameter, file, 'avatar');
}
```

### File Download

```typescript
// Download user document
downloadUserDocument(userId: string, documentId: string): Observable<Blob> {
  const requestParameter: Partial<RequestParameters> = {
    controller: 'users',
    action: 'documents',
    queryString: `userId=${userId}`,
    headers: this.httpClientService.createHeaders()
  };
  return this.httpClientService.downloadFile(requestParameter, documentId);
}
```

### Custom Base URL

```typescript
// Use custom base URL
getCustomApiData(): Observable<any> {
  const requestParameter: Partial<RequestParameters> = {
    baseUrl: 'https://api.custom.com',
    controller: 'data',
    headers: this.httpClientService.createHeaders()
  };
  return this.httpClientService.get<any>(requestParameter);
}
```

### Full Endpoint URL

```typescript
// Use full endpoint URL
getExternalData(): Observable<any> {
  const requestParameter: Partial<RequestParameters> = {
    fullEndPoint: 'https://jsonplaceholder.typicode.com/posts',
    headers: this.httpClientService.createHeaders()
  };
  return this.httpClientService.get<any>(requestParameter);
}
```

## RequestParameters Interface

```typescript
export class RequestParameters {
  controller?: string;        // API controller name
  action?: string;           // API action name
  queryString?: string;      // Query string parameters
  
  headers?: HttpHeaders;     // HTTP headers
  baseUrl?: string;         // Custom base URL
  fullEndPoint?: string;    // Full endpoint URL
  
  responseType?: string = 'json'; // Response type
}
```

## Error Handling

The service includes built-in error handling with:
- **Retry Logic**: Automatically retries failed requests once
- **Timeout Management**: 30 seconds for regular requests, 60 seconds for file operations
- **Error Logging**: Logs errors to console
- **Error Propagation**: Throws errors for component handling

## Component Usage Example

```typescript
import { Component, OnInit } from '@angular/core';
import { ExampleService, User } from './services/example.service';

@Component({
  selector: 'app-users',
  template: `
    <div *ngFor="let user of users">
      <h3>{{ user.name }}</h3>
      <p>{{ user.email }}</p>
    </div>
  `
})
export class UsersComponent implements OnInit {
  users: User[] = [];

  constructor(private exampleService: ExampleService) {}

  ngOnInit() {
    this.loadUsers();
  }

  loadUsers() {
    this.exampleService.getUsers().subscribe({
      next: (users) => {
        this.users = users;
      },
      error: (error) => {
        console.error('Error loading users:', error);
        // Handle error (show toast, redirect, etc.)
      }
    });
  }

  createUser() {
    const newUser: User = {
      name: 'John Doe',
      email: 'john@example.com',
      age: 30
    };

    this.exampleService.createUser(newUser).subscribe({
      next: (user) => {
        console.log('User created:', user);
        this.loadUsers(); // Reload the list
      },
      error: (error) => {
        console.error('Error creating user:', error);
      }
    });
  }
}
```

## Best Practices

1. **Always handle errors** in your components
2. **Use TypeScript interfaces** for type safety
3. **Create specific services** for different API endpoints
4. **Use the utility methods** for common operations
5. **Set appropriate timeouts** for different operations
6. **Handle file operations** with proper error handling

## Configuration Options

- **Base URL**: Set in app.config.ts
- **Timeouts**: 30s for regular requests, 60s for file operations
- **Retry Count**: 1 retry for failed requests
- **Response Type**: Default is 'json', can be overridden per request 