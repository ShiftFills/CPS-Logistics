import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { PageHeading } from '../../../../shared/components/page-heading/page-heading';
import { Button } from '../../../../shared/components/button/button';
import { Card } from '../../../../shared/components/card/card';
import { SearchBox } from '../../../../shared/components/search-box/search-box';
import { Select, SelectOption } from '../../../../shared/components/select/select';
import { ColumnDef, Table, TableAction } from '../../../../shared/components/table/table';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Modal } from '../../../../shared/components/modal/modal';
import { DialogService } from '../../../../core/services/dialog';
import { ToastService } from '../../../../core/services/toast';
import { BrokerMasterForm } from '../broker-master-form/broker-master-form';
import { BrokerMasterService } from '../broker-master';
import { BrokerMaster } from '../broker-master.model';
import { SortDirection } from '../../../../shared/components/sort-header/sort-header';
import { sortRows } from '../../../../shared/utils/sort.util';
interface StatCard {
  key: 'total' | 'active' | 'inactive' | 'high';
  label: string;
  value: number;
  icon: string;
  background: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeading, Button, Card, SearchBox, Select, Table, Pagination, Modal, BrokerMasterForm],
  selector: 'app-broker-master-list',
  styleUrl: './broker-master-list.scss',
  templateUrl: './broker-master-list.html',
})
export class BrokerMasterList implements OnInit {
  private service = inject(BrokerMasterService);
  private dialog = inject(DialogService);
  private toast = inject(ToastService);

  brokers = signal<BrokerMaster[]>([]);
  loading = signal(false);
  searchTerm = signal('');
  statusFilter = signal('all');
  priorityFilter = signal('all');
  formOpen = signal(false);
  selectedId = signal<number | null>(null);
  currentPage = signal(1);
  readonly pageSize = 6;
// Flat rows for the shared table (it renders row[column.key]).
rows = computed(() =>
  this.filtered().map(b => ({ ...b, priority: b.priority || '-', status: b.isActive ? 'Active' : 'Inactive' })),
);

// Sorting happens on the full list, before pagination (the Table only sees one page).
sort = signal<{ key: string; direction: SortDirection }>({ key: '', direction: '' });
sortedRows = computed(() => sortRows(this.rows(), this.sort().key, this.sort().direction));

paginatedRows = computed(() => {
  const start = (this.currentPage() - 1) * this.pageSize;
  return this.sortedRows().slice(start, start + this.pageSize);
});
  // KPI cards are calculated from the loaded brokers (no placeholder numbers).
  stats = computed<StatCard[]>(() => {
    const all = this.brokers();
    return [
      { key: 'total', label: 'Total Brokers', value: all.length,
        icon: 'assets/icons/total-customers.svg', background: 'var(--chart-blue-bg)' },
      { key: 'active', label: 'Active Brokers', value: all.filter(b => b.isActive).length,
        icon: 'assets/icons/active-customers.svg', background: 'var(--color-accent-light)' },
      { key: 'inactive', label: 'Inactive Brokers', value: all.filter(b => !b.isActive).length,
        icon: 'assets/icons/inactive-customers.svg', background: 'var(--chart-purple-bg)' },
      { key: 'high', label: 'High Priority', value: all.filter(b => b.priority === 'High').length,
        icon: 'assets/icons/potential-customers.svg', background: 'var(--chart-green-bg)' },
    ];
  });

  // The "All" option is a real value because the shared Select hides its placeholder option.
  readonly statusOptions: SelectOption[] = [
    { label: 'All Status', value: 'all' },
    { label: 'Active', value: 'active' },
    { label: 'Inactive', value: 'inactive' },
  ];
  readonly priorityOptions: SelectOption[] = [
    { label: 'All Priority', value: 'all' },
    { label: 'High', value: 'High' },
    { label: 'Medium', value: 'Medium' },
    { label: 'Low', value: 'Low' },
  ];

  // Recomputes only when brokers or one of the three filters change.
  filtered = computed(() => {
    const term = this.searchTerm().trim().toLowerCase();
    const status = this.statusFilter();
    const priority = this.priorityFilter();

    return this.brokers().filter(b => {
      if (status !== 'all' && b.isActive !== (status === 'active')) return false;
      if (priority !== 'all' && b.priority !== priority) return false;
      if (!term) return true;
      return [b.brokerName, b.brokerCode, b.location, b.contactPerson1, b.contactNumber1, b.email]
        .some(value => (value ?? '').toLowerCase().includes(term));
    });
  });

  hasActiveFilters = computed(
    () => !!this.searchTerm().trim() || this.statusFilter() !== 'all' || this.priorityFilter() !== 'all',
  );



 columns = signal<ColumnDef[]>([
  { key: 'brokerName', label: 'Broker Name', sortable: true, width: 130 },
  { key: 'brokerCode', label: 'Broker Code', sortable: true, width: 115 },
  { key: 'location', label: 'Location', sortable: true, width: 105 },
  { key: 'contactPerson1', label: 'Contact Person', sortable: true, width: 120 },
  { key: 'contactNumber1', label: 'Mobile No', sortable: true, width: 110 },
  { key: 'email', label: 'Email', sortable: true, width: 170 },
  {
    key: 'priority', label: 'Priority', type: 'badge', sortable: true, width: 95,
    badgeTypeMap: { High: 'badge-high', Medium: 'badge-medium', Low: 'badge-low' },
  },
  {
    key: 'status', label: 'Status', type: 'badge', sortable: true, width: 95,
    badgeTypeMap: { Active: 'badge-pill-green', Inactive: 'badge-gray' },
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
      next: brokers => {
        this.brokers.set(brokers);
        this.clampPage();
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  onSearch(term: string): void {
    this.searchTerm.set(term);
    this.currentPage.set(1);
  }

  onStatusFilter(value: string): void {
    this.statusFilter.set(value);
    this.currentPage.set(1);
  }

  onPriorityFilter(value: string): void {
    this.priorityFilter.set(value);
    this.currentPage.set(1);
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  addBroker(): void {
    this.openForm(null);
  }

  openForm(id: number | null): void {
    this.selectedId.set(id);
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  onBrokerSaved(): void {
    this.closeForm();
    this.load();
  }

  onAction(event: { actionId: string; item: BrokerMaster }): void {
    if (event.actionId === 'edit') this.openForm(event.item.id!);
    if (event.actionId === 'delete') this.confirmDelete(event.item);
  }

  // Remove clicked inside the edit dialog: the global confirm dialog sits at the
  // same z-index as the modal, so close the form first and reopen it on cancel.
  onRemoveRequested(): void {
    const id = this.selectedId();
    const broker = this.brokers().find(b => b.id === id);
    if (!broker) return;
    this.closeForm();
    this.confirmDelete(broker, () => this.openForm(id));
  }

  private confirmDelete(broker: BrokerMaster, onCancel?: () => void): void {
    this.dialog.open({
      title: 'Delete broker',
      message: `Are you sure you want to delete ${broker.brokerName}? This cannot be undone.`,
      confirmText: 'Delete',
      cancelText: 'Cancel',
      variant: 'danger',
      onConfirm: () =>
        this.service.delete(broker.id!).subscribe(() => {
          this.toast.success('Broker deleted');
          this.load();
        }),
      onCancel,
    });
  }

  private clampPage(): void {
    const lastPage = Math.max(1, Math.ceil(this.filtered().length / this.pageSize));
    this.currentPage.update(page => Math.min(page, lastPage));
  }

  onSort(sort: { key: string; direction: SortDirection }): void {
  this.sort.set(sort);
  this.currentPage.set(1);
}
}