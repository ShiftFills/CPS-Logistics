import { ChangeDetectionStrategy, Component, computed, signal } from '@angular/core';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { Button } from '../../shared/components/button/button';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import { ColumnDef, Table, TableAction } from '../../shared/components/table/table';

import { SortDirection } from '../../shared/components/sort-header/sort-header';
import { sortRows } from '../../shared/utils/sort.util';
import { Enquiry } from './enquiry.model';
import { Pagination } from '../../shared/components/pagination/pagination';

@Component({
  selector: 'app-enquiry-quotation',
  imports: [PageHeading, Button, KpiCard, Table, Pagination],
  templateUrl: './enquiry-quotation.html',
  styleUrl: './enquiry-quotation.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EnquiryQuotation {
  readonly pageSize = 5;
  readonly currentPage = signal(1);
  readonly sort = signal<{ key: string; direction: SortDirection }>({ key: '', direction: '' });
  readonly kpiMetrics = [
    { label: 'New Enquires', value: 14, trend: 2, dir: 'up' as const, tone: 'blue' as const, icon: 'assets/icons/newEnquires.svg' },
    { label: 'Need to Confirm', value: 8, trend: 3, dir: 'up' as const, tone: 'orange' as const, icon: 'assets/icons/needToConfirm.svg' },
    { label: 'Confirmed', value: 15, trend: 4, dir: 'up' as const, tone: 'green' as const, icon: 'assets/icons/confirmed.svg' },
    { label: 'Quotation', value: 6, trend: 3, dir: 'up' as const, tone: 'purple' as const, icon: 'assets/icons/quotation.svg' },
  ];

  // A signal because the table emits (columnsChanged) when a column is moved or resized
  readonly columns = signal<ColumnDef[]>([
    { key: 'enquiryId', label: 'ENQUIRY ID', type: 'link', width: 110, sortable: true, cellClass: 'cell-small' },
    { key: 'customer', label: 'CUSTOMER', width: 170, sortable: true, cellClass: 'cell-strong' },
    { key: 'contact', label: 'CONTACT', width: 170, sortable: true },
    { key: 'location', label: 'LOCATION', width: 110, align: 'center', sortable: true, cellClass: 'cell-small' },
    { key: 'shipment', label: 'SHIPMENT', width: 100, align: 'center', sortable: true, cellClass: 'cell-small' },
    { key: 'pickupDate', label: 'PICKUP DATE', width: 130, align: 'center', sortable: true, cellClass: 'cell-small' },
    {
      key: 'status', label: 'STATUS', type: 'badge', width: 160, align: 'center', sortable: true,
      badgeTypeMap: {
        'In progress': 'badge-in-progress',
        'Follow-up': 'badge-follow-up',
        'Enquiry': 'badge-pill-purple',        // style added in Step 4
        'Need to confirm': 'badge-pill-orange',
        'Assigned': 'badge-pill-blue',
        'Confirmed': 'badge-pill-green',
      },
    },
    {
      key: 'priority', label: 'PRIORITY', type: 'badge', width: 130, align: 'center', sortable: true,
      badgeTypeMap: {
        'High': 'badge-high',
        'Medium': 'badge-medium',
        'Low': 'badge-low',
      },
    },
    { key: 'actions', label: 'ACTION', type: 'actions', width: 90, align: 'center', sortable: false },
  ]);

  readonly tableActions: TableAction[] = [
    { id: 'update', label: 'Update Status', icon: 'icon-update' },
    { id: 'convert', label: 'Convert to Enquiry', icon: 'icon-convert' },
    { id: 'quotation', label: 'Generate Quotation', icon: 'icon-quotation' },
    { id: 'reject', label: 'Reject Lead', icon: 'icon-reject', variant: 'danger' },
  ];

  readonly enquiries = signal<Enquiry[]>([
    { enquiryId: 'EQ-2403', customer: 'Suresh Kumar', contact: '+91 9876543210', location: 'CHN→BLR', shipment: 'FTL', pickupDate: '19 Sep 2026', status: 'In progress', priority: 'High' },
    { enquiryId: 'EQ-2408', customer: 'Meena Textiles', contact: '+91 9876543210', location: 'CHN→BLR', shipment: 'Local', pickupDate: '20 Sep 2026', status: 'Follow-up', priority: 'High' },
    { enquiryId: 'EQ-2409', customer: 'Karthik Traders', contact: '+91 9876543210', location: 'CHN→BLR', shipment: 'FTL', pickupDate: '21 Sep 2026', status: 'Enquiry', priority: 'Medium' },
    { enquiryId: 'EQ-2410', customer: 'Anitha R', contact: '+91 9876543210', location: 'CHN→BLR', shipment: 'Courier', pickupDate: '21 Sep 2026', status: 'Need to confirm', priority: 'Medium' },
    { enquiryId: 'EQ-2415', customer: 'Balaji Logistics', contact: '+91 9876543210', location: 'CHN→BLR', shipment: 'FTL', pickupDate: '21 Sep 2026', status: 'Assigned', priority: 'Low' },
    { enquiryId: 'EQ-2420', customer: 'Ram Logistics', contact: '+91 9876543210', location: 'CHN→BLR', shipment: 'Local', pickupDate: '21 Sep 2026', status: 'Confirmed', priority: 'Low' },
  ]);

  addEnquiry(): void {
    // Placeholder until the "New Enquiry" screen exists
    console.log('New enquiry');
  }

  onAction(event: { actionId: string; item: Enquiry }): void {
    // Placeholder: wire to real handlers later
    console.log(`Action: ${event.actionId}`, event.item);
  }

   // Sort the full list first, then slice one page (the table only ever sees one page)
  private readonly sortedEnquiries = computed(() =>
    sortRows(this.enquiries(), this.sort().key, this.sort().direction),
  );

  readonly pagedEnquiries = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.sortedEnquiries().slice(start, start + this.pageSize);
  });

  onSort(event: { key: string; direction: SortDirection }): void {
    this.sort.set(event);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}