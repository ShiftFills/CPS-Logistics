
import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, of } from 'rxjs';

import { DriverMaster } from './driver-master.model';
import { map } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
@Injectable({ providedIn: 'root' })
export class DriverMasterService {
  private http = inject(HttpClient);
  private baseUrl = '/api/drivers'; // change to your API URL

  // Set to false once your backend is ready
  private useMock = true;

  private mockData: DriverMaster[] = [
    { id: 1, branchId: 7, branchName: 'Kochi',      driverName: 'Sandeep Santhosh', joinDate: '2024-12-12', contactNo: '7558831020', residenceContactNo: '9037370388', licenceNo: 'KL6920200005276', licenceType: 'Heavy', licenceValidity: '2041-10-09', address: 'Velumpancherill, Kottar Theathre Pady, Karunapuram P.O, Idukki', bankName: 'SBI', accountNo: '33027290988', ifscCode: 'SBIN0007621', gpayNo: '7558831020', isActive: true,  licenceFileName: 'licence_sandeep.pdf' },
    { id: 2, branchId: 7, branchName: 'Kochi',      driverName: 'Sabeer S',         joinDate: '2025-01-01', contactNo: '9526980284', residenceContactNo: '',           licenceNo: 'KL1620050002727', licenceType: 'Heavy', licenceValidity: '2026-10-20', address: '', bankName: '', accountNo: '', ifscCode: '', gpayNo: '9526980284', isActive: true },
    { id: 3, branchId: 1, branchName: 'Chennai',    driverName: 'Karthik R',        joinDate: '2023-06-18', contactNo: '9840012345', residenceContactNo: '',           licenceNo: 'TN0920180011234', licenceType: 'Light', licenceValidity: '2030-03-14', address: '', bankName: '', accountNo: '', ifscCode: '', gpayNo: '9840012345', isActive: true },
    { id: 4, branchId: 2, branchName: 'Coimbatore', driverName: 'Mohamed Rafi',     joinDate: '2022-09-09', contactNo: '9791122334', residenceContactNo: '',           licenceNo: 'TN3820190004455', licenceType: 'Heavy', licenceValidity: '2029-07-02', address: '', bankName: '', accountNo: '', ifscCode: '', gpayNo: '9791122334', isActive: true },
    { id: 5, branchId: 3, branchName: 'Bengaluru',  driverName: 'Suresh Babu',      joinDate: '2021-02-21', contactNo: '9448899001', residenceContactNo: '',           licenceNo: 'KA0120150098765', licenceType: 'Light', licenceValidity: '2026-08-15', address: '', bankName: '', accountNo: '', ifscCode: '', gpayNo: '9448899001', isActive: false },
    { id: 6, branchId: 4, branchName: 'Hyderabad',  driverName: 'Arjun Menon',      joinDate: '2024-05-05', contactNo: '9700112233', residenceContactNo: '',           licenceNo: 'TS0920210012345', licenceType: 'Heavy', licenceValidity: '2037-11-30', address: '', bankName: '', accountNo: '', ifscCode: '', gpayNo: '9700112233', isActive: true },
  ];

  getAll(): Observable<DriverMaster[]> {
    if (this.useMock) return of([...this.mockData]).pipe(delay(300));
    return this.http.get<DriverMaster[]>(this.baseUrl);
  }

  getById(id: number): Observable<DriverMaster | undefined> {
    if (this.useMock) return of(this.mockData.find(d => d.id === id));
    return this.http.get<DriverMaster>(`${this.baseUrl}/${id}`);
  }

  create(data: DriverMaster): Observable<DriverMaster> {
    if (this.useMock) {
      const created = { ...data, id: Date.now() };
      this.mockData = [...this.mockData, created];
      return of(created);
    }
    return this.http.post<DriverMaster>(this.baseUrl, data);
  }

  update(id: number, data: DriverMaster): Observable<DriverMaster> {
    if (this.useMock) {
      const updated = { ...data, id };
      this.mockData = this.mockData.map(d => (d.id === id ? updated : d));
      return of(updated);
    }
    return this.http.put<DriverMaster>(`${this.baseUrl}/${id}`, data);
  }

  delete(id: number): Observable<void> {
    if (this.useMock) {
      this.mockData = this.mockData.filter(d => d.id !== id);
      return of(void 0);
    }
    return this.http.delete<void>(`${this.baseUrl}/${id}`);
  }

    /** True when another driver already uses this licence number. */
  isLicenceTaken(licenceNo: string, excludeId: number | null): Observable<boolean> {
    if (this.useMock) {
      const taken = this.mockData.some(
        d => d.licenceNo.toUpperCase() === licenceNo.toUpperCase() && d.id !== excludeId,
      );
      return of(taken);
    }
    // Placeholder endpoint: adjust to whatever your backend exposes.
    return this.http
      .get<{ exists: boolean }>(`${this.baseUrl}/licence-exists`, {
        params: { licenceNo, ...(excludeId ? { excludeId } : {}) },
      })
      .pipe(map(response => response.exists));
  }
}