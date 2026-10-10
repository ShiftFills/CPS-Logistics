import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { ClientMaster as ClientMasterRecord } from './client-master.model';

@Injectable({ providedIn: 'root' })
export class ClientMaster {
  private http = inject(HttpClient);
  private baseUrl = '/api/clients';
  private useMock = true;

  private mockData: ClientMasterRecord[] = Array.from({ length: 6 }, (_, index) => ({
    id: index + 1,
    branchId: 1,
    branchName: 'Chennai',
    clientName: 'Balaji Logistics',
    country: 'India',
    code: `BAL00${index + 1}`,
    city: 'Chennai',
    address: '',
    pincode: '',
    isActive: true,
    companyName: 'Balaji Logistics',
    panNo: '',
    gstNo: '',
    referredBy: '',
    username: '',
    password: '',
    gstBillStatus: true,
    contactPerson1: 'MIKHAIL PRABHUDAS',
    contactPerson2: '',
    operationalEmail1: '',
    operationalEmail2: '',
    contactNumber1: '9876543210',
    contactNumber2: '',
    category: 'New Client',
    cpsFollowUpPerson: '',
    paymentMode: 'Credit',
    remarks: '',
    accountContact: '',
    accountContactNo: '',
  }));

  getAll(): Observable<ClientMasterRecord[]> {
    if (this.useMock) return of([...this.mockData]).pipe(delay(300));
    return this.http.get<ClientMasterRecord[]>(this.baseUrl);
  }

  getById(id: number): Observable<ClientMasterRecord | undefined> {
    if (this.useMock) return of(this.mockData.find(client => client.id === id));
    return this.http.get<ClientMasterRecord>(`${this.baseUrl}/${id}`);
  }

  create(data: ClientMasterRecord): Observable<ClientMasterRecord> {
    if (this.useMock) {
      const created = { ...data, id: Date.now() };
      this.mockData = [...this.mockData, created];
      return of(created);
    }
    return this.http.post<ClientMasterRecord>(this.baseUrl, data);
  }

  update(id: number, data: ClientMasterRecord): Observable<ClientMasterRecord> {
    if (this.useMock) {
      const updated = { ...data, id };
      this.mockData = this.mockData.map(client => client.id === id ? updated : client);
      return of(updated);
    }
    return this.http.put<ClientMasterRecord>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    if (this.useMock) {
      this.mockData = this.mockData.filter(client => client.id !== id);
      return of(void 0);
    }
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}
