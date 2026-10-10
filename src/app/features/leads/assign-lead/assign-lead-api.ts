import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { SelectOption } from '../../../shared/components/select/select';
import { AssignLeadsRequest, PagedResult, UnassignedLead } from './assign-lead.model';

@Injectable({ providedIn: 'root' })
export class AssignLeadApi {
  // Mock data only. Replace the method bodies with HttpClient calls
  // once the backend is ready (and add provideHttpClient() in app.config.ts).
  private leads: UnassignedLead[] = this.buildMockLeads();

  /** One page of unassigned leads. `page` starts at 1. */
  getUnassignedLeads(page: number, pageSize: number): Observable<PagedResult<UnassignedLead>> {
    const start = (page - 1) * pageSize;

    return of({
      items: this.leads.slice(start, start + pageSize),
      total: this.leads.length,
    }).pipe(delay(300));
  }

  /** Options for the "Assign To" dropdown. */
  getExecutives(): Observable<SelectOption[]> {
    return of<SelectOption[]>([
      { label: 'Arun Prakash', value: 'EMP-101' },
      { label: 'Divya Raman', value: 'EMP-102' },
      { label: 'Karthik Subramanian', value: 'EMP-103' },
      { label: 'Priya Nair', value: 'EMP-104' },
      { label: 'Vignesh Kumar', value: 'EMP-105' },
    ]).pipe(delay(200));
  }

  /** Assigns the leads, which then disappear from the unassigned list. */
  assign(request: AssignLeadsRequest): Observable<void> {
    const assigned = new Set(request.leadIds);
    this.leads = this.leads.filter(lead => !assigned.has(lead.leadId));

    return of(undefined).pipe(delay(300));
  }

  private buildMockLeads(): UnassignedLead[] {
    // First six rows are exactly the Figma rows.
    const figmaRows: UnassignedLead[] = [
      { leadId: 'LD-2403', customer: 'Suresh Kumar',    contact: '+91 9876543210', route: 'CHN→BLR', date: '2026-09-19' },
      { leadId: 'LD-2408', customer: 'Meena Textiles',  contact: '+91 9876543210', route: 'CHN→BLR', date: '2026-09-20' },
      { leadId: 'LD-2409', customer: 'Karthik Traders', contact: '+91 9876543210', route: 'CHN→BLR', date: '2026-09-21' },
      { leadId: 'LD-2410', customer: 'Anitha R',        contact: '+91 9876543210', route: 'CHN→BLR', date: '2026-09-20' },
      { leadId: 'LD-2415', customer: 'Balaji Logistics', contact: '+91 9876543210', route: 'CHN→BLR', date: '2026-09-21' },
      { leadId: 'LD-2420', customer: 'Ram Logistics',   contact: '+91 9876543210', route: 'CHN→BLR', date: '2026-09-24' },
    ];

    // 48 more so 54 leads give 9 pages at 6 per page.
    const customers = ['Lakshmi Traders', 'Surya Exports', 'Vel Transports', 'Kaveri Textiles', 'Mani & Sons', 'Deepa Agencies'];
    const routes = ['CHN→BLR', 'CHN→HYD', 'CHN→MDU', 'BLR→CHN'];

    const generated: UnassignedLead[] = Array.from({ length: 48 }, (_, i) => ({
      leadId: `LD-${2421 + i}`,
      customer: customers[i % customers.length],
      contact: '+91 9876543210',
      route: routes[i % routes.length],
      date: `2026-09-${String(22 + (i % 7)).padStart(2, '0')}`,
    }));

    return [...figmaRows, ...generated];
  }
}