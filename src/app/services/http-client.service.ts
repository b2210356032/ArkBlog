import { Inject, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from "@angular/common/http";
import { Observable, throwError } from 'rxjs';
import { catchError, retry, timeout } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class HttpClientService {
  constructor(private httpClient: HttpClient, @Inject("baseUrl") private baseUrl: string) { }

  private url(requestParameter: Partial<RequestParameters>): string {
    return `${requestParameter.baseUrl ? requestParameter.baseUrl : this.baseUrl}/${requestParameter.controller}${requestParameter.action ? `/${requestParameter.action}` : ""}`;
  }

  get<T>(requestParameter: Partial<RequestParameters>, id?: string): Observable<T> {
    let url: string = "";
    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${id ? `/${id}` : ""}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;

    return this.httpClient.get<T>(url, { 
      headers: requestParameter.headers, 
      responseType: requestParameter.responseType as 'json' 
    }).pipe(
      retry(1),
      timeout(30000),
      catchError(this.handleError)
    );
  }

  post<TResponse, TRequest>(requestParameter: Partial<RequestParameters>, body: TRequest): Observable<TResponse> {
    let url: string = "";
    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;

    return this.httpClient.post<TResponse>(url, body, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json'
    }).pipe(
      retry(1),
      timeout(30000),
      catchError(this.handleError)
    );
  }

  put<TResponse, TRequest>(requestParameter: Partial<RequestParameters>, body: TRequest): Observable<TResponse> {
    let url: string = "";
    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;

    return this.httpClient.put<TResponse>(url, body, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json'
    }).pipe(
      retry(1),
      timeout(30000),
      catchError(this.handleError)
    );
  }

  delete<T>(requestParameter: Partial<RequestParameters>, id: string): Observable<T> {
    let url: string = "";
    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}/${id}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;

    return this.httpClient.delete<T>(url, { 
      headers: requestParameter.headers, 
      responseType: requestParameter.responseType as 'json' 
    }).pipe(
      retry(1),
      timeout(30000),
      catchError(this.handleError)
    );
  }

  // Additional utility methods
  patch<TResponse, TRequest>(requestParameter: Partial<RequestParameters>, body: TRequest): Observable<TResponse> {
    let url: string = "";
    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;

    return this.httpClient.patch<TResponse>(url, body, {
      headers: requestParameter.headers,
      responseType: requestParameter.responseType as 'json'
    }).pipe(
      retry(1),
      timeout(30000),
      catchError(this.handleError)
    );
  }

  // Method to create headers with common configurations
  createHeaders(contentType?: string, authorization?: string): HttpHeaders {
    let headers = new HttpHeaders();
    // Only set Content-Type if it's not multipart/form-data and is defined
    if (contentType && contentType !== 'multipart/form-data') {
      headers = headers.set('Content-Type', contentType);
    }
    if (authorization) {
      headers = headers.set('Authorization', authorization);
    }
    return headers;
  }

  // Method to build query string from object
  buildQueryString(params: { [key: string]: any }): string {
    const httpParams = new HttpParams();
    Object.keys(params).forEach(key => {
      if (params[key] !== null && params[key] !== undefined) {
        httpParams.set(key, params[key].toString());
      }
    });
    return httpParams.toString();
  }

  // Error handling method
  private handleError(error: any) {
    let errorMessage = '';
    if (typeof window !== 'undefined' && error.error instanceof ErrorEvent) {
      // Client-side error
      errorMessage = `Error: ${error.error.message}`;
    } else {
      // Server-side error
      errorMessage = `Error Code: ${error.status}\nMessage: ${error.message}`;
    }
    console.error(errorMessage);
    return throwError(() => new Error(errorMessage));
  }

  // Method to upload files
  uploadFile<T>(requestParameter: Partial<RequestParameters>, file: File, fileName: string = 'file', extraFields?: {[key: string]: string}): Observable<T> {
    const formData = new FormData();
    // Always set the filename explicitly if available
    if (file && file.name) {
      formData.append(fileName, file, file.name);
    } else {
      formData.append(fileName, file);
    }
    if (extraFields) {
      for (const key in extraFields) {
        if (extraFields.hasOwnProperty(key)) {
          formData.append(key, extraFields[key]);
        }
      }
    }
    let url: string = "";
    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;
  debugger;
    return this.httpClient.post<T>(url, formData, { 
      headers: requestParameter.headers 
    }).pipe(
      retry(1),
      timeout(60000), // Longer timeout for file uploads
      catchError(this.handleError)
    );
  }

  // Method to download files
  downloadFile(requestParameter: Partial<RequestParameters>, id?: string): Observable<Blob> {
    let url: string = "";
    if (requestParameter.fullEndPoint)
      url = requestParameter.fullEndPoint;
    else
      url = `${this.url(requestParameter)}${id ? `/${id}` : ""}${requestParameter.queryString ? `?${requestParameter.queryString}` : ""}`;

    return this.httpClient.get(url, { 
      headers: requestParameter.headers, 
      responseType: 'blob' 
    }).pipe(
      retry(1),
      timeout(60000), // Longer timeout for file downloads
      catchError(this.handleError)
    );
  }
}

export class RequestParameters {
  controller?: string;
  action?: string;
  queryString?: string;

  headers?: HttpHeaders;
  baseUrl?: string;
  fullEndPoint?: string;

  responseType?: string = 'json';
} 