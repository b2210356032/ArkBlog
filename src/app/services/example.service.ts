import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService, RequestParameters } from './http-client.service';

// Example interfaces
export interface User {
  id?: number;
  name: string;
  email: string;
  age?: number;
}

export interface Post {
  id?: number;
  title: string;
  content: string;
  authorId: number;
  createdAt?: Date;
}

@Injectable({
  providedIn: 'root'
})
export class ExampleService {
  constructor(private httpClientService: HttpClientService) { }

  // GET - Get all users
  getUsers(): Observable<User[]> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'users',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<User[]>(requestParameter);
  }

  // GET - Get user by ID
  getUserById(id: string): Observable<User> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'users',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<User>(requestParameter, id);
  }

  // POST - Create new user
  createUser(user: User): Observable<User> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'users',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.post<User>(requestParameter, user);
  }

  // PUT - Update user
  updateUser(user: User): Observable<User> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'users',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.put<User>(requestParameter, user);
  }

  // PATCH - Partial update user
  patchUser(user: Partial<User>): Observable<User> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'users',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.patch<User>(requestParameter, user);
  }

  // DELETE - Delete user
  deleteUser(id: string): Observable<any> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'users',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.delete<any>(requestParameter, id);
  }

  // GET - Get posts with query parameters
  getPosts(page: number = 1, limit: number = 10): Observable<Post[]> {
    const queryParams = this.httpClientService.buildQueryString({ page, limit });
    const requestParameter: Partial<RequestParameters> = {
      controller: 'posts',
      queryString: queryParams,
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<Post[]>(requestParameter);
  }

  // POST - Create post with authorization
  createPost(post: Post, authToken: string): Observable<Post> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'posts',
      headers: this.httpClientService.createHeaders('application/json', `Bearer ${authToken}`)
    };
    return this.httpClientService.post<Post>(requestParameter, post);
  }

  // File upload example
  uploadUserAvatar(userId: string, file: File): Observable<any> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'users',
      action: 'avatar',
      queryString: `userId=${userId}`,
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.uploadFile<any>(requestParameter, file, 'avatar');
  }

  // File download example
  downloadUserDocument(userId: string, documentId: string): Observable<Blob> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'users',
      action: 'documents',
      queryString: `userId=${userId}`,
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.downloadFile(requestParameter, documentId);
  }

  // Using full endpoint URL
  getExternalData(): Observable<any> {
    const requestParameter: Partial<RequestParameters> = {
      fullEndPoint: 'https://jsonplaceholder.typicode.com/posts',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<any>(requestParameter);
  }

  // Using custom base URL
  getCustomApiData(): Observable<any> {
    const requestParameter: Partial<RequestParameters> = {
      baseUrl: 'https://api.custom.com',
      controller: 'data',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<any>(requestParameter);
  }
} 