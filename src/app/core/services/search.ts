import { Injectable, signal ,inject } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class SearchService {

  searchQuery = signal('');

  setSearch(value: string): void {
    this.searchQuery.set(value);
  }

  clearSearch(): void {
    this.searchQuery.set('');
  }
}