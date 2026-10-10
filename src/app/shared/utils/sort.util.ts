import { SortDirection } from '../components/sort-header/sort-header';

/**
 * Sorts a copy of `rows` by `column`. Numeric strings sort numerically
 * ("9" before "10"), text sorts case-insensitively, empty values go last.
 * Shared by <app-table> (local sorting) and the Master list screens
 * (sorting the full list before pagination).
 */
export function sortRows<T>(rows: readonly T[], column: string | null, direction: SortDirection): T[] {
  if (!column || direction === '') return [...rows];

  const factor = direction === 'asc' ? 1 : -1;

  return [...rows].sort((a, b) => {
    const valueA = (a as Record<string, unknown>)[column];
    const valueB = (b as Record<string, unknown>)[column];

    if (valueA == null) return 1;
    if (valueB == null) return -1;

    return (
      factor *
      String(valueA).localeCompare(String(valueB), undefined, { numeric: true, sensitivity: 'base' })
    );
  });
}
