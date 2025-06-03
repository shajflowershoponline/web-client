import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, tap, catchError, of, BehaviorSubject } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IServices } from './interface/iservices';
import { ApiResponse } from '../model/api-response.model';
import { Product } from '../model/product';
import { Category } from '../model/category';
import { Collection } from '../model/collection';
import { CustomerUserWishlist } from '../model/customer-user-wish-list.model';

@Injectable({
  providedIn: 'root'
})
export class ProductService implements IServices {

  private searchSubject = new BehaviorSubject<string | null>(null);
  search$ = this.searchSubject.asObservable();

  constructor(private http: HttpClient) { }

  setSearch(search: string) {
    this.searchSubject.next(search);
  }

  getAdvanceSearch(params:{
    order?: any,
    columnDef?: { apiNotation: string; filter?: string }[],
    pageSize?: number,
    pageIndex?: number
  }): Observable<ApiResponse<{ results: Product[]; categories: Category[]; total: number}>> {
    return this.http.post<any>(environment.apiBaseUrl + environment.api.product.getAdvanceSearch,
      params)
    .pipe(
      tap(_ => this.log('product')),
      catchError(this.handleError('product', []))
    );
  }

  getSearchFilter(params:{
    columnDef?: { apiNotation: string; filter?: string }[],
  }): Observable<ApiResponse<{
      categories: Category[];
      collections: Collection[];
      colors: { name: string; count: number}[];
    }>> {
    return this.http.post<any>(environment.apiBaseUrl + environment.api.product.getSearchFilter,
      params)
    .pipe(
      tap(_ => this.log('product')),
      catchError(this.handleError('product', []))
    );
  }

  getByCode(sku: string): Observable<ApiResponse<Product>> {
    return this.http.get<any>(environment.apiBaseUrl + environment.api.product.getByCode + sku)
    .pipe(
      tap(_ => this.log('product')),
      catchError(this.handleError('product', []))
    );
  }

  handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      this.log(`${operation} failed: ${Array.isArray(error.error.message) ? error.error.message[0] : error.error.message}`);
      return of(error.error as T);
    };
  }

  log(message: string) {
    console.log(message);
  }
}
