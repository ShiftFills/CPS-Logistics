import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { OriginBranch } from './origin-branch.model';

@Injectable({ providedIn: 'root' })
export class OriginBranchService {
  private http = inject(HttpClient);
  private baseUrl = '/api/origin-branches'; // change to your API URL

  // Set to false once your backend is ready
  private useMock = true;

  private mockData: OriginBranch[] = [
    { id: 1, name: 'Chennai',    code: 'CHE', state: 'Tamil Nadu',  country: 'India', contactPerson: 'Suriya',  panNo: 'sdhjk7654k', gstNo: '',                creditLimit: 0,      creditDays: 0,  paymentMode: 'Credit' },
    { id: 2, name: 'Coimbatore', code: 'CBE', state: 'Tamil Nadu',  country: 'India', contactPerson: 'Karthik', panNo: 'ABCPK1234L', gstNo: '33ABCPK1234L1Z5', creditLimit: 50000,  creditDays: 15, paymentMode: 'Credit' },
    { id: 3, name: 'Bengaluru',  code: 'BLR', state: 'Karnataka',   country: 'India', contactPerson: 'Anitha',  panNo: 'BNZPA5678M', gstNo: '29BNZPA5678M1Z2', creditLimit: 100000, creditDays: 30, paymentMode: 'Credit' },
    { id: 4, name: 'Hyderabad',  code: 'HYD', state: 'Telangana',   country: 'India', contactPerson: 'Ravi',    panNo: 'HYDPR9012N', gstNo: '36HYDPR9012N1Z8', creditLimit: 75000,  creditDays: 21, paymentMode: 'Cash'   },
    { id: 5, name: 'Mumbai',     code: 'MUM', state: 'Maharashtra', country: 'India', contactPerson: 'Priya',   panNo: 'MUMPP3456Q', gstNo: '27MUMPP3456Q1Z4', creditLimit: 150000, creditDays: 45, paymentMode: 'Credit' },
    { id: 6, name: 'Delhi',      code: 'DEL', state: 'Delhi',       country: 'India', contactPerson: 'Arjun',   panNo: 'DELPA7890R', gstNo: '07DELPA7890R1Z6', creditLimit: 0,      creditDays: 0,  paymentMode: 'Cash'   },
  ];

  getAll(): Observable<OriginBranch[]> {
    if (this.useMock) {
      return of([...this.mockData]).pipe(delay(300)); // small delay to show the loader
    }
    return this.http.get<OriginBranch[]>(this.baseUrl);
  }

  getById(id: number): Observable<OriginBranch> {
    if (this.useMock) {
      return of(this.mockData.find(b => b.id === id)!);
    }
    return this.http.get<OriginBranch>(`${this.baseUrl}/${id}`);
  }

  create(data: OriginBranch): Observable<OriginBranch> {
    if (this.useMock) {
      const created = { ...data, id: Date.now() };
      this.mockData = [...this.mockData, created];
      return of(created);
    }
    return this.http.post<OriginBranch>(this.baseUrl, data);
  }

  update(id: number, data: OriginBranch): Observable<OriginBranch> {
    if (this.useMock) {
      const updated = { ...data, id };
      this.mockData = this.mockData.map(b => (b.id === id ? updated : b));
      return of(updated);
    }
    return this.http.put<OriginBranch>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    if (this.useMock) {
      this.mockData = this.mockData.filter(b => b.id !== id);
      return of(void 0);
    }
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}