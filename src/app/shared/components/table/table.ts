import {
  Component,
  effect,
  input,
  output,
  signal
} from '@angular/core';
import {
  CdkConnectedOverlay,
  CdkOverlayOrigin,
  ConnectedPosition
} from '@angular/cdk/overlay';
import { NgClass } from '@angular/common';
import { Checkbox } from '../checkbox/checkbox';
import { SortDirection, SortHeader } from '../sort-header/sort-header';
import { sortRows } from '../../utils/sort.util';
export interface ColumnDef {
  key: string;
  label: string;
  type?: 'text' | 'badge' | 'link' | 'actions' | 'progress' | 'dot' | 'checkbox';
  align?: 'left' | 'center' | 'right';
  width?: number;
  sortable?: boolean;
  cellClass?: string;
  headerClass?: string;
  opacityKey?: string;
  colorKey?: string; // new: row field holding the dot colour (dot columns)
  badgeTypeMap?: Record<string, string>;
  pillKey?: string;       // row field holding the small pill text shown beside the value
  pillClassKey?: string;
  checkboxKey?: string;
  checkboxHeader?: boolean;
}

export interface TableAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'danger';
}
@Component({
  imports: [NgClass, SortHeader, Checkbox, CdkConnectedOverlay, CdkOverlayOrigin],
  selector: 'app-table',
  styleUrl: './table.scss',
  templateUrl: './table.html',
})
export class Table {
  readonly popoverPositions: ConnectedPosition[] = [
    { originX: 'end', originY: 'bottom', overlayX: 'end', overlayY: 'top', offsetY: 4 },
    { originX: 'end', originY: 'top', overlayX: 'end', overlayY: 'bottom', offsetY: -4 },
    { originX: 'start', originY: 'bottom', overlayX: 'start', overlayY: 'top', offsetY: 4 },
    { originX: 'start', originY: 'top', overlayX: 'start', overlayY: 'bottom', offsetY: -4 },
  ];
  columns = input.required<ColumnDef[]>();
  data = input.required<any[]>();
  columnsChanged = output<ColumnDef[]>();
  actions = input<TableAction[]>([]);
  loading = input<boolean>(false);
  emptyMessage = input<string>('No records found.');
  draggedColumnIndex = signal<number | null>(null);
  actionTriggered = output<{ actionId: string; item: any }>();
  activePopoverIndex = signal<number | null>(null);
  activePopoverRow = signal<any | null>(null);
  sortColumn = signal<string | null>(null);

  variant = input<'default' | 'embedded'>('default');   // 'embedded' = no border/shadow, for use inside a card
  sortIconStyle = input<'default' | 'dashboard'>('default');
  externalSort = input<boolean>(false);
  sortChange = output<{ key: string; direction: SortDirection }>();
  checkboxChange = output<{ row: any; checked: boolean }>();
  headerCheckboxChecked = input(false);
  headerCheckboxChange = output<boolean>();
  rowSelectedKey = input<string | null>(null);
  resizable = input<boolean>(true);
  reorderable = input<boolean>(true);
  sortDirection = signal<SortDirection>('');

  sortedData = signal<any[]>([]);
  // Column resizing
  private resizingColumnIndex: number | null = null;
  private resizeStartX = 0;
  private resizeStartWidth = 0;
  constructor() {
    effect(() => {
      const data = this.data();
      const activeRow = this.activePopoverRow();
      if (activeRow !== null && !data.includes(activeRow)) {
        this.closePopover();
      }
      this.sortedData.set(
        this.externalSort() ? data : sortRows(data, this.sortColumn(), this.sortDirection())
      );
    });
  }

  onSort(column: string, direction: SortDirection): void {
    this.sortColumn.set(direction === '' ? null : column);
    this.sortDirection.set(direction);
    this.sortChange.emit({ key: column, direction });
  }

