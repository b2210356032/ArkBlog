import { Component, OnInit, Output, EventEmitter, OnDestroy, OnChanges, SimpleChanges } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { BlogService, BlogPost } from '../services/blog.service';
import { AuthService } from '../services/auth.service';
import { CarouselModule, OwlOptions } from 'ngx-owl-carousel-o';

@Component({
  selector: 'app-blog-list',
  standalone: true,
    imports: [CommonModule, RouterModule, CarouselModule],
  template: `
    <div class="blog-container">
             

      <!-- Top Posts Section -->
      <div class="section-header">
        <h2>Top Posts</h2>
        <button class="show-all-btn">Show All</button>
      </div>
            <div class="posts-grid" *ngIf="topPosts.length > 0; else noTopPosts">
        <div class="post-card" *ngFor="let post of topPosts" (click)="viewPostDetail(post)">
          <div class="post-image" *ngIf="post.coverImageUrl">
            <img [src]="post.coverImageUrl" [alt]="post.title">
            <div class="click-count-overlay" *ngIf="post.clickCount !== undefined && post.clickCount !== null">
              {{ post.clickCount }}
            </div>
          </div>
          <div class="post-tags" *ngIf="post.tags && post.tags.length > 0">
            <span *ngFor="let tag of post.tags; let last = last">{{ tag.tagName }}{{ !last ? ' / ' : '' }}</span>
          </div>
          <div class="post-content">
            <h2 class="post-title">{{ post.title }}</h2>
          </div>
        </div>
      </div>
      <ng-template #noTopPosts>
        <div class="no-posts-section">No top posts available.</div>
      </ng-template>

      <!-- Editor Picks Section -->
      <div class="section-header">
        <h2>Editor Picks</h2>
        <button class="show-all-btn">Show All</button>
      </div>
                  <div class="posts-grid" *ngIf="editorPicks.length > 0; else noEditorPicks">
        <div class="post-card" *ngFor="let post of editorPicks" (click)="viewPostDetail(post)">
          <div class="post-image" *ngIf="post.coverImageUrl">
            <img [src]="post.coverImageUrl" [alt]="post.title">
          </div>
          <div class="post-tags" *ngIf="post.tags && post.tags.length > 0">
            <span *ngFor="let tag of post.tags; let last = last">{{ tag.tagName }}{{ !last ? ' / ' : '' }}</span>
          </div>
          <div class="post-content">
            <h2 class="post-title">{{ post.title }}</h2>
          </div>
        </div>
      </div>
      <ng-template #noEditorPicks>
        <div class="no-posts-section">No editor picks available.</div>
      </ng-template>

      <!-- Latest Posts Section -->
      <div class="section-header">
        <h2>Latest Posts</h2>
        <button class="show-all-btn">Show All</button>
      </div>
                  <div class="posts-grid" *ngIf="latestPosts.length > 0; else noLatestPosts">
        <div class="post-card" *ngFor="let post of latestPosts" (click)="viewPostDetail(post)">
          <div class="post-image" *ngIf="post.coverImageUrl">
            <img [src]="post.coverImageUrl" [alt]="post.title">
            <div class="post-date-overlay" *ngIf="post.publishedAt">
              {{ post.publishedAt | date:'short' }}
            </div>
          </div>
          <div class="post-tags" *ngIf="post.tags && post.tags.length > 0">
            <span *ngFor="let tag of post.tags; let last = last">{{ tag.tagName }}{{ !last ? ' / ' : '' }}</span>
          </div>
          <div class="post-content">
            <h2 class="post-title">{{ post.title }}</h2>
          </div>
        </div>
      </div>
      <ng-template #noLatestPosts>
        <div class="no-posts-section">No latest posts available.</div>
      </ng-template>

      <div class="loading" *ngIf="isLoading">
        <div class="spinner"></div>
        <p>Loading posts...</p>
      </div>
    </div>
  `,
  styles: [`
    .blog-container {
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      min-height: 100vh;
      background: #f8f9fa;
    }

    

    

    

    .posts-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(350px, 1fr));
      gap: 2rem;
    }

    .post-card {
      background: white;
      border-radius: 12px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      transition: all 0.3s ease;
      cursor: pointer;
    }

    .post-card:hover {
      transform: translateY(-4px);
      box-shadow: 0 8px 25px rgba(0, 0, 0, 0.15);
    }

    .post-image {
      width: 100%;
      height: 200px;
      overflow: hidden;
    }

    .post-image img {
      width: 100%;
      height: 100%;
      object-fit: cover;
      transition: transform 0.3s ease;
    }

    .post-card:hover .post-image img {
      transform: scale(1.05);
    }

    .post-content {
      padding: 1.5rem;
    }

    .post-title {
      font-size: 1.5rem;
      font-weight: 600;
      color: #2c3e50;
      margin: 0 0 0.5rem 0;
      line-height: 1.3;
      display: -webkit-box;
      -webkit-line-clamp: 2;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .post-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: #6c757d;
    }

    .author {
      font-weight: 500;
    }

    .post-excerpt {
      color: #495057;
      line-height: 1.6;
      margin-bottom: 1rem;
      display: -webkit-box;
      -webkit-line-clamp: 3;
      -webkit-box-orient: vertical;
      overflow: hidden;
    }

    .excerpt-text {
      margin-bottom: 0.5rem;
    }

    .excerpt-images {
      margin-top: 0.5rem;
    }

    .excerpt-image {
      max-width: 100%;
      height: auto;
      border-radius: 4px;
      max-height: 100px;
      object-fit: cover;
    }

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .tag {
      background: #e9ecef;
      color: #495057;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .post-status {
      display: inline-block;
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #d4edda;
      color: #155724;
    }

    .post-status.draft {
      background: #fff3cd;
      color: #856404;
    }

    .no-posts {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .no-posts-icon {
      font-size: 4rem;
      margin-bottom: 1rem;
    }

    .no-posts h3 {
      font-size: 1.5rem;
      color: #2c3e50;
      margin-bottom: 0.5rem;
    }

    .no-posts p {
      color: #6c757d;
      margin-bottom: 2rem;
    }

    .btn-primary {
      background: #3b82f6;
      color: white;
      border: none;
      padding: 0.75rem 1.5rem;
      border-radius: 8px;
      font-size: 1rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }

    .btn-primary:hover {
      background: #2563eb;
    }

    .loading {
      text-align: center;
      padding: 4rem 2rem;
    }

    .spinner {
      width: 40px;
      height: 40px;
      border: 4px solid #e9ecef;
      border-top: 4px solid #3b82f6;
      border-radius: 50%;
      animation: spin 1s linear infinite;
      margin: 0 auto 1rem;
    }

    @keyframes spin {
      0% { transform: rotate(0deg); }
      100% { transform: rotate(360deg); }
    }

    .click-count-overlay {
      position: absolute;
      top: 8px;
      right: 8px; /* Changed from right to left */
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* .eye-icon removed */

    .post-date-overlay { /* New style for date overlay */
      position: absolute;
      top: 8px;
      right: 8px; /* Changed from left to right */
      background: rgba(0, 0, 0, 0.6);
      color: white;
      padding: 4px 8px;
      border-radius: 4px;
      font-size: 0.8rem;
      display: flex;
      align-items: center;
      gap: 4px;
    }

    /* .post-date removed */

    @media (max-width: 768px) {
      .blog-container {
        padding: 1rem;
      }

      .header {
        flex-direction: column;
        gap: 1rem;
        text-align: center;
      }

      .posts-grid {
        grid-template-columns: 1fr;
        gap: 1rem;
      }
    }

    `]})
