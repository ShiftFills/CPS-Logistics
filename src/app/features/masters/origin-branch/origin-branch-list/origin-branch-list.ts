import { Component, computed, inject, OnInit, signal } from '@angular/core';
import { Router } from '@angular/router';
import { PageHeading } from '../../../../shared/components/page-heading/page-heading';
import { Button } from '../../../../shared/components/button/button';
import { Card } from '../../../../shared/components/card/card';
import { ColumnDef, Table } from '../../../../shared/components/table/table';
import { Pagination } from '../../../../shared/components/pagination/pagination';
import { Modal } from '../../../../shared/components/modal/modal';
import { OriginBranchForm } from '../origin-branch-form/origin-branch-form';
import { OriginBranchService } from '../origin-branch';
import { OriginBranch } from '../origin-branch.model';
import { SortDirection } from '../../../../shared/components/sort-header/sort-header';
import { sortRows } from '../../../../shared/utils/sort.util';
interface StatCard {
  key: 'total' | 'active' | 'inactive' | 'potential';
  label: string;
  value: number;
  trend: string;
  trendDirection: 'up' | 'down';
  icon: string;        // image path for the circle icon
  background: string;  // circle fill colour
}

@Component({
  imports: [PageHeading, Button, Card, Table, Pagination, Modal, OriginBranchForm],
  selector: 'app-origin-branch-list',
  styleUrl: './origin-branch-list.scss',
  templateUrl: './origin-branch-list.html',
})
export class OriginBranchList {
  private service = inject(OriginBranchService);
  private router = inject(Router);

  branches = signal<OriginBranch[]>([]);
  loading = signal(false);
  branchFormOpen = signal(false);
  currentPage = signal(1);
  readonly pageSize = 6;
  sort = signal<{ key: string; direction: SortDirection }>({ key: '', direction: '' });
  sortedBranches = computed(() => sortRows(this.branches(), this.sort().key, this.sort().direction));
  paginatedBranches = computed(() => {
    const start = (this.currentPage() - 1) * this.pageSize;
    return this.branches().slice(start, start + this.pageSize);
  });

  // Values match the design; bind these to your API when the endpoint is ready
  stats = signal<StatCard[]>([
    {
      key: 'total', label: 'Total Customers', value: 12, trend: '2 vs last week', trendDirection: 'up',
      icon: 'assets/icons/total-customers.svg', background: 'var(--chart-blue-bg)'
    },
    {
      key: 'active', label: 'Active Customers', value: 8, trend: '1 vs last week', trendDirection: 'up',
      icon: 'assets/icons/active-customers.svg', background: 'var(--color-accent-light)'
    },
    {
      key: 'inactive', label: 'Inactive Customers', value: 6, trend: '3 vs last week', trendDirection: 'up',
      icon: 'assets/icons/inactive-customers.svg', background: 'var(--chart-purple-bg)'
    },
    {
      key: 'potential', label: 'Potential Customers', value: 15, trend: '4 vs last week', trendDirection: 'up',
      icon: 'assets/icons/potential-customers.svg', background: 'var(--chart-green-bg)'
    },
  ]);

  columns = signal<ColumnDef[]>([
    { key: 'name', label: 'Branch Name', sortable: true, width: 110 },
    { key: 'code', label: 'Branch Code', sortable: true, width: 100 },
    { key: 'state', label: 'State', sortable: true, width: 100 },
    { key: 'country', label: 'Country', sortable: true, width: 90 },
    { key: 'contactPerson', label: 'Contact Person', sortable: true, width: 120 },
    { key: 'panNo', label: 'PAN No', sortable: true, width: 110 },
    { key: 'gstNo', label: 'GST No', sortable: true, width: 120 },
    { key: 'creditLimit', label: 'Credit Limit', sortable: true, width: 100 },
    { key: 'creditDays', label: 'Credit Days', sortable: true, width: 100 },
    { key: 'paymentMode', label: 'Payment Mode', sortable: true, width: 110 },
    // { key: 'actions',       label: 'Actions',        type: 'actions', align: 'center', width: 90 },
  ]);

  actions = [
    { id: 'edit', label: 'Edit', icon: 'icon-doc' },
    { id: 'delete', label: 'Delete', icon: 'icon-trash', variant: 'danger' as const },
  ];

  ngOnInit(): void {
    this.load();
  }

  load(): void {
    this.loading.set(true);
    this.service.getAll().subscribe({
      next: data => {
        this.branches.set(data);
        const lastPage = Math.max(1, Math.ceil(data.length / this.pageSize));
        this.currentPage.update(page => Math.min(page, lastPage));
        this.loading.set(false);
      },
      error: () => this.loading.set(false),
    });
  }

  addBranch(): void {
    this.branchFormOpen.set(true);
  }

  closeBranchForm(): void {
    this.branchFormOpen.set(false);
  }

  onBranchSaved(): void {
    this.closeBranchForm();
    this.load();
  }

  onPageChange(page: number): void {
    this.currentPage.set(page);
  }

  onAction(event: { actionId: string; item: OriginBranch }): void {
    if (event.actionId === 'edit') {
      this.router.navigate(['/masters/origin-branch', event.item.id, 'edit']);
    }

    if (event.actionId === 'delete') {
      // Wrap this with your DialogService confirm if you want a confirmation first
      this.service.delete(event.item.id!).subscribe(() => this.load());
    }
  }
  onSort(sort: { key: string; direction: SortDirection }): void {
    this.sort.set(sort);
    this.currentPage.set(1);
  }
}