  private sortData(
    data: any[],
    column: string | null,
    direction: SortDirection
  ): any[] {

    if (!column || direction === '') {
      return [...data];
    }

    const sorted = [...data];

    sorted.sort((a, b) => {

      const valueA = a[column];
      const valueB = b[column];

      if (valueA == null) {
        return 1;
      }

      if (valueB == null) {
        return -1;
      }

      const result =
        String(valueA).localeCompare(
          String(valueB),
          undefined,
          {
            numeric: true,
            sensitivity: 'base'
          }
        );

      return direction === 'asc'
        ? result
        : -result;

    });

    return sorted;
  }

  getSortDirection(column: string): SortDirection {

    if (this.sortColumn() === column) {
      return this.sortDirection();
    }

    return '';
  }

  getNextSortDirection(column: string): SortDirection {

    const currentDirection =
      this.getSortDirection(column);
    console.log('Current Sort Column:', currentDirection);
    if (currentDirection === '') {
      return 'asc';
    }

    if (currentDirection === 'asc') {
      return 'desc';
    }

    return '';
  }


  togglePopover(index: number, row: any, event: Event): void {
    event.stopPropagation();

    if (this.activePopoverRow() === row) {
      this.closePopover();
    } else {
      this.activePopoverIndex.set(index);
      this.activePopoverRow.set(row);
    }
  }

  closePopover(): void {
    this.activePopoverIndex.set(null);
    this.activePopoverRow.set(null);
  }

  onActionClick(actionId: string, item: any, event: Event): void {
    event.stopPropagation();
    this.actionTriggered.emit({ actionId, item });
    this.closePopover();
  }

  getBadgeClass(column: ColumnDef, value: string): string {
    if (column.badgeTypeMap && column.badgeTypeMap[value]) {
      return column.badgeTypeMap[value];
    }
    return 'badge-gray';
  }

  // -----------------------------
  // COLUMN SWAPPING
  // -----------------------------
  onColumnDragStart(index: number): void {
    this.draggedColumnIndex.set(index);
  }

  onColumnDragOver(event: DragEvent): void {
    event.preventDefault();
  }

  onColumnDrop(targetIndex: number): void {
    const sourceIndex = this.draggedColumnIndex();

    if (sourceIndex === null || sourceIndex === targetIndex) {
      return;
    }

    const updatedColumns = [...this.columns()];

    [
      updatedColumns[sourceIndex],
      updatedColumns[targetIndex]
    ] = [
        updatedColumns[targetIndex],
        updatedColumns[sourceIndex]
      ];

    this.columnsChanged.emit(updatedColumns);

    this.draggedColumnIndex.set(null);
  }


  // -----------------------------
  // COLUMN RESIZING
  // -----------------------------

  startResize(
    event: MouseEvent,
    columnIndex: number
  ): void {

    event.preventDefault();
    event.stopPropagation();

    this.resizingColumnIndex = columnIndex;

    this.resizeStartX = event.clientX;

    this.resizeStartWidth =
      this.columns()[columnIndex].width ?? 150;

    document.addEventListener(
      'mousemove',
      this.onResize
    );

    document.addEventListener(
      'mouseup',
      this.stopResize
    );
  }


  private onResize = (event: MouseEvent): void => {

    if (this.resizingColumnIndex === null) {
      return;
    }

    const difference =
      event.clientX - this.resizeStartX;

    const newWidth = Math.max(
      80,
      this.resizeStartWidth + difference
    );

    const updatedColumns = [...this.columns()];

    updatedColumns[this.resizingColumnIndex] = {
      ...updatedColumns[this.resizingColumnIndex],
      width: newWidth
    };

    this.columnsChanged.emit(updatedColumns);
  };


  private stopResize = (): void => {

    this.resizingColumnIndex = null;

    document.removeEventListener(
      'mousemove',
      this.onResize
    );

    document.removeEventListener(
      'mouseup',
      this.stopResize
    );
  };

}