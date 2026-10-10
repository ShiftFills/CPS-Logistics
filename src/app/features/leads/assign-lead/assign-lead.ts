import { DatePipe } from '@angular/common';
import { ChangeDetectionStrategy, Component, computed, inject, signal } from '@angular/core';
import { takeUntilDestroyed, toObservable, toSignal } from '@angular/core/rxjs-interop';
import { switchMap, tap } from 'rxjs';
import { Button } from '../../../shared/components/button/button';
import { Card } from '../../../shared/components/card/card';
import { Checkbox } from '../../../shared/components/checkbox/checkbox';
import { PageHeading } from '../../../shared/components/page-heading/page-heading';
import { Pagination } from '../../../shared/components/pagination/pagination';
import { Select } from '../../../shared/components/select/select';
import { Textarea } from '../../../shared/components/textarea/textarea';
import { ColumnDef, Table } from '../../../shared/components/table/table';
import { AssignLeadApi } from './assign-lead-api';
import { UnassignedLead } from './assign-lead.model';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [PageHeading, Card, Pagination, Select, Textarea, Button, Table],
  selector: 'app-assign-lead',
  styleUrl: './assign-lead.scss',
  templateUrl: './assign-lead.html',
})
export class AssignLead {
  private readonly api = inject(AssignLeadApi);

  // ---------- Left card: unassigned leads ----------
  protected readonly pageSize = 6;
  protected readonly page = signal(1);
  protected readonly loading = signal(true);
  protected readonly leads = signal<UnassignedLead[]>([]);
  protected readonly total = signal(0);
  protected readonly columns: ColumnDef[] = [
    { key: 'selected', label: '', type: 'checkbox', checkboxKey: 'selected', checkboxHeader: true, headerClass: 'checkbox-header', align: 'center', width: 56 },
    { key: 'leadId', label: 'Lead ID', type: 'link', sortable: true, width: 110 },
    { key: 'customer', label: 'Customer', cellClass: 'cell-strong', sortable: true, width: 150 },
    { key: 'contact', label: 'Contact', sortable: true, width: 130 },
    { key: 'route', label: 'Route', sortable: true, width: 120 },
    { key: 'dateLabel', label: 'Date', sortable: true, width: 100 },
  ];

  protected readonly tableLeads = computed(() => this.leads().map(lead => ({
    ...lead,
    dateLabel: new DatePipe('en-US').transform(lead.date, 'd MMM') ?? lead.date,
    selected: this.selectedIds().has(lead.leadId),
  })));

  /** Selected lead IDs. Kept as IDs (not row flags) so selection survives paging. */
  protected readonly selectedIds = signal<ReadonlySet<string>>(new Set());

  protected readonly allOnPageSelected = computed(() => {
    const rows = this.leads();
    const selected = this.selectedIds();
    return rows.length > 0 && rows.every(lead => selected.has(lead.leadId));
  });

  // ---------- Right card: assign form ----------
  protected readonly executives = toSignal(this.api.getExecutives(), { initialValue: [] });
  protected readonly executiveId = signal('');
  protected readonly remarks = signal('');
  protected readonly submitted = signal(false);

  /** Chips shown in "Assign Selected", in a stable order. */
  protected readonly selectedList = computed(() => [...this.selectedIds()].sort());

  // Errors only appear after the first Assign click.
  protected readonly executiveError = computed(() =>
    this.submitted() && !this.executiveId() ? 'Select an executive' : '',
  );
  protected readonly selectionError = computed(() =>
    this.submitted() && this.selectedIds().size === 0 ? 'Select at least one lead' : '',
  );

  constructor() {
    // Reload whenever `page` changes. switchMap drops any stale in-flight request.
    toObservable(this.page)
      .pipe(
        tap(() => this.loading.set(true)),
        switchMap(page => this.api.getUnassignedLeads(page, this.pageSize)),
        takeUntilDestroyed(),
      )
      .subscribe(result => {
        this.leads.set(result.items);
        this.total.set(result.total);
        this.loading.set(false);
      });
  }

  protected onPageChange(page: number): void {
    this.page.set(page);
  }

  protected toggleLead(leadId: string, checked: boolean): void {
    this.selectedIds.update(current => {
      const next = new Set(current);
      checked ? next.add(leadId) : next.delete(leadId);
      return next;
    });
  }

  /** Header checkbox: selects or clears every row on the current page only. */
  protected toggleAllOnPage(checked: boolean): void {
    this.selectedIds.update(current => {
      const next = new Set(current);
      for (const lead of this.leads()) {
        checked ? next.add(lead.leadId) : next.delete(lead.leadId);
      }
      return next;
    });
  }

  protected onTableCheckboxChange(event: { row: UnassignedLead; checked: boolean }): void {
    this.toggleLead(event.row.leadId, event.checked);
  }

  protected onCancel(): void {
    this.selectedIds.set(new Set());
    this.executiveId.set('');
    this.remarks.set('');
    this.submitted.set(false);
  }

  protected onAssign(): void {
    this.submitted.set(true);

    if (this.selectedIds().size === 0 || !this.executiveId()) {
      return; // errors are now visible
    }

    // Step 6: call the API, show a toast, reset the form and reload the list.
  }
}