export class BlogListComponent implements OnInit, OnDestroy, OnChanges {
  @Output() openEditor = new EventEmitter<void>();
  @Output() viewPost = new EventEmitter<BlogPost>();
  @Output() openLogin = new EventEmitter<void>();
  @Output() openRegister = new EventEmitter<void>();
  @Output() logout = new EventEmitter<void>();
  posts: BlogPost[] = [];
  topPosts: BlogPost[] = [];
  editorPicks: BlogPost[] = [];
  latestPosts: BlogPost[] = [];
  isLoading = false;

  sliderValue: number = 0;
  postWidth: number = 350; // Assuming a default post width
  postGap: number = 32; // 2rem = 32px

  constructor(private blogService: BlogService, private authService: AuthService) {}

  get isAuthenticated(): boolean {
    return this.authService.isAuthenticated();
  }

  ngOnInit() {
    this.loadPosts();
  }

  ngOnDestroy() {
    // Cleanup if needed
  }

  ngOnChanges(changes: SimpleChanges) {
    // Reload posts when component becomes visible
    if (changes['posts'] && this.posts.length === 0) {
      this.loadPosts();
    }
  }

  loadPosts() {
    this.isLoading = true;
    const postCount = 10; // Number of posts to show in each section

    // Fetch Top Posts
    this.blogService.getTopPosts(postCount).subscribe({
      next: (posts) => {
        this.topPosts = posts;
        this.fetchAndProcessPosts(this.topPosts);
      },
      error: (error) => {
        console.error('Error loading top posts:', error);
      }
    });

    // Fetch Editor Picks
    this.blogService.getEditorPicks(postCount).subscribe({
      next: (posts) => {
        this.editorPicks = posts;
        this.fetchAndProcessPosts(this.editorPicks);
      },
      error: (error) => {
        console.error('Error loading editor picks:', error);
      }
    });

    // Fetch Latest Posts
    this.blogService.getLatestPosts(postCount).subscribe({
      next: (posts) => {
        this.latestPosts = posts;
        this.fetchAndProcessPosts(this.latestPosts);
        this.isLoading = false; // Set isLoading to false after all main fetches are done
      },
      error: (error) => {
        console.error('Error loading latest posts:', error);
        this.isLoading = false;
      }
    });
  }

  private fetchAndProcessPosts(posts: BlogPost[]): void {
    posts.forEach(post => {
      if (post.id) {
        this.blogService.getCoverImage(post.id.toString()).subscribe({
          next: (imageFile) => {
            post.coverImageUrl = 'http://localhost:5055/' + imageFile.path;
          },
          error: (error) => {
            console.error('Error loading cover image for post:', post.id, error);
          }
        });

        this.blogService.getTagsOfPost(post.id.toString()).subscribe({
          next: (tags) => {
            post.tags = tags;
          },
          error: (error) => {
            console.error('Error loading tags for post:', post.id, error);
          }
        });
      }
    });
  }

  htmlToText(html: string): string {
    // Create a temporary div to parse HTML
    const tempDiv = document.createElement('div');
    tempDiv.innerHTML = html;
    
    // Get text content (this removes HTML tags)
    let text = tempDiv.textContent || tempDiv.innerText || '';
    
    // Clean up extra whitespace
    text = text.replace(/\s+/g, ' ').trim();
    
    return text;
  }

  openEditorHandler() {
    if (!this.isAuthenticated) {
      alert('Please log in to create a post.');
      return;
    }
    this.openEditor.emit();
  }

  viewPostDetail(post: BlogPost) {
    this.viewPost.emit(post);
  }

  onOpenLogin() {
    this.openLogin.emit();
  }

  onOpenRegister() {
    this.openRegister.emit();
  }

  onLogout() {
    this.logout.emit();
  }
} 
