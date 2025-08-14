import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { BlogService, BlogPost } from '../services/blog.service';

@Component({
  selector: 'app-tagged-posts',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `
    <div class="tagged-posts-container">
      <div class="top-bar">
        <button (click)="goBack()" class="back-button">&#8592; Back</button>
        <h2>Posts Tagged: {{ tagName }}</h2>
      </div>

      <div class="posts-grid" *ngIf="taggedPosts.length > 0; else noPosts">
        <div class="post-card" *ngFor="let post of taggedPosts" (click)="viewPostDetail(post)">
          <div class="post-image" *ngIf="post.coverImageUrl">
            <img [src]="post.coverImageUrl" [alt]="post.title" />
          </div>
          <div class="post-tags" *ngIf="post.tags && post.tags.length > 0">
            <span *ngFor="let tag of post.tags; let last = last">
              {{ tag.tagName }}{{ !last ? ' / ' : '' }}
            </span>
          </div>
          <div class="post-content">
            <h2 class="post-title">{{ post.title }}</h2>
          </div>
        </div>
      </div>

      <ng-template #noPosts>
        <div class="no-posts-section">No posts found with this tag.</div>
      </ng-template>
    </div>
  `,
  styles: [`
    .tagged-posts-container {
      /* max-width: 1200px; */ /* Removed max-width to use full screen width */
      margin: 0 auto;
      /* padding: 2rem; */ /* Removed padding to allow top-bar to span full width */
      min-height: 100vh;
      background: #f8f9fa;
    }

    .top-bar {
      display: flex;
      align-items: center;
      margin-bottom: 2rem;
      padding: 0 2rem; /* Add padding to the top-bar itself */
      width: 101%; /* Increase width by 1% */
    }

    .back-button {
      background: none;
      border: none;
      font-size: 1.2rem;
      cursor: pointer;
      margin-right: 1rem;
      color: #3b82f6;
    }

    .top-bar h2 {
      margin: 0;
      font-size: 2rem;
      color: #2c3e50;
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

    .post-tags {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1rem;
    }

    .no-posts-section {
      text-align: center;
      padding: 4rem 2rem;
      background: white;
      border-radius: 12px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
    }
  `]
})
export class TaggedPostsComponent implements OnInit {
  tagName: string | null = null;
  taggedPosts: BlogPost[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private blogService: BlogService
  ) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.tagName = params.get('tagName');
      if (this.tagName) {
        this.blogService.getPostsByTag(this.tagName).subscribe({
          next: (posts) => {
            this.taggedPosts = posts;
            this.fetchAndProcessPosts(this.taggedPosts);
          },
          error: (error) => {
            console.error('Error fetching tagged posts:', error);
          }
        });
      }
    });
  }

  private fetchAndProcessPosts(posts: BlogPost[]): void {
    posts.forEach(post => {
      if (post.id) {
        this.blogService.getCoverImage(post.id.toString()).subscribe({
          next: (imageFile) => {
            // Normalize path slashes for URLs
            post.coverImageUrl = 'http://localhost:5055/' + imageFile.path.replace(/\\/g, '/');
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

  viewPostDetail(post: BlogPost) {
    console.log('View post detail for:', post.title);
  }

  goBack(): void {
    this.router.navigate(['/']);
  }
}
