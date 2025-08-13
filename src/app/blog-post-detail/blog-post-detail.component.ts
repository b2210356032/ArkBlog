import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BlogPost } from '../services/blog.service';

@Component({
  selector: 'app-blog-post-detail',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="post-detail-container" *ngIf="post">
      <div class="post-header">
                 <button class="back-btn" (click)="goBackHandler()">
          <span>←</span> Back to Posts
        </button>
        <h1 class="post-title">{{ post.title }}</h1>
        <div class="post-meta">
          <span class="author" *ngIf="post.authorName">By {{ post.authorName }}</span>
          <span class="date" *ngIf="post.publishedAt">
            {{ post.publishedAt | date:'fullDate' }}
          </span>
          <span class="status" [class.draft]="!post.isPublished">
            {{ post.isPublished ? 'Published' : 'Draft' }}
          </span>
        </div>
        <div class="post-tags" *ngIf="post.tags && post.tags.length > 0">
          <span class="tag" *ngFor="let tag of post.tags">{{ tag }}</span>
        </div>
      </div>

      <div class="post-featured-image" *ngIf="post.featuredImage">
        <img [src]="post.featuredImage" [alt]="post.title">
      </div>

      <div class="post-content" [innerHTML]="post.content"></div>
    </div>

    <div class="loading" *ngIf="!post">
      <div class="spinner"></div>
      <p>Loading post...</p>
    </div>
  `,
  styles: [`
    .post-detail-container {
      max-width: 800px;
      margin: 0 auto;
      padding: 2rem;
      background: white;
      min-height: 100vh;
    }

    .post-header {
      margin-bottom: 2rem;
      padding-bottom: 1rem;
      border-bottom: 2px solid #e9ecef;
    }

    .back-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      background: none;
      border: none;
      color: #6c757d;
      font-size: 1rem;
      cursor: pointer;
      padding: 0.5rem;
      border-radius: 4px;
      transition: background-color 0.2s;
      margin-bottom: 1rem;
    }

    .back-btn:hover {
      background: #e9ecef;
    }

    .post-title {
      font-size: 2.5rem;
      font-weight: 700;
      color: #2c3e50;
      margin: 0 0 1rem 0;
      line-height: 1.2;
    }

    .post-meta {
      display: flex;
      gap: 1rem;
      margin-bottom: 1rem;
      font-size: 0.875rem;
      color: #6c757d;
      flex-wrap: wrap;
    }

    .author {
      font-weight: 500;
    }

    .status {
      padding: 0.25rem 0.75rem;
      border-radius: 4px;
      font-size: 0.75rem;
      font-weight: 500;
      background: #d4edda;
      color: #155724;
    }

    .status.draft {
      background: #fff3cd;
      color: #856404;
    }

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
    }

    .tag {
      background: #e9ecef;
      color: #495057;
      padding: 0.25rem 0.75rem;
      border-radius: 20px;
      font-size: 0.75rem;
      font-weight: 500;
    }

    .post-featured-image {
      margin-bottom: 2rem;
      border-radius: 8px;
      overflow: hidden;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }

    .post-featured-image img {
      width: 100%;
      height: auto;
      display: block;
    }

    .post-content {
      line-height: 1.8;
      color: #2c3e50;
      font-size: 1.1rem;
    }

    .post-content h1,
    .post-content h2,
    .post-content h3,
    .post-content h4,
    .post-content h5,
    .post-content h6 {
      color: #2c3e50;
      margin: 2rem 0 1rem 0;
      font-weight: 600;
    }

    .post-content h1 { font-size: 2rem; }
    .post-content h2 { font-size: 1.75rem; }
    .post-content h3 { font-size: 1.5rem; }
    .post-content h4 { font-size: 1.25rem; }
    .post-content h5 { font-size: 1.1rem; }
    .post-content h6 { font-size: 1rem; }

    .post-content p {
      margin-bottom: 1.5rem;
    }

    .post-content img {
      max-width: 100%;
      height: auto;
      border-radius: 8px;
      margin: 1.5rem 0;
      box-shadow: 0 2px 4px rgba(0, 0, 0, 0.1);
    }

    .post-content blockquote {
      border-left: 4px solid #3b82f6;
      padding-left: 1rem;
      margin: 1.5rem 0;
      font-style: italic;
      color: #6c757d;
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 0 4px 4px 0;
    }

    .post-content ul,
    .post-content ol {
      margin: 1.5rem 0;
      padding-left: 2rem;
    }

    .post-content li {
      margin-bottom: 0.5rem;
    }

    .post-content code {
      background: #f8f9fa;
      padding: 0.2rem 0.4rem;
      border-radius: 4px;
      font-family: 'Courier New', monospace;
      font-size: 0.9rem;
    }

    .post-content pre {
      background: #f8f9fa;
      padding: 1rem;
      border-radius: 8px;
      overflow-x: auto;
      margin: 1.5rem 0;
    }

    .post-content pre code {
      background: none;
      padding: 0;
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

    @media (max-width: 768px) {
      .post-detail-container {
        padding: 1rem;
      }

      .post-title {
        font-size: 2rem;
      }

      .post-meta {
        flex-direction: column;
        gap: 0.5rem;
      }
    }
  `]
})
export class BlogPostDetailComponent implements OnInit {
  @Input() post: BlogPost | null = null;
  @Output() goBack = new EventEmitter<void>();

  ngOnInit() {
    // Component initialization
  }

  goBackHandler() {
    this.goBack.emit();
  }
} 