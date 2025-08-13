import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClientService, RequestParameters } from './http-client.service';

export interface PostImageFile {
  path: string;
}

export interface PostTag {
  tagName: string;
}

// Blog post interface
export interface BlogPost {
  id?: number;
  title: string;
  content: string;
  authorId?: number;
  authorName?: string;
  publishedAt?: Date;
  isPublished?: boolean;
  tags?: PostTag[];
  featuredImage?: PostImageFile;
  excerpt?: string;
  slug?: string;
  coverImageUrl?: string;
  clickCount?: number; // Added clickCount
}

// Create blog post request interface
export interface CreateBlogPostRequest {
  title: string;
  content: string;
  authorId?: number;
  authorName?: string;
  tags?: string[];
  featuredImage?: string;
  excerpt?: string;
  isPublished: boolean;
}

// Update blog post request interface
export interface UpdateBlogPostRequest {
  id: number;
  title?: string;
  content?: string;
  tags?: string[];
  featuredImage?: string;
  excerpt?: string;
  isPublished?: boolean;
}

// Add this interface for backend response
export interface UploadPostCommandResponse {
  succeeded: boolean;
  message: string;
  id?: number | string;
  // Add other fields if needed
}

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  constructor(private httpClientService: HttpClientService) { }

  // Create/Publish a new blog post
  createBlogPost(blogPost: CreateBlogPostRequest): Observable<UploadPostCommandResponse> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      action: 'Upload',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.post<UploadPostCommandResponse, CreateBlogPostRequest>(requestParameter, blogPost);
  }

  // Update an existing blog post
  updateBlogPost(blogPost: UpdateBlogPostRequest): Observable<BlogPost> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      action: 'Update',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.put<BlogPost, UpdateBlogPostRequest>(requestParameter, blogPost);
  }

  // Get all blog posts
  getBlogPosts(page: number = 1, limit: number = 10): Observable<BlogPost[]> {
    const queryParams = this.httpClientService.buildQueryString({ page, limit });
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      queryString: queryParams,
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<BlogPost[]>(requestParameter);
  }

  // Get blog post by ID
  getBlogPostById(id: string): Observable<BlogPost> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<BlogPost>(requestParameter, id);
  }

  // Delete blog post
  deleteBlogPost(id: string): Observable<any> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.delete<any>(requestParameter, id);
  }

  // Get published blog posts
  getPublishedPosts(page: number = 1, limit: number = 10): Observable<BlogPost[]> {
    const queryParams = this.httpClientService.buildQueryString({ page, limit, isPublished: true });
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      action: 'Published',
      queryString: queryParams,
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<BlogPost[]>(requestParameter);
  }

  // Save as draft
  saveAsDraft(blogPost: CreateBlogPostRequest): Observable<UploadPostCommandResponse> {
    const draftPost = { ...blogPost, isPublished: false };
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      action: 'SaveDraft',
      headers: this.httpClientService.createHeaders()
    };
    debugger;
    return this.httpClientService.post<UploadPostCommandResponse, CreateBlogPostRequest>(requestParameter, draftPost);
  }

  uploadImage(file: File, isFeatured: boolean, postId?: string): Observable<any> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      action: 'UploadImage',
      headers: this.httpClientService.createHeaders(undefined)
    };
    const additionalData = {
      IsFeaturedImage: isFeatured.toString(),
      ...(postId ? { Id: postId } : {})
    };
    return this.httpClientService.uploadFile<any>(requestParameter, file, 'File', additionalData);
  }

  createEmptyPost(authorId: string): Observable<UploadPostCommandResponse> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      action: 'Upload',
      headers: this.httpClientService.createHeaders()
    };
    const body = {
      title: '',
      content: '',
      authorId: authorId,
      isPublished: false
    };
    return this.httpClientService.post<UploadPostCommandResponse, any>(requestParameter, body);
  }

  getCoverImage(id: string): Observable<PostImageFile> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      action: 'GetCoverImage',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<PostImageFile>(requestParameter, id);
  }

  

  getTopPosts(count: number): Observable<BlogPost[]> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      action: 'GetTop',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<BlogPost[]>(requestParameter, count.toString());
  }

  getEditorPicks(count: number): Observable<BlogPost[]> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      action: 'GetEditorPicks',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<BlogPost[]>(requestParameter, count.toString());
  }

  getLatestPosts(count: number): Observable<BlogPost[]> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Post',
      action: 'GetLatest',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<BlogPost[]>(requestParameter, count.toString());
  }

  getTagsOfPost(postId: string): Observable<PostTag[]> {
    const requestParameter: Partial<RequestParameters> = {
      controller: 'Tag',
      action: 'GetTagsOfPost',
      headers: this.httpClientService.createHeaders()
    };
    return this.httpClientService.get<PostTag[]>(requestParameter, postId);
  }
} 