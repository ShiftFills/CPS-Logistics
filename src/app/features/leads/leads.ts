import { Component, computed, inject, signal } from '@angular/core';
import { ColumnDef, Table, TableAction } from '../../shared/components/table/table';
import { Filter, FilterDef } from '../../shared/components/filter/filter';
import { Pagination } from '../../shared/components/pagination/pagination';

import { SearchService } from '../../core/services/search';
import { SearchableSelect } from '../../shared/components/searchable-select/searchable-select';
import { ToastService } from '../../core/services/toast';
import { DialogService } from '../../core/services/dialog';
import { PageHeading } from '../../shared/components/page-heading/page-heading';
import { KpiCard } from '../../shared/components/kpi-card/kpi-card';
import {
  LeadStatusDialogLead,
  LeadStatusHistoryEntry,
  LeadStatusUpdate,
  UpdateStatus,
} from './update-status/update-status';

@Component({
  imports: [Pagination, Table, Filter, PageHeading, KpiCard, UpdateStatus],
  selector: 'app-leads',
  styleUrl: './leads.scss',
  templateUrl: './leads.html',
})
export class Leads {
  public isDarkMode = signal<boolean>(false);
  showFilters = signal(false);
  // Ensure toggleTheme is accessible by the template click handler
  // public toggleTheme(): void {
  //   this.isDarkMode.set(!this.isDarkMode());

  //   if (this.isDarkMode()) {
  //     document.body.setAttribute('data-theme', 'dark');
  //   } else {
  //     document.body.removeAttribute('data-theme');
  //   }
  // }

  currentPage = signal<number>(1);
  private toastService = inject(ToastService);
  selectedLead = signal<LeadStatusDialogLead | null>(null);
  leadStatusHistory = signal<Record<string, LeadStatusHistoryEntry[]>>({
    'LD-2403': [
      {
        contactDate: '20 Sep 2026',
        followUpDate: '20 Oct 2026',
        feedback: 'Customer requested quotation after internal discussion.',
        updatedBy: 'Arun',
        status: 'Follow-up',
      },
      {
        contactDate: '18 Sep 2026',
        followUpDate: '20 Oct 2026',
        feedback: 'Initial enquiry received; quotation details shared.',
        updatedBy: 'Arun',
        status: 'Enquiry',
      },
    ],
  });
  activeFilters = signal<Record<string, string>>({});

  private searchService = inject(SearchService);

  searchQuery = this.searchService.searchQuery;

  searchedLeadData = computed(() => {
    const search = this.searchQuery().trim().toLowerCase();

    if (!search) {
      return this.leadData();
    }

    return this.leadData().filter(row =>
      Object.values(row).some(value =>
        String(value).toLowerCase().includes(search)
      )
    );
  });




  columns: ColumnDef[] = [
    { key: 'leadId', label: 'LEAD ID', type: 'link', width: 110, sortable: true, cellClass: 'cell-small' },
    { key: 'customer', label: 'CUSTOMER', width: 170, sortable: true, cellClass: 'cell-strong' },
    { key: 'contact', label: 'CONTACT', width: 180, sortable: true },
    { key: 'location', label: 'LOCATION', width: 120, align: 'center', sortable: true, cellClass: 'cell-small' },
    { key: 'assignedDate', label: 'ASSIGNED DATE', width: 150, align: 'center', sortable: true, cellClass: 'cell-small' },
    {
      key: 'status', label: 'STATUS', type: 'badge', width: 150, align: 'center', sortable: true,
      badgeTypeMap: {
        'In progress': 'badge-in-progress',
        'Follow-up': 'badge-follow-up',
        'New': 'badge-new'
      }
    },
    { key: 'followUp', label: 'FOLLOW-UP', width: 150, align: 'center', sortable: true, cellClass: 'cell-small' },
    {
      key: 'priority', label: 'PRIORITY', type: 'badge', width: 130, align: 'center', sortable: true,
      badgeTypeMap: {
        'High': 'badge-high',
        'Medium': 'badge-medium',
        'Low': 'badge-low'
      }
    },
    { key: 'actions', label: 'ACTION', type: 'actions', width: 90, align: 'center', sortable: false }
  ];
  readonly kpiMetrics = [
    { label: 'Total Assigned', value: 14, trend: 2, dir: 'up' as const, tone: 'blue' as const, icon: 'assets/icons/totally-assigned.svg' },
    { label: "Today's Follow-up", value: 8, trend: 3, dir: 'up' as const, tone: 'orange' as const, icon: 'assets/icons/todays-followup.svg' },
    { label: 'Rejected', value: 15, trend: 4, dir: 'down' as const, tone: 'rose' as const, icon: 'assets/icons/rejected.svg' },
    { label: 'Enquiry', value: 6, trend: 3, dir: 'up' as const, tone: 'purple' as const, icon: 'assets/icons/enquiry.svg' },
    { label: 'Confirmed / Converted', value: 6, trend: 3, dir: 'up' as const, tone: 'green' as const, icon: 'assets/icons/confrimed.svg' },
  ];

