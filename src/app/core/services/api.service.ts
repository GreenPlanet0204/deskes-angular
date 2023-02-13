import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';

@Injectable()
export class ApiService {
  private options = {
    headers: new HttpHeaders().set('Content-Type', 'application/json; charset=utf-8')
  };

  constructor(
    private http: HttpClient,
  ) {}

  private formatErrors(error: any) {
    return  throwError(error.error);
  }

  get(url: string, params: HttpParams = new HttpParams()): Observable<any> {
    return this.http.get(url, { params })
      .pipe(catchError(this.formatErrors));
  }

  put(url: string, body: any): Observable<any> {
    return this.http.put(
      url,
      body,
      this.options
    ).pipe(catchError(this.formatErrors));
  }

  putForm(url: string, body: FormData): Observable<any> {
    return this.http.put(
      url,
      body,
    ).pipe(catchError(this.formatErrors));
  }

  post(url: string, body: any): Observable<any> {
    return this.http.post(
      url,
      body,
      this.options
    ).pipe(catchError(this.formatErrors));
  }

  postForm(url: string, body: FormData): Observable<any> {
    return this.http.post(
      url,
      body,
    ).pipe(catchError(this.formatErrors));
  }

  delete(url: string): Observable<any> {
    return this.http.delete(url).pipe(catchError(this.formatErrors));
  }
}
