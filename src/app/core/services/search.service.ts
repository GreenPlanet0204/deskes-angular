import {Injectable} from '@angular/core';
import {Observable} from 'rxjs';

import {ApiService} from './api.service';
import {map} from 'rxjs/operators';
import {environment} from 'src/environments/environment';

@Injectable()
export class SearchService {
  private url = environment.elastic_url;

  constructor (
    private apiService: ApiService
  ) {}

  get(id: number): Observable<any> {
    return this.apiService.get(`${this.url}/jhcs/${id}`)
          .pipe(map(data => data));
  }

  search(value: string): Observable<any> {
    return this.apiService.get(`${this.url}/jhcs/search?key=${value}`)
          .pipe(map(data => data));
  }

  advancedSearch(payload: any): Observable<any> {
    return this.apiService.post(`${this.url}/jhcs/search`, payload)
          .pipe(map(data => data));
  }
}
