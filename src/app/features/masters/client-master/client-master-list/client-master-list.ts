import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { PageHeading } from '../../../../shared/components/page-heading/page-heading';
import { Button } from '../../../../shared/components/button/button';
import { Card } from '../../../../shared/components/card/card';
import { ColumnDef, Table } from '../../../../shared/components/table/table';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Modal } from '../../../../shared/components/modal/modal';
import { ClientMasterForm } from '../client-master-form/client-master-form';
import { ClientMaster } from '../client-master';
import { ClientMaster as ClientMasterRecord } from '../client-master.model';
import { SortDirection } from '../../../../shared/components/sort-header/sort-header';
import { sortRows } from '../../../../shared/utils/sort.util';
interface StatCard {
  key: 'total' | 'active' | 'inactive' | 'potential';
  label: string;
  value: number;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: string;
  background: string;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeading, Button, Card, Table, Pagination, Modal, ClientMasterForm],
  selector: 'app-client-master-list',
  styleUrl: './client-master-list.scss',
  templateUrl: './client-master-list.html',
})
export class ClientMasterList implements OnInit {
  private service = inject(ClientMaster);

  clients = signal<ClientMasterRecord[]>([]);
  loading = signal(false);
  formOpen = signal(false);
  currentPage = signal(1);
  readonly pageSize = 6;
  sort = signal<{ key: string; direction: SortDirection }>({ key: '', direction: '' });
  sortedClients = computed(() => sortRows(this.clients(), this.sort().key, this.sort().direction));
  paginatedClients = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.sortedClients().slice(start, start + this.pageSize);
  });

  onSort(sort: { key: string; direction: SortDirection }): void {
    this.sort.set(sort);
    this.currentPage.set(1);
  }
  stats = signal<StatCard[]>([
    {
      key: 'total', label: 'Total Clients', value: 12, trend: '2 vs last week', trendDirection: 'up',
      icon: 'assets/icons/total-customers.svg', background: 'var(--chart-blue-bg)'
    },
    {
      key: 'active', label: 'Active Clients', value: 8, trend: '1 vs last week', trendDirection: 'up',
      icon: 'assets/icons/active-customers.svg', background: 'var(--color-accent-light)'
    },
    {
      key: 'inactive', label: 'Inactive Clients', value: 6, trend: '3 vs last week', trendDirection: 'up',
      icon: 'assets/icons/inactive-customers.svg', background: 'var(--chart-purple-bg)'
    },
    {
      key: 'potential', label: 'Potential Clients', value: 15, trend: '4 vs last week', trendDirection: 'up',
      icon: 'assets/icons/potential-customers.svg', background: 'var(--chart-green-bg)'
    },
  ]);

  columns = signal<ColumnDef[]>([
    { key: 'city', label: 'Location', sortable: true, width: 90 },
    { key: 'clientName', label: 'Customer Name', sortable: true, width: 125 },
    { key: 'contactPerson1', label: 'POC Name', sortable: true, width: 105 },
    { key: 'contactNumber1', label: 'POC Number', sortable: true, width: 105 },
    { key: 'accountContact', label: 'Acc Cont', sortable: true, width: 85 },
    { key: 'accountContactNo', label: 'Acc Cont No', sortable: true, width: 100 },
    { key: 'category', label: 'Category', sortable: true, width: 95 },
    { key: 'cpsFollowUpPerson', label: 'CPS Follow Up Person', sortable: true, width: 120, headerClass: 'header-wrap' },
    { key: 'remarks', label: 'Remarks', sortable: true, width: 90 },
  ]);
  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: clients => {
        this.clients.set(clients);
        const lastPage = Math.max(1, Math.ceil(clients.length / this.pageSize));
        this.currentPage.update(page => Math.min(page, lastPage));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  addClient(): void {
    this.formOpen.set(true);
  }

  closeForm(): void {
    this.formOpen.set(false);
  }

  onClientSaved(): void {
    this.closeForm();
    this.load();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }
}
