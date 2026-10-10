import { Component, signal, computed, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { Button } from './shared/components/button/button';
import { Input } from './shared/components/input/input';
// import { TableAction } from './core/models/table.model';
import { ColumnDef, Table, TableAction } from './shared/components/table/table';
import { Pagination } from './shared/components/pagination/pagination';
import {
  Filter,
  FilterDef
} from './shared/components/filter/filter';

import { SearchService } from './core/services/search';

@Component({
  imports: [RouterOutlet, ],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html',
})
export class App {

  public isDarkMode = signal<boolean>(false);
  showFilters = signal(false);
  // Ensure toggleTheme is accessible by the template click handler
  public toggleTheme(): void {
    this.isDarkMode.set(!this.isDarkMode());

    if (this.isDarkMode()) {
      document.body.setAttribute('data-theme', 'dark');
    } else {
      document.body.removeAttribute('data-theme');
    }
  }
  protected readonly title = signal('Transport-Logistics');
  currentPage = signal<number>(1);


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

    {
      key: 'leadId',
      label: 'LEAD ID',
      type: 'link',
      width: 120,
      sortable: true
    },

    {
      key: 'customer',
      label: 'CUSTOMER',
      width: 130,
      sortable: true
    },

    {
      key: 'contact',
      label: 'CONTACT',
      width: 140,
      sortable: true
    },

    {
      key: 'location',
      label: 'LOCATION',
      width: 160,
      sortable: true
    },

    {
      key: 'assignedDate',
      label: 'ASSIGNED DATE',
      width: 120,
      sortable: true
    },

    {
      key: 'status',
      label: 'STATUS',
      type: 'badge',
      width: 130,
      sortable: true,
      badgeTypeMap: {
        'In progress': 'badge-in-progress',
        'Follow-up': 'badge-follow-up',
        'New': 'badge-new'
      }
    },

    {
      key: 'followUp',
      label: 'FOLLOW-UP',
      width: 140,
      sortable: true
    },

    {
      key: 'priority',
      label: 'PRIORITY',
      type: 'badge',
      width: 120,
      sortable: true,
      badgeTypeMap: {
        'High': 'badge-high',
        'Medium': 'badge-medium',
        'Low': 'badge-low'
      }
    },

    {
      key: 'actions',
      label: 'ACTION',
      type: 'actions',
      width: 90,
      sortable: false
    }

  ];


  // filteredLeadData = computed(() => {

  //   const data = this.allLeadData();
  //   const filters = this.activeFilters();

  //   return data.filter(row => {

  //     const customerMatch =
  //       !filters['customer'] ||
  //       row.customer
  //         .toLowerCase()
  //         .includes(filters['customer'].toLowerCase());

  //     const leadIdMatch =
  //       !filters['leadId'] ||
  //       row.leadId
  //         .toLowerCase()
  //         .includes(filters['leadId'].toLowerCase());

  //     const locationMatch =
  //       !filters['location'] ||
  //       row.location
  //         .toLowerCase()
  //         .includes(filters['location'].toLowerCase());

  //     const statusMatch =
  //       !filters['status'] ||
  //       row.status === filters['status'];

  //     const priorityMatch =
  //       !filters['priority'] ||
  //       row.priority === filters['priority'];

  //     return (
  //       customerMatch &&
  //       leadIdMatch &&
  //       locationMatch &&
  //       statusMatch &&
  //       priorityMatch
  //     );
  //   });

  // });

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

  // filterConfig: FilterDef[] = [

  //   {
  //     key: 'customer',
  //     label: 'Customer',
  //     type: 'text'
  //   },

  //   {
  //     key: 'leadId',
  //     label: 'Lead ID',
  //     type: 'text'
  //   },

  //   {
  //     key: 'location',
  //     label: 'Location',
  //     type: 'text'
  //   },

  //   {
  //     key: 'status',
  //     label: 'Status',
  //     type: 'select',
  //     options: [
  //       {
  //         label: 'New',
  //         value: 'New'
  //       },
  //       {
  //         label: 'In progress',
  //         value: 'In progress'
  //       },
  //       {
  //         label: 'Follow-up',
  //         value: 'Follow-up'
  //       }
  //     ]
  //   },

  //   {
  //     key: 'priority',
  //     label: 'Priority',
  //     type: 'select',
  //     options: [
  //       {
  //         label: 'High',
  //         value: 'High'
  //       },
  //       {
  //         label: 'Medium',
  //         value: 'Medium'
  //       },
  //       {
  //         label: 'Low',
  //         value: 'Low'
  //       }
  //     ]
  //   }

  // ];


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
    console.log(`Action: ${event.actionId}`, event.item);
  }

  onColumnsChanged(updatedColumns: ColumnDef[]): void {
    this.columns = updatedColumns;
  }



  closeFilters(): void {
    this.showFilters.set(false);
  }
}
