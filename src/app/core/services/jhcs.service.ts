import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {environment} from 'src/environments/environment';

@Injectable()
export class JhcsService {
  private url = environment.api_url;

  constructor (
    private apiService: ApiService
  ) {}

  list(api: string, page: number, size: number): Observable<any> {
    return this.apiService.get(`${this.url}/jhcs/${api}/list?page=${page}&size=${size}`);
  }

  getCustom(api: string) : Observable<any> {
    return this.apiService.get(`${this.url}/jhcs/${api}`);
  }

  all(api: string): Observable<any> {
    return this.apiService.get(`${this.url}/jhcs/${api}/list`);
  }

  get(api: string, id: string | number): Observable<any> {
    return this.apiService.get(`${this.url}/jhcs/${api}/${id}`);
  }

  recent(api: string): Observable<any> {
    return this.apiService.get(`${this.url}/jhcs/${api}/recent`);
  }

  createItem(api: string, data: any): Observable<any> {
    return this.apiService.post(`${this.url}/jhcs/${api}/create`, data);
  }

  create(api: string, form: FormData): Observable<any> {
    return this.apiService.postForm(`${this.url}/jhcs/${api}/create`, form);
  }

  updateItem(api: string, id: string | number, data: any): Observable<any> {
    return this.apiService.put(`${this.url}/jhcs/${api}/update/${id}`, data);
  }

  update(api: string, id: string | number, form: FormData): Observable<any> {
    return this.apiService.putForm(`${this.url}/jhcs/${api}/update/${id}`, form);
  }

  delete(api: string, id: string | number): Observable<any> {
    return this.apiService.delete(`${this.url}/jhcs/${api}/${id}`);
  }

  post(api: string, payload: any): Observable<any> {
    return this.apiService.post(`${this.url}/jhcs/${api}`, payload);
  }
}
