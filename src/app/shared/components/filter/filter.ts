import {
  Component,
  input,
  output,
  signal
} from '@angular/core';
import { FormsModule } from '@angular/forms';

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDef {
  key: string;
  label: string;
  type: 'text' | 'select';
  options?: FilterOption[];
}

@Component({
  selector: 'app-filter',
  imports: [FormsModule],
  templateUrl: './filter.html',
  styleUrl: './filter.scss'
})
export class Filter {

  filters = input<FilterDef[]>([]);

  applied = output<Record<string, string>>();

  filterValues = signal<Record<string, string>>({});

  updateValue(key: string, value: string): void {

    this.filterValues.update(current => ({
      ...current,
      [key]: value
    }));

  }

  applyFilters(): void {

    this.applied.emit(this.filterValues());

  }

  clearFilters(): void {

    this.filterValues.set({});

    this.applied.emit({});

  }
}