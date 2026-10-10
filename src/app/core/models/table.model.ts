export type ColumnType =
  | 'text'
  | 'link'
  | 'badge'
  | 'custom'
  | 'actions';

export interface BadgeConfig {
  value: string;
  label: string;
  badgeClass: string;
}

export interface TableAction {
  id: string;
  label: string;
  icon?: string;
  variant?: 'normal' | 'danger';
}

export interface TableColumn<T = any> {
  key: string;
  label: string;
  type?: ColumnType;
  sortable?: boolean;
  width?: string;
  customTemplate?: boolean;
  align?: 'left' | 'center' | 'right';

  badgeMap?: Record<
    string,
    {
      label: string;
      class: string;
    }
  >;

  cellClass?: string | ((row: T) => string);
}

export interface PageChangeEvent {
  page: number;
  pageSize: number;
}

export interface TableSortEvent {
  key: string;
  direction: 'asc' | 'desc' | null;
}