import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService, LoginRequest } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="auth-overlay">
      <div class="auth-modal">
        <div class="auth-header">
          <h2>Login</h2>
          <button class="close-btn" (click)="onClose()">×</button>
        </div>
        
        <form (ngSubmit)="onSubmit()" #loginForm="ngForm" class="auth-form">
          <div class="form-group">
            <label for="emailOrUsername">Email or Username</label>
            <input 
              type="text" 
              id="emailOrUsername"
              name="emailOrUsername"
              [(ngModel)]="loginData.UsernameOrEmail"
              required
              class="form-input"
              placeholder="Enter your email or username"
            >
          </div>
          
          <div class="form-group">
            <label for="password">Password</label>
            <input 
              type="password" 
              id="password"
              name="password"
              [(ngModel)]="loginData.password"
              required
              class="form-input"
              placeholder="Enter your password"
            >
          </div>
          
          <div class="form-actions">
            <button type="button" class="btn-secondary" (click)="onClose()">Cancel</button>
            <button type="submit" class="btn-primary" [disabled]="isLoading || !loginForm.valid">
              <span *ngIf="isLoading">Logging in...</span>
              <span *ngIf="!isLoading">Login</span>
            </button>
          </div>
        </form>
        
        <div class="auth-footer">
          <p>Don't have an account? <button class="link-btn" (click)="onSwitchToRegister()">Register</button></p>
        </div>
        
        <div class="error-message" *ngIf="errorMessage">
          {{ errorMessage }}
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-overlay {
      position: fixed;
      top: 0;
      left: 0;
      width: 100vw;
      height: 100vh;
      background: rgba(0, 0, 0, 0.5);
      display: flex;
      align-items: center;
      justify-content: center;
      z-index: 2000;
    }

    .auth-modal {
      background: white;
      border-radius: 12px;
      padding: 2rem;
      width: 100%;
      max-width: 400px;
      box-shadow: 0 10px 25px rgba(0, 0, 0, 0.2);
      position: relative;
    }

    .auth-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      margin-bottom: 2rem;
    }

    .auth-header h2 {
      margin: 0;
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
    }

    .close-btn {
      background: none;
      border: none;
      font-size: 1.5rem;
      color: #6c757d;
      cursor: pointer;
      padding: 0.25rem;
      border-radius: 4px;
      transition: background-color 0.2s;
    }

    .close-btn:hover {
      background: #e9ecef;
    }

    .auth-form {
      display: flex;
      flex-direction: column;
      gap: 1.5rem;
    }

    .form-group {
      display: flex;
      flex-direction: column;
      gap: 0.5rem;
    }

    .form-group label {
      font-weight: 500;
      color: #495057;
      font-size: 0.875rem;
    }

    .form-input {
      padding: 0.75rem;
      border: 1px solid #ced4da;
      border-radius: 6px;
      font-size: 1rem;
      transition: border-color 0.2s;
    }

    .form-input:focus {
      outline: none;
      border-color: #3b82f6;
      box-shadow: 0 0 0 3px rgba(59, 130, 246, 0.1);
    }

    .form-actions {
      display: flex;
      gap: 1rem;
      margin-top: 1rem;
    }

    .btn-primary, .btn-secondary {
      flex: 1;
      padding: 0.75rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
    }

    .btn-primary:hover:not(:disabled) {
      background: #2563eb;
    }

    .btn-primary:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }

    .btn-secondary {
      background: #6c757d;
      color: white;
    }

    .btn-secondary:hover {
      background: #5a6268;
    }

    .auth-footer {
      text-align: center;
      margin-top: 1.5rem;
      padding-top: 1.5rem;
      border-top: 1px solid #e9ecef;
    }

    .auth-footer p {
      margin: 0;
      color: #6c757d;
      font-size: 0.875rem;
    }

    .link-btn {
      background: none;
      border: none;
      color: #3b82f6;
      cursor: pointer;
      font-size: 0.875rem;
      text-decoration: underline;
    }

    .link-btn:hover {
      color: #2563eb;
    }

    .error-message {
      background: #f8d7da;
      color: #721c24;
      padding: 0.75rem;
      border-radius: 6px;
      margin-top: 1rem;
      font-size: 0.875rem;
      border: 1px solid #f5c6cb;
    }

    @media (max-width: 480px) {
      .auth-modal {
        margin: 1rem;
        padding: 1.5rem;
      }
    }
  `]
})
export class LoginComponent {
  @Output() close = new EventEmitter<void>();
  @Output() switchToRegister = new EventEmitter<void>();
  @Output() loginSuccess = new EventEmitter<void>();

  loginData: LoginRequest = {
    UsernameOrEmail: '',
    password: ''
  };

  isLoading = false;
  errorMessage = '';

  constructor(private authService: AuthService) {}

  onSubmit() {
    if (!this.loginData.UsernameOrEmail || !this.loginData.password) {
      this.errorMessage = 'Please fill in all fields';
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';

    this.authService.login(this.loginData).subscribe({
      next: (response) => {
        this.isLoading = false;
        console.log('Login response:', response); // Debug log
        console.log('Response succeeded:', response.succeeded);
        console.log('Response token:', response.token);
        console.log('Response user:', response.user);
        debugger;
        if (response.succeeded && response.token?.accessToken) {
          debugger;
          this.authService.setToken(response.token.accessToken);
          if (response.user) {
            debugger;
            // Try to get user ID from different possible property names
            const userId = response.user.id || response.user.Id;
            console.log('User ID found:', userId);
            if (userId) {
              this.authService.setUserId(userId);
            }
          }
          this.loginSuccess.emit();
          this.close.emit();
        } else {
          this.errorMessage = 'Login failed. Please check your credentials.';
        }
      },
      error: (error) => {
        this.isLoading = false;
        this.errorMessage = 'Login failed. Please try again.';
        console.error('Login error:', error);
      }
    });
  }

  onClose() {
    this.close.emit();
  }

  onSwitchToRegister() {
    this.switchToRegister.emit();
  }
} 