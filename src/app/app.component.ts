import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { RouterOutlet, RouterModule } from '@angular/router';
import { CommonModule } from '@angular/common';
import { NgxEditorComponent } from './editor/ngx-editor.component';
import { BlogListComponent } from './blog-list/blog-list.component';
import { BlogPostDetailComponent } from './blog-post-detail/blog-post-detail.component';
import { LoginComponent } from './auth/login/login.component';
import { RegisterComponent } from './auth/register/register.component';
import { BlogPost, BlogService, FilterPostsQueryRequest, FilterPostsQueryResponse } from './services/blog.service';
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
  showCategoryPanel: boolean = false;
  filteredPosts: BlogPost[] = [];
  isMouseOverPanel: boolean = false;
  categoryPanelLeft: string = '0px';

  @ViewChild(NgxEditorComponent) ngxEditorComponent!: NgxEditorComponent;
  @ViewChild('categoriesButton') categoriesButton!: ElementRef;

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

  onCategoriesMouseEnter(): void {
    console.log('onCategoriesMouseEnter called');
    this.showCategories = true;
    this.showCategoryPanel = true;
    this.getCategories(); // Ensure categories are loaded

    // No dynamic left calculation needed, panel starts from the beginning of the page
  }

  onCategoriesMouseLeave(): void {
    console.log('onCategoriesMouseLeave called');
    this.showCategories = false;
    // Give a small delay to allow mouse to enter the panel
    setTimeout(() => {
      if (!this.isMouseOverPanel) { // Check if mouse is not over the panel
        this.showCategoryPanel = false;
      }
    }, 100);
  }

  onPanelMouseEnter(): void {
    this.isMouseOverPanel = true;
  }

  onPanelMouseLeave(): void {
    this.isMouseOverPanel = false;
    this.showCategoryPanel = false;
    this.showCategories = false; // Also hide the small dropdown
  }

  filterPostsByTag(tagName: string): void {
    const request: FilterPostsQueryRequest = {
      TagName: tagName,
      Count: 5,
      OrderBy: 'Recent'
    };
    this.blogService.filterPosts(request).subscribe({
      next: (response) => {
        this.filteredPosts = response.posts;
        // Fetch cover images for each filtered post
        this.filteredPosts.forEach(post => {
          if (post.id) {
            this.blogService.getCoverImage(post.id.toString()).subscribe({
              next: (imageFile) => {
                post.coverImageUrl = 'http://localhost:5055/' + imageFile.path.replace(/\\/g, '/');
              },
              error: (error) => {
                console.error('Error loading cover image for post:', post.id, error);
              }
            });
          }
        });
      },
      error: (error) => {
        console.error('Error fetching filtered posts:', error);
      }
    });
  }

  goToHome(): void {
    if (this.showEditor && this.ngxEditorComponent) {
      this.confirmAndCloseEditor(
        this.ngxEditorComponent.postId,
        this.ngxEditorComponent.postTitle,
        this.ngxEditorComponent.html,
        true, // Indicate that we want to navigate home after closing
        false // published is false when navigating from home button
      );
    } else {
      this.showEditor = false;
      this.showPostDetail = false;
    }
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

  closeEditor(navigateHome: boolean = false) {
    this.showEditor = false;
    this.postId = null; // Clear post ID when editor is closed
    if (navigateHome) {
      // Navigate to home page
      // You might use Router here if you have routing set up
      // For now, we'll just ensure other components are hidden
      this.showPostDetail = false;
    }
  }

  onEditorClose(event: { postId: string | null, postTitle: string, htmlContent: string, published: boolean }) {
    this.confirmAndCloseEditor(event.postId, event.postTitle, event.htmlContent, false, event.published);
  }

  onPostCreated() {
    this.closeEditor();
    this.showPostDetail = false; // Ensure post detail is also closed
    this.postId = null; // Clear post ID context
  }

  confirmAndCloseEditor(postId: string | null, postTitle: string, htmlContent: string, navigateHome: boolean, published: boolean): void {
    if (published) { // If post was just published, no need for confirmation
      this.closeEditor(navigateHome);
      return;
    }
    if (postId) { // Only ask if a post has been created
      const confirmDiscard = confirm('Are you sure you want to go back? Any unsaved changes will be lost.');
      if (confirmDiscard) {
        if (!postTitle.trim() && !htmlContent.trim()) {
          this.blogService.deleteBlogPost(postId).subscribe({
            next: () => {
              console.log('Empty post deleted successfully.');
              this.closeEditor(navigateHome);
            },
            error: (error) => {
              console.error('Error deleting empty post:', error);
              this.closeEditor(navigateHome);
            }
          });
        } else {
          const confirmDelete = confirm('You have unsaved changes. Do you want to discard them and delete this post?');
          if (confirmDelete) {
            this.blogService.deleteBlogPost(postId).subscribe({
              next: () => {
                console.log('Post deleted successfully due to unsaved changes.');
                this.closeEditor(navigateHome);
              },
              error: (error) => {
                console.error('Error deleting post with unsaved changes:', error);
                this.closeEditor(navigateHome);
              }
            });
          } else {
            return;
          }
        }
      }
    } else {
      this.closeEditor(navigateHome);
    }
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
