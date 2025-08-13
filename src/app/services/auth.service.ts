import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService, RequestParameters } from './http-client.service';

// Login request interface
export interface LoginRequest {
  UsernameOrEmail: string;
  password: string;
}

// Register request interface
export interface RegisterRequest {
  NameSurname: string;
  Username: string;
  Email: string;
  Password: string;
  PasswordConfirm: string;
}

// Login response interface
export interface LoginResponse {
  succeeded: boolean;
  token?: {
    accessToken: string;
    expiration: string;
  };
  user?: {
    id?: string;  // lowercase for JSON serialization
    Id?: string;  // uppercase fallback
    userName?: string;
    UserName?: string;
    email?: string;
    Email?: string;
    nameSurname?: string;
    NameSurname?: string;
  };
}

// Register response interface
export interface RegisterResponse {
  succeeded: boolean;
  message?: string;
}

// Legacy AuthResponse for backward compatibility
export interface AuthResponse {
  success: boolean;
  message?: string;
  Token?: {
    accessToken: string;
    expiration: string;
  };
  User?: {
    id: string;
    userName: string;
    email: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  constructor(private httpClientService: HttpClientService) { }

  // Login user
  login(loginData: LoginRequest): Observable<LoginResponse> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'api/AppUser',
      action: 'LogIn',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.post<LoginResponse, LoginRequest>(requestParameter, loginData);
  }

  // Register user
  register(registerData: RegisterRequest): Observable<RegisterResponse> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'api/AppUser',
      action: 'Register',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.post<RegisterResponse, RegisterRequest>(requestParameter, registerData);
  }

  // Store auth token
  setToken(token: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('auth_token', token);
    }
  }

  // Get auth token
  getToken(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('auth_token');
    }
    return null;
  }

  // Remove auth token (logout)
  logout(): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.removeItem('auth_token');
      localStorage.removeItem('user_id');
    }
  }

  // Check if user is authenticated
  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  setUserId(userId: string): void {
    if (typeof window !== 'undefined' && window.localStorage) {
      localStorage.setItem('user_id', userId);
    }
  }

  getUserId(): string | null {
    if (typeof window !== 'undefined' && window.localStorage) {
      return localStorage.getItem('user_id');
    }
    return null;
  }
} 