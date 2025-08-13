import { Injectable } from '@angular/core';
import { HttpClientService } from './http-client.service';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class TagService {

  constructor(private httpClient: HttpClientService) { }

  getTagsOfPost(postId: string): Observable<any> {
    return this.httpClient.get({
      controller: 'Tag',
      action: 'GetTagsOfPost'
    }, postId);
  }

  createTag(tag: any): Observable<any> {
    return this.httpClient.post({
      controller: 'Tag',
      action: 'CreateTag'
    }, tag);
  }

  addTagsToPost(tags: any): Observable<any> {
    return this.httpClient.post({
      controller: 'Tag',
      action: 'AddTagsToPost'
    }, tags);
  }

  getTags(): Observable<any> {
    return this.httpClient.get({
      controller: 'Tag',
      action: 'GetTags'
    });
  }
}
