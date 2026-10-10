import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SelectOption } from '../../shared/components/select/select';
import { Lead, LeadPrimaryDetails, LeadStatus } from './lead.model';

@Injectable({ providedIn: 'root' })
export class LeadService {
  // Mock data only for now. Replace the bodies below with HttpClient calls
  // once the backend is ready (and add provideHttpClient() in app.config.ts).
  private leads: Lead[] = [];

  // Your Leads list sample data ends at LD-2420, so new ids continue from 2421.
  private nextNumber = 2421;

  /** Options for the Designation dropdown. */
  getDesignationOptions(): SelectOption[] {
    return [
      { label: 'Owner / Proprietor', value: 'Owner / Proprietor' },
      { label: 'Director', value: 'Director' },
      { label: 'Manager', value: 'Manager' },
      { label: 'Logistics Manager', value: 'Logistics Manager' },
      { label: 'Purchase Manager', value: 'Purchase Manager' },
      { label: 'Other', value: 'Other' },
    ];
  }

  /** Options for the Lead Source dropdown (also shown as quick-pick chips). */
  getLeadSourceOptions(): SelectOption[] {
    return [
      'Reference',
      'Website',
      'Existing Customer',
      'Cold Call',
      'Email',
      'LinkedIn / Social Media',
      'Exhibition / Meeting',
      'Other',
    ].map(v => ({ label: v, value: v }));
  }

  /** Create Lead button: a complete, validated lead. */
  create(data: LeadPrimaryDetails): Observable<Lead> {
    return this.save(data, 'New');
  }

  /** Save Draft button: any fields may be empty. */
  saveDraft(data: Partial<LeadPrimaryDetails>): Observable<Lead> {
    return this.save(data, 'Draft');
  }

  private save(data: Partial<LeadPrimaryDetails>, status: LeadStatus): Observable<Lead> {
    const number = this.nextNumber++;

    const lead: Lead = {
      dateOfContact: '',
      customerName: '',
      contactPersonName: '',
      designation: '',
      contactNumber: '',
      emailId: '',
      additionalDetails: '',
      ...data,
      id: number,
      leadId: `LD-${number}`,
      status,
      createdAt: new Date().toISOString(),
    };

    this.leads = [...this.leads, lead];
    return of(lead).pipe(delay(300)); // small delay, same as your other mock services
  }

    /**
   * TEMPORARY sample options for the Section 2 dropdowns, until the real
   * lists (or a master/backend) are provided. Replace the values freely.
   */
  getRequirementOptions(): Record<
    'routes' | 'frequencies' | 'vehicles' | 'localTransport' | 'dedicatedVehicles',
    SelectOption[]
  > {
    const vehicles = ['Mini Truck', 'Open Truck', 'Closed Container', 'Trailer'].map(v => ({
      label: v,
      value: v,
    }));

    return {
      routes: ['Mumbai → Delhi', 'Chennai → Bengaluru', 'Pune → Hyderabad'].map(v => ({
        label: v,
        value: v,
      })),
      frequencies: ['Daily', 'Weekly', 'Fortnightly', 'Monthly', 'Ad hoc'].map(v => ({
        label: v,
        value: v,
      })),
      vehicles,
      localTransport: ['Required', 'Not required'].map(v => ({ label: v, value: v })),
      dedicatedVehicles: vehicles,
    };
  }
}