import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { BrokerMaster } from './broker-master.model';

@Injectable({ providedIn: 'root' })
export class BrokerMasterService {
  private http = inject(HttpClient);
  private baseUrl = '/api/brokers'; // change to your API URL

  // Set to false once your backend is ready
  private useMock = true;

  private mockData: BrokerMaster[] = [
    { id: 1, brokerName: 'Vishal Yard',     brokerCode: 'SIKKINDER',  location: 'Kochi',      priority: 'High',   contactPerson1: 'Vishal',   contactPerson2: '',        contactNumber1: '9159582729', contactNumber2: '',           email: 'vishal@example.com',  address: '', isActive: true },
    { id: 2, brokerName: 'Sparrow Trailer', brokerCode: '12345678',   location: 'Chennai',    priority: 'Medium', contactPerson1: 'Mohan',    contactPerson2: '',        contactNumber1: '9946679333', contactNumber2: '9946679333', email: 'sparrow@example.com', address: '', isActive: true },
    { id: 3, brokerName: 'Mohandas CPS',    brokerCode: 'MOHANMOHAN', location: 'Coimbatore', priority: 'Low',    contactPerson1: 'Mohandas', contactPerson2: '',        contactNumber1: '8129055977', contactNumber2: '',           email: '',                    address: '', isActive: false },
    { id: 4, brokerName: 'Balaji Carriers', brokerCode: 'BAL001',     location: 'Bengaluru',  priority: 'High',   contactPerson1: 'Anitha',   contactPerson2: 'Karthik', contactNumber1: '9840012345', contactNumber2: '',           email: 'balaji@example.com',  address: '', isActive: true },
    { id: 5, brokerName: 'Ravi Transport',  brokerCode: 'RAV204',     location: 'Hyderabad',  priority: 'Medium', contactPerson1: 'Ravi',     contactPerson2: '',        contactNumber1: '9700112233', contactNumber2: '',           email: 'ravi@example.com',    address: '', isActive: true },
    { id: 6, brokerName: 'Priya Logistics', brokerCode: 'PRI330',     location: 'Mumbai',     priority: '',       contactPerson1: 'Priya',    contactPerson2: '',        contactNumber1: '9820098200', contactNumber2: '',           email: 'priya@example.com',   address: '', isActive: false },
  ];

  getAll(): Observable<BrokerMaster[]> {
    if (this.useMock) return of([...this.mockData]).pipe(delay(300));
    return this.http.get<BrokerMaster[]>(this.baseUrl);
  }

  getById(id: number): Observable<BrokerMaster | undefined> {
    if (this.useMock) return of(this.mockData.find(b => b.id === id));
    return this.http.get<BrokerMaster>(`${this.baseUrl}/${id}`);
  }

  create(data: BrokerMaster): Observable<BrokerMaster> {
    if (this.useMock) {
      const created = { ...data, id: Date.now() };
      this.mockData = [...this.mockData, created];
      return of(created);
    }
    return this.http.post<BrokerMaster>(this.baseUrl, data);
  }

  update(id: number, data: BrokerMaster): Observable<BrokerMaster> {
    if (this.useMock) {
      const updated = { ...data, id };
      this.mockData = this.mockData.map(b => (b.id === id ? updated : b));
      return of(updated);
    }
    return this.http.put<BrokerMaster>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    if (this.useMock) {
      this.mockData = this.mockData.filter(b => b.id !== id);
      return of(void 0);
    }
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }
}