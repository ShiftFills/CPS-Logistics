import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { formatDate } from '@angular/common';
import { PageHeading } from '../../../../shared/components/page-heading/page-heading';
import { Button } from '../../../../shared/components/button/button';
import { Card } from '../../../../shared/components/card/card';
import { SearchBox } from '../../../../shared/components/search-box/search-box';
import { Select, SelectOption } from '../../../../shared/components/select/select';
import { ColumnDef, Table, TableAction } from '../../../../shared/components/table/table';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { SortDirection } from '../../../../shared/components/sort-header/sort-header';
import { sortRows } from '../../../../shared/utils/sort.util';
import { DialogService } from '../../../../core/services/dialog';
import { ToastService } from '../../../../core/services/toast';
import { DriverMasterService } from '../driver-master';
import { DriverMaster } from '../driver-master.model';
import { LicenceState, licenceStatus, startOfToday } from '../driver-master.util';
import { Modal } from '../../../../shared/components/modal/modal';
import { DriverMasterForm } from '../driver-master-form/driver-master-form';
import { map } from 'rxjs/operators';
import { delay } from 'rxjs/operators';
interface StatCard {
  key: 'total' | 'active' | 'inactive' | 'expiring';
  label: string;
  value: number;
  trend: string;
  icon: string;
  background: string;
}

// Flat row for the shared table (it renders row[column.key]).
interface DriverRow extends DriverMaster {
  status: 'Active' | 'Inactive';
  joinDateText: string;
  licenceValidityText: string;
  licenceState: LicenceState;
  licencePill: string;
  licencePillClass: string;
}

// Columns display dd-MM-yyyy text, but must sort on the ISO date.
const SORT_KEYS: Record<string, string> = {
  licenceValidityText: 'licenceValidity',
  joinDateText: 'joinDate',
};
const PILL_CLASS: Record<LicenceState, string> = {
  valid: '',
  expiring: 'badge-pill-orange',
  expired: 'badge-pill-rose',
};
const display = (iso: string): string => (iso ? formatDate(iso, 'dd-MM-yyyy', 'en-US') : '-');

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeading, Button, Card, SearchBox, Select, Table, Pagination, Modal, DriverMasterForm],
  host: { class: 'master-list' },
  selector: 'app-driver-master-list',
  styleUrl: './driver-master-list.scss',
  templateUrl: './driver-master-list.html',
})
export class DriverMasterList implements OnInit {
  private service = inject(DriverMasterService);
  private dialog = inject(DialogService);
  private toast = inject(ToastService);

