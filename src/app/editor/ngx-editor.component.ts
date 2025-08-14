import { Component, EventEmitter, OnDestroy, OnInit, Output, ViewChild, ElementRef, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { NgxEditorModule, Editor, Toolbar } from 'ngx-editor';
import { BlogService, CreateBlogPostRequest } from '../services/blog.service';

@Component({
  selector: 'app-ngx-editor',
  standalone: true,
  imports: [CommonModule, FormsModule, NgxEditorModule],
  template: `
    <div class="ngx-editor-fullpage">
      <div class="ngx-editor-header">
        <div class="header-left">
          <button class="back-btn" (click)="closeEditor()">
            <span>←</span> Back
          </button>
          <h2>New Post</h2>
        </div>
        <div class="header-right">
          <button class="btn btn-secondary" (click)="saveAsDraft()" [disabled]="isLoading">Save Draft</button>
          <button class="btn btn-primary" (click)="publishPost()" [disabled]="isLoading">
            <span *ngIf="isLoading">Publishing...</span>
            <span *ngIf="!isLoading">Publish</span>
          </button>
        </div>
      </div>
      
      <div class="editor-container">
        <!-- Title Input -->
        <div class="title-section">
          <input 
            type="text" 
            [(ngModel)]="postTitle" 
            placeholder="Enter your post title..." 
            class="title-input"
            maxlength="200"
          >
          <div class="title-counter">{{ postTitle.length }}/200</div>
        </div>
        
        <div class="custom-toolbar">
          <ngx-editor-menu [editor]="editor" [toolbar]="toolbar"></ngx-editor-menu>
          
          <button class="custom-image-btn" (click)="triggerFeaturedImageUpload()">
            📷 Select Cover Image
          </button>
          <img *ngIf="featuredImageUrl" [src]="featuredImageUrl" class="cover-image-preview">
          <button class="custom-image-btn" (click)="triggerImageUpload()">
            📷 Add Photo
          </button>
        </div>
        <ngx-editor [editor]="editor" [(ngModel)]="html" placeholder="Start writing your post..."></ngx-editor>
      </div>
      
      <!-- Hidden file input for image selection -->
      <input 
        #fileInput 
        type="file" 
        accept="image/*" 
        style="display: none;" 
        (change)="onImageSelected($event)"
      >
      <input 
        #featuredFileInput
        type="file" 
        accept="image/*" 
        style="display: none;" 
        (change)="onFeaturedImageSelected($event)"
      >
    </div>
  `,
  styles: [`
    .ngx-editor-fullpage {
      position: fixed;
      top: 70px; /* Adjusted to be below the navbar */
      left: 0;
      width: 97vw;
      height: calc(100vh - 70px); /* Adjusted height */
      background: #fff;
      display: flex;
      flex-direction: column;
      z-index: 999; /* Lowered z-index to be below navbar if navbar is 1000 */
    }
    
    .ngx-editor-header {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 1rem 2rem;
      background: #f8f9fa;
      border-bottom: 1px solid #e9ecef;
      box-shadow: 0 2px 4px rgba(0,0,0,0.1);
    }
    
    .header-left {
      display: flex;
      align-items: center;
      gap: 1rem;
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
    }
    
    .back-btn:hover {
      background: #e9ecef;
    }
    
    .header-right {
      display: flex;
      gap: 1rem;
    }
    
    .editor-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .custom-toolbar {
      display: flex;
      align-items: center;
      border-bottom: 1px solid #e9ecef;
      background: #fff;
      padding: 0.5rem;
    }
    
    .custom-image-btn {
      margin-left: 1rem;
      padding: 0.5rem 1rem;
      background: #28a745;
      color: white;
      border: none;
      border-radius: 4px;
      cursor: pointer;
      font-size: 0.875rem;
      transition: background-color 0.2s;
    }
    
    .custom-image-btn:hover {
      background: #218838;
    }

    .cover-image-preview {
      width: 40px;
      height: 40px;
      object-fit: cover;
      border-radius: 4px;
      margin-left: 1rem;
    }
    
    ngx-editor-menu {
      flex: 1;
    }
    
    ngx-editor {
      flex: 1;
      overflow-y: auto;
      padding: 2rem;
      background: #fff;
    }
    
    .btn {
      padding: 0.75rem 1.5rem;
      border: none;
      border-radius: 6px;
      font-size: 0.875rem;
      font-weight: 500;
      cursor: pointer;
      transition: all 0.2s;
    }
    
    .btn-primary {
      background: #3b82f6;
      color: #fff;
    }
    
    .btn-primary:hover {
      background: #2563eb;
    }
    
    .btn-secondary {
      background: #6c757d;
      color: #fff;
    }
    
    .btn-secondary:hover {
      background: #5a6268;
    }
    
    .title-section {
      padding: 1rem 2rem;
      border-bottom: 1px solid #e9ecef;
      background: #fff;
    }
    
    .title-input {
      width: 100%;
      font-size: 2rem;
      font-weight: 600;
      border: none;
      outline: none;
      background: transparent;
      color: #333;
      padding: 0.5rem 0;
    }
    
    .title-input::placeholder {
      color: #999;
      font-weight: 400;
    }
    
    .title-counter {
      text-align: right;
      font-size: 0.75rem;
      color: #6c757d;
      margin-top: 0.25rem;
    }
    
    .btn:disabled {
      opacity: 0.6;
      cursor: not-allowed;
    }
  `]
})
export class NgxEditorComponent implements OnInit, OnDestroy {
    @Output() close = new EventEmitter<{ postId: string | null, postTitle: string, htmlContent: string, published: boolean }>();
  @Output() postCreated = new EventEmitter<void>();
  @ViewChild('fileInput', { static: false }) fileInput!: ElementRef<HTMLInputElement>;
  @ViewChild('featuredFileInput', { static: false }) featuredFileInput!: ElementRef<HTMLInputElement>;
  @Input() postId: string | null = null;
  @Input() authorId: string | null = null;
  
  editor!: Editor;
  html = '';
  postTitle = '';
  isLoading = false;
  featuredImageUrl: string | null = null;
  toolbar: Toolbar = [
    ['bold', 'italic'],
    ['underline', 'strike'],
    ['code', 'blockquote'],
    ['ordered_list', 'bullet_list'],
    [{ heading: ['h1', 'h2', 'h3', 'h4', 'h5', 'h6'] }],
    ['link'],
    ['text_color', 'background_color'],
    ['align_left', 'align_center', 'align_right', 'align_justify'],
    ['undo', 'redo'],
  ];

  constructor(private blogService: BlogService) {}

  ngOnInit() {
    this.editor = new Editor();
  }

  ngOnDestroy() {
    this.editor?.destroy();
  }

  closeEditor(published: boolean = false) {
    this.close.emit({ postId: this.postId, postTitle: this.postTitle, htmlContent: this.html, published: published });
  }

  saveAsDraft() {
    const confirmSave = confirm('Are you sure you want to save this post as a draft?');
    if (!confirmSave) {
      return;
    }
    if (!this.postTitle.trim()) {
      alert('Please enter a title for your post.');
      return;
    }
    this.isLoading = true;
    const blogPost: any = {
      id: this.postId,
      title: this.postTitle,
      content: this.html,
      authorId: this.authorId,
      isPublished: false
    };
    this.blogService.createBlogPost(blogPost).subscribe({
      next: (response) => {
        if (response.succeeded) {
          console.log('Draft saved successfully:', response);
          alert(response.message || 'Draft saved successfully!');
          this.isLoading = false;
          this.postCreated.emit();
        } else {
          alert(response.message || 'Failed to save draft.');
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error saving draft:', error);
        alert('Error saving draft. Please try again.');
        this.isLoading = false;
      }
    });
  }

  publishPost() {
    const confirmPublish = confirm('Are you sure you want to publish this post?');
    if (!confirmPublish) {
      return;
    }
    if (!this.postTitle.trim()) {
      alert('Please enter a title for your post.');
      return;
    }
    if (!this.html.trim()) {
      alert('Please add some content to your post.');
      return;
    }
    if (!this.featuredImageUrl) {
      alert('Please select a cover image for your post.');
      return;
    }
    if (!this.featuredImageUrl) {
      alert('Please select a cover image for your post.');
      return;
    }
    this.isLoading = true;
    const blogPost: any = {
      id: this.postId,
      title: this.postTitle,
      content: this.html,
      authorId: this.authorId,
      isPublished: true
    };
    this.blogService.createBlogPost(blogPost).subscribe({
      next: (response) => {
        if (response.succeeded) {
          console.log('Post published successfully:', response);
          alert(response.message || 'Post published successfully!');
          this.isLoading = false;
          this.postCreated.emit();
          this.closeEditor(true);
        } else {
          alert(response.message || 'Failed to publish post.');
          this.isLoading = false;
        }
      },
      error: (error) => {
        console.error('Error publishing post:', error);
        alert('Error publishing post. Please try again.');
        this.isLoading = false;
      }
    });
  }

  private validatePost(): boolean {
    if (!this.postTitle.trim()) {
      alert('Please enter a title for your post.');
      return false;
    }
    
    if (!this.html.trim()) {
      alert('Please add some content to your post.');
      return false;
    }
    
    return true;
  }

  triggerImageUpload() {
    // Trigger the hidden file input
    this.fileInput.nativeElement.click();
  }

  triggerFeaturedImageUpload() {
    this.featuredFileInput.nativeElement.click();
  }

  onFeaturedImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      this.isLoading = true;
      this.blogService.uploadImage(file, true, this.postId || undefined).subscribe({
        next: (response) => {
          debugger;
          const BACKEND_BASE_URL = 'http://localhost:5055/';
          const relativeImageUrl = response.PathOrContainer || response.pathOrContainer || response.path || response.url;
          if (relativeImageUrl) {
            this.featuredImageUrl = BACKEND_BASE_URL + relativeImageUrl;
          } else {
            alert('Image upload failed: No path returned.');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Image upload error:', error);
          alert('Image upload failed. Please try again.');
          this.isLoading = false;
        }
      });
    }
  }

  onImageSelected(event: any) {
    const file = event.target.files[0];
    if (file) {
      // Check if file is an image
      if (!file.type.startsWith('image/')) {
        alert('Please select an image file');
        return;
      }
      // Check file size (limit to 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert('Image size should be less than 5MB');
        return;
      }
      this.isLoading = true;
      debugger; // Add debugger before sending HTTP request
      this.blogService.uploadImage(file, false, this.postId || undefined).subscribe({
        
        next: (response) => {
          debugger;
          const BACKEND_BASE_URL = 'http://localhost:5055/'; // Or 'https://localhost:7092/' if you're using HTTPS
          const relativeImageUrl = response.PathOrContainer || response.pathOrContainer || response.path || response.url;
          if (relativeImageUrl) {
            const fullImageUrl = BACKEND_BASE_URL + relativeImageUrl;
            this.insertImage(fullImageUrl);
          } else {
            alert('Image upload failed: No path returned.');
          }
          this.isLoading = false;
        },
        error: (error) => {
          console.error('Image upload error:', error);
          alert('Image upload failed. Please try again.');
          this.isLoading = false;
        }
      });
    }
  }

  insertImage(imageUrl: string) {
    // Insert image at current cursor position
    const imageHTML = `<img src="${imageUrl}" alt="Uploaded image" style="max-width: 100%; height: auto; border-radius: 8px; margin: 1rem 0;">`;
    const currentContent = this.html;
    const imageTag = `<p>${imageHTML}</p>`;
    this.html = currentContent + imageTag;
    setTimeout(() => {
      this.editor.commands.focus();
    }, 100);
  }
}