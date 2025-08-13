import { Component, OnInit } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxEditorComponent } from './editor/ngx-editor.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogPostDetailComponent } from './blog-post-detail/blog-post-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BlogPost, BlogService } from './services/blog.service';
import { AuthService } from './services/auth.service';
import { TagService } from './services/tag.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, RouterModule, CommonModule, NgxEditorComponent, BlogListComponent, BlogPostDetailComponent, LoginComponent, RegisterComponent, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent implements OnInit {
  title = 'ArkBlogClient';
  showEditor = false;
  showPostDetail = false;
  showLogin = false;
  showRegister = false;
  selectedPost: BlogPost | null = null;
  postId: string | null = null;
  authorId: string | null = null;
  showCategories = false;
  categories: any[] = [];
  isLoggedIn: boolean = false;

  constructor(private blogService: BlogService, private authService: AuthService, private tagService: TagService) {
    this.authorId = this.authService.getUserId();
  }

  ngOnInit(): void {
    this.checkLoginStatus();
  }

  checkLoginStatus(): void {
    this.isLoggedIn = this.authService.isAuthenticated();
  }

  getCategories(): void {
    if (this.categories.length === 0) { // Fetch only if not already fetched
      this.tagService.getTags().subscribe({
        next: (response) => {
          this.categories = response;
        },
        error: (error) => {
          console.error('Error fetching categories:', error);
        }
      });
    }
  }

  goToHome(): void {
    this.showEditor = false;
    this.showPostDetail = false;
  }

  async openEditor() {
    // Refresh authorId to ensure it's current
    this.authorId = this.authService.getUserId();
    
    if (!this.authorId) {
      alert('You must be logged in to create a post.');
      return;
    }
    
    this.blogService.createEmptyPost(this.authorId).subscribe({
      next: (response) => {
        if (response && response.succeeded) {
          // Handle different possible response structures
          let postId: string | null = null;
          if (response && typeof response === 'object') {
            postId = response.id !== undefined && response.id !== null ? String(response.id) : null;
          }
          if (postId) {
            this.postId = postId;
            this.showEditor = true;
          } else {
            console.error('No post ID found in response:', response);
            alert('Failed to create a new post. Please try again.');
          }
        }
      },
      error: (error) => {
        console.error('Error creating post:', error);
        alert('Failed to create a new post. Please try again.');
      }
    });
  }

  closeEditor() {
    this.showEditor = false;
    this.postId = null; // Clear post ID when editor is closed
  }

  onEditorClose() {
    this.closeEditor();
  }

  onPostCreated() {
    this.closeEditor();
    this.showPostDetail = false; // Ensure post detail is also closed
    this.postId = null; // Clear post ID context
  }

  viewPost(post: BlogPost) {
    this.selectedPost = post;
    this.showPostDetail = true;
  }

  closePostDetail() {
    this.showPostDetail = false;
    this.selectedPost = null;
  }

  openLogin() {
    this.showLogin = true;
  }

  openRegister() {
    this.showRegister = true;
  }

  closeLogin() {
    this.showLogin = false;
  }

  closeRegister() {
    this.showRegister = false;
  }

  switchToRegister() {
    this.showLogin = false;
    this.showRegister = true;
  }

  switchToLogin() {
    this.showRegister = false;
    this.showLogin = true;
  }

  onLoginSuccess() {
    this.showLogin = false;
    this.isLoggedIn = true; // Update login status
    // Refresh authorId after successful login
    this.authorId = this.authService.getUserId();
    // You can add additional logic here like updating UI state
  }

  onRegisterSuccess() {
    this.showRegister = false;
    // You can add additional logic here like showing success message
  }

  onLogout() {
    this.authService.logout();
    this.isLoggedIn = false; // Update login status
    this.authorId = null;
    this.postId = null;
    // Reload the page or refresh the blog list
    window.location.reload();
  }
}