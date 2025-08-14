import { Routes } from '@angular/router';
import { BlogListComponent } from './blog-list/blog-list.component';
import { TaggedPostsComponent } from './tagged-posts/tagged-posts.component';

export const routes: Routes = [
    { path: '', component: BlogListComponent },
    { path: 'tags/:tagName', component: TaggedPostsComponent }
];