  filteredLeadData = computed(() => {
    const data = this.leadData();

    const search = this.searchQuery().trim().toLowerCase();
    const filters = this.activeFilters();

    return data.filter(row => {

      // 1. Global search
      const searchMatch =
        !search ||
        Object.values(row).some(value =>
          String(value).toLowerCase().includes(search)
        );

      // 2. Existing column filters
      const customerMatch =
        !filters['customer'] ||
        row.customer
          .toLowerCase()
          .includes(filters['customer'].toLowerCase());

      const leadIdMatch =
        !filters['leadId'] ||
        row.leadId
          .toLowerCase()
          .includes(filters['leadId'].toLowerCase());

      // Add your other existing filters here...

      return (
        searchMatch &&
        customerMatch &&
        leadIdMatch
      );
    });
  });

  tableActions: TableAction[] = [
    {
      id: 'update',
      label: 'Update Status',
      icon: 'icon-update'
    },
    {
      id: 'convert',
      label: 'Convert to Enquiry',
      icon: 'icon-convert'
    },
    {
      id: 'quotation',
      label: 'Generate Quotation',
      icon: 'icon-quotation'
    },
    {
      id: 'reject',
      label: 'Reject Lead',
      icon: 'icon-reject',
      variant: 'danger'
    }
  ];

  leadData = signal([
    { leadId: 'LD-2403', customer: 'Suresh Kumar', contact: '+91 9876543210', location: 'CHN→BLR', assignedDate: '19 Sep 2026', status: 'In progress', followUp: '-', priority: 'High' },
    { leadId: 'LD-2408', customer: 'Meena Textiles', contact: '+91 9876543210', location: 'CHN→BLR', assignedDate: '20 Sep 2026', status: 'Follow-up', followUp: '29 Sep 2026', priority: 'High' },
    { leadId: 'LD-2409', customer: 'Karthik Traders', contact: '+91 9876543210', location: 'CHN→BLR', assignedDate: '21 Sep 2026', status: 'New', followUp: '-', priority: 'Medium' },
    { leadId: 'LD-2410', customer: 'Anitha R', contact: '+91 9876543210', location: 'CHN→BLR', assignedDate: '21 Sep 2026', status: 'In progress', followUp: '-', priority: 'Medium' },
    { leadId: 'LD-2415', customer: 'Balaji Logistics', contact: '+91 9876543210', location: 'CHN→BLR', assignedDate: '21 Sep 2026', status: 'Follow-up', followUp: '29 Sep 2026', priority: 'Low' },
    { leadId: 'LD-2420', customer: 'Ram Logistics', contact: '+91 9876543210', location: 'CHN→BLR', assignedDate: '21 Sep 2026', status: 'New', followUp: '-', priority: 'Low' }
  ]);

  allLeadData = signal([
    {
      leadId: 'LD-2403',
      customer: 'Suresh Kumar',
      contact: '+91 9876543210',
      location: 'CHN→BLR',
      assignedDate: '19 Sep 2026',
      status: 'In progress',
      followUp: '-',
      priority: 'High'
    },

    {
      leadId: 'LD-2408',
      customer: 'Meena Textiles',
      contact: '+91 9876543210',
      location: 'CHN→BLR',
      assignedDate: '20 Sep 2026',
      status: 'Follow-up',
      followUp: '29 Sep 2026',
      priority: 'High'
    },

    {
      leadId: 'LD-2409',
      customer: 'Karthik Traders',
      contact: '+91 9876543210',
      location: 'CHN→BLR',
      assignedDate: '21 Sep 2026',
      status: 'New',
      followUp: '-',
      priority: 'Medium'
    },

    {
      leadId: 'LD-2410',
      customer: 'Anitha R',
      contact: '+91 9876543210',
      location: 'CHN→BLR',
      assignedDate: '21 Sep 2026',
      status: 'In progress',
      followUp: '-',
      priority: 'Medium'
    },

    {
      leadId: 'LD-2415',
      customer: 'Balaji Logistics',
      contact: '+91 9876543210',
      location: 'CHN→BLR',
      assignedDate: '21 Sep 2026',
      status: 'Follow-up',
      followUp: '29 Sep 2026',
      priority: 'Low'
    },

    {
      leadId: 'LD-2420',
      customer: 'Ram Logistics',
      contact: '+91 9876543210',
      location: 'CHN→BLR',
      assignedDate: '21 Sep 2026',
      status: 'New',
      followUp: '-',
      priority: 'Low'
    }
  ]);




