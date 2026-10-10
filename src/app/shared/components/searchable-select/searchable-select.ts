import {
  Component,
  ElementRef,
  HostListener,
  computed,
  input,
  output,
  signal
} from '@angular/core';


@Component({
  imports: [],
  selector: 'app-searchable-select',
  styleUrl: './searchable-select.scss',
  templateUrl: './searchable-select.html',
})
export class SearchableSelect {

  // Dropdown options
  options = input<string[]>([]);

  // Selected value
  value = input<string>('');

  // Placeholder shown when no value is selected
  placeholder = input<string>('Select');

  // Search input placeholder
  searchPlaceholder = input<string>('Search...');

  // Disable dropdown
  disabled = input<boolean>(false);

  // Emits selected value
  valueChange = output<string>();

  // Dropdown state
  isOpen = signal(false);

  // Search text
  searchQuery = signal('');

  // Filter options based on search
  filteredOptions = computed(() => {

    const search = this.searchQuery()
      .trim()
      .toLowerCase();

    if (!search) {
      return this.options();
    }

    return this.options().filter(option =>
      option.toLowerCase().includes(search)
    );
  });

  constructor(
    private elementRef: ElementRef
  ) {}

  /**
   * Open / close dropdown
   */
  toggleDropdown(): void {

    if (this.disabled()) {
      return;
    }

    this.isOpen.update(open => !open);

    if (this.isOpen()) {
      this.searchQuery.set('');
    }
  }

  /**
   * Select option
   */
  selectOption(option: string): void {

    this.valueChange.emit(option);

    this.isOpen.set(false);
    this.searchQuery.set('');
  }

  /**
   * Search options
   */
  onSearch(event: Event): void {

    const input = event.target as HTMLInputElement;

    this.searchQuery.set(input.value);
  }

  /**
   * Close dropdown when clicking outside
   */
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {

    const clickedInside =
      this.elementRef.nativeElement.contains(event.target);

    if (!clickedInside) {
      this.isOpen.set(false);
      this.searchQuery.set('');
    }
  }
}