  drivers = signal<DriverMaster[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  branchFilter = signal('all');
  statusFilter = signal('all');
  licenceFilter = signal('all');
  formOpen = signal(false);
  selectedId = signal<number | null>(null);
  currentPage = signal(1);
  readonly pageSize = 6;
  sort = signal<{ key: string; direction: SortDirection }>({ key: '', direction: '' });

  // Decorated once per data change; filters, stats and the table all read from this.
  rows = computed<DriverRow[]>(() => {
    const today = startOfToday();
    return this.drivers().map(d => {
      const licence = licenceStatus(d.licenceValidity, today);
      return {
        ...d,
        status: d.isActive ? 'Active' : 'Inactive',
        joinDateText: display(d.joinDate),
        licenceValidityText: display(d.licenceValidity),
        licenceState: licence.state,
        licencePill: licence.label,
        licencePillClass: PILL_CLASS[licence.state],
      };
    });
  });

  filtered = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const branch = this.branchFilter();
    const status = this.statusFilter();
    const licence = this.licenceFilter();

    return this.rows().filter(r => {
      if (branch !== 'all' && r.branchName !== branch) return false;
      if (status !== 'all' && r.isActive !== (status === 'active')) return false;
      if (licence !== 'all' && r.licenceState !== licence) return false;
      if (!term) return true;
      return [r.driverName, r.contactNo, r.licenceNo].some(v => (v ?? '').toLowerCase().includes(term));
    });
  });

  // Sorting runs on the full list before pagination (the Table only sees one page).
  sortedRows = computed(() => {
    const { key, direction } = this.sort();
    return sortRows(this.filtered(), SORT_KEYS[key] ?? key, direction);
  });

  paginatedRows = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.sortedRows().slice(start, start + this.pageSize);
  });

  hasActiveFilters = computed(
    () =>
      !!this.searchTerm().trim() ||
      this.branchFilter() !== 'all' ||
      this.statusFilter() !== 'all' ||
      this.licenceFilter() !== 'all',
  );

  // Trend lines are static until your API provides week-over-week data.
  stats = computed<StatCard[]>(() => {
    const all = this.rows();
    return [
      {
        key: 'total', label: 'Total Drivers', value: all.length, trend: '2 vs last week',
        icon: 'assets/icons/total-customers.svg', background: 'var(--chart-blue-bg)'
      },
      {
        key: 'active', label: 'Active Drivers', value: all.filter(r => r.isActive).length, trend: '1 vs last week',
        icon: 'assets/icons/active-customers.svg', background: 'var(--color-accent-light)'
      },
      {
        key: 'inactive', label: 'Inactive Drivers', value: all.filter(r => !r.isActive).length, trend: '1 vs last week',
        icon: 'assets/icons/inactive-customers.svg', background: 'var(--chart-purple-bg)'
      },
      {
        key: 'expiring', label: 'Licence Expiring Soon', value: all.filter(r => r.licenceState === 'expiring').length,
        trend: '2 vs last week', icon: 'assets/icons/potential-customers.svg', background: 'var(--chart-green-bg)'
      },
    ];
  });

  // Built from the loaded drivers, so no extra branch API call is needed.
  branchOptions = computed<SelectOption[]>(() => {
    const names = [...new Set(this.drivers().map(d => d.branchName).filter(Boolean))].sort();
    return [{ label: 'All Branches', value: 'all' }, ...names.map(n => ({ label: n, value: n }))];
  });

  // "All" is a real value because the shared Select hides its placeholder option.
  readonly statusOptions: SelectOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];
  readonly licenceOptions: SelectOption[] = [
    { label: 'All Licences', value: 'all' },
    { label: 'Valid', value: 'valid' },
    { label: 'Expiring Soon', value: 'expiring' },
    { label: 'Expired', value: 'expired' },
  ];

  columns = signal<ColumnDef[]>([
    { key: 'driverName', label: 'Driver Name', sortable: true, width: 150 },
    { key: 'branchName', label: 'Branch', sortable: true, width: 110 },
    { key: 'contactNo', label: 'Mobile No', sortable: true, width: 115 },
    { key: 'licenceNo', label: 'Licence No', sortable: true, width: 150 },
    { key: 'licenceType', label: 'Licence Type', sortable: true, width: 105 },
    {
      key: 'licenceValidityText', label: 'Licence Validity', sortable: true, width: 200,
      pillKey: 'licencePill', pillClassKey: 'licencePillClass'
    },
    { key: 'joinDateText', label: 'Join Date', sortable: true, width: 105 },
    {
      key: 'status', label: 'Status', type: 'badge', sortable: true, width: 95,
      badgeTypeMap: { Active: 'badge-pill-green', Inactive: 'badge-gray' }
    },
    { key: 'actions', label: 'Actions', type: 'actions', align: 'center', width: 80 },
  ]);

  actions: TableAction[] = [
    { id: 'edit', label: 'Edit', icon: 'icon-doc' },
    { id: 'delete', label: 'Delete', icon: 'icon-trash', variant: 'danger' },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: drivers => {
        this.drivers.set(drivers);
        this.clampPage();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(term: string): void { this.searchTerm.set(term); this.currentPage.set(1); }
  onBranchFilter(value: string): void { this.branchFilter.set(value); this.currentPage.set(1); }
  onStatusFilter(value: string): void { this.statusFilter.set(value); this.currentPage.set(1); }
  onLicenceFilter(value: string): void { this.licenceFilter.set(value); this.currentPage.set(1); }
  onPageChange(page: number): void { this.currentPage.set(page); }

  onSort(sort: { key: string; direction: SortDirection }): void {
    this.sort.set(sort);
    this.currentPage.set(1);
  }

  addDriver(): void { this.openForm(null); }

  openForm(id: number | null): void {
    this.selectedId.set(id);
    this.formOpen.set(true);
  }

  closeForm(): void { this.formOpen.set(false); }
  onDriverSaved(): void {
    this.closeForm();
    this.load();
  }

  // Remove clicked inside the edit dialog: the global confirm dialog sits at the same
  // z-index as the modal, so close the form first and reopen it if the user cancels.
  onRemoveRequested(): void {
    const id = this.selectedId();
    const driver = this.drivers().find(d => d.id === id);
    if (!driver) return;
    this.closeForm();
    this.confirmDelete(driver, () => this.openForm(id));
  }

  onAction(event: { actionId: string; item: DriverRow }): void {
    if (event.actionId === 'edit') this.openForm(event.item.id!);
    if (event.actionId === 'delete') this.confirmDelete(event.item);
  }

  private confirmDelete(driver: DriverMaster, onCancel?: () => void): void {
    this.dialog.open({
      title: 'Delete driver',
      message: `Are you sure you want to delete ${driver.driverName}? This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: () =>
        this.service.delete(driver.id!).subscribe(() => {
          this.toast.success('Driver deleted');
          this.load();
        }),
      onCancel,
    });
  }

  private clampPage(): void {
    const lastPage = Math.max(1, Math.ceil(this.filtered().length / this.pageSize));
    this.currentPage.update(page => Math.min(page, lastPage));
  }


  
}