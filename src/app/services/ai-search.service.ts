import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AiSearchService {
  private prompts = new BehaviorSubject([]);
  prompts$ = this.prompts.asObservable();
  constructor(private http: HttpClient) {}

  init() {
    this.http.get<string[]>('.././../assets/json/ai-prompt-placeholder.json').subscribe((data) => {
      this.prompts.next(data);
    });
  }
}