  filterConfig: FilterDef[] = [

    {
      key: 'customer',
      label: 'Customer',
      type: 'text'
    },

    {
      key: 'leadId',
      label: 'Lead ID',
      type: 'text'
    },

    {
      key: 'location',
      label: 'Location',
      type: 'text'
    },

    {
      key: 'status',
      label: 'Status',
      type: 'select',
      options: [
        {
          label: 'New',
          value: 'New'
        },
        {
          label: 'In progress',
          value: 'In progress'
        },
        {
          label: 'Follow-up',
          value: 'Follow-up'
        }
      ]
    },

    {
      key: 'priority',
      label: 'Priority',
      type: 'select',
      options: [
        {
          label: 'High',
          value: 'High'
        },
        {
          label: 'Medium',
          value: 'Medium'
        },
        {
          label: 'Low',
          value: 'Low'
        }
      ]
    }

  ];



  toggleFilters(event: Event): void {
    event.stopPropagation();

    this.showFilters.update(value => !value);
  }


  onFiltersApplied(filters: Record<string, string>): void {
    this.activeFilters.set(filters);

    // Reset pagination when filtering
    this.currentPage.set(1);
  }
  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  handleAction(event: { actionId: string; item: any }): void {
    if (event.actionId === 'update') {
      this.openUpdateStatus(event.item as LeadStatusDialogLead);
      return;
    }

    console.log(`Action: ${event.actionId}`, event.item);
  }

  openUpdateStatus(lead: LeadStatusDialogLead): void {
    this.selectedLead.set(lead);
  }

  closeUpdateStatus(): void {
    this.selectedLead.set(null);
  }

  saveLeadStatus(update: LeadStatusUpdate): void {
    const displayFollowUpDate = new Date(`${update.followUpDate}T00:00:00`).toLocaleDateString('en-GB', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });

    this.leadData.update(rows => rows.map(row => row.leadId === update.leadId
      ? { ...row, status: update.status, followUp: displayFollowUpDate }
      : row));
    this.leadStatusHistory.update(history => ({
      ...history,
      [update.leadId]: [
        {
          contactDate: new Date().toLocaleDateString('en-GB', { day: '2-digit', month: 'short' }),
          followUpDate: displayFollowUpDate,
          feedback: update.feedback,
          updatedBy: 'You',
          status: update.status,
        },
        ...(history[update.leadId] ?? []),
      ],
    }));

    this.closeUpdateStatus();
    this.toastService.success('Lead status updated successfully.');
  }

  onColumnsChanged(updatedColumns: ColumnDef[]): void {
    this.columns = updatedColumns;
  }



  closeFilters(): void {
    this.showFilters.set(false);
  }

  countryOptions = [
    'All countries',
    'India',
    'United States',
    'United Kingdom',
    'Canada',
    'Australia',
    'Germany',
    'France',
    'Japan',
    'Singapore'
  ];

  selectedCountry = 'All countries';

  onCountryChange(value: string): void {
    this.selectedCountry = value;

    console.log('Selected:', value);
  }


  saveLead(): void {

    // API/save logic

    this.toastService.success('Lead saved successfully');
  }

  deleteLead(): void {

    this.toastService.error('Failed to delete lead');
  }


  infoLead(): void {

    this.toastService.info('Lead information retrieved');
  }

  warningLead(): void {

    this.toastService.warning('Lead has pending actions');
  }

  private dialogService = inject(DialogService);

  testDialog(): void {
    this.dialogService.open({
      title: 'Delete Lead',
      message: 'Are you sure you want to delete this lead?',
      confirmText: 'Delete',
      cancelText: 'Cancel',

      onConfirm: () => {
        console.log('Confirmed');
      },

      onCancel: () => {
        console.log('Cancelled');
      }
    });
  }
}
