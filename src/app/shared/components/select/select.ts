import { Component, ElementRef, HostListener, input, output, signal } from '@angular/core';
import { Label } from '../label/label'; // Adjust path based on your folder structure

export interface SelectOption {
  label: string;
  value: string | number;
}

@Component({
  imports: [Label],
  selector: 'app-select',
  styleUrl: './select.scss',
  templateUrl: './select.html',
})
export class Select {
  private static nextId = 0;
  protected readonly listboxId = `select-listbox-${Select.nextId++}`;
  protected readonly isOpen = signal(false);
  protected readonly activeIndex = signal(0);

  label = input<string>('');

  placeholder = input<string>('Select');

  options = input<SelectOption[]>([]);

  value = input<string | number>('');

  disabled = input<boolean>(false);

  required = input<boolean>(false);

  valueChange = output<string>();
    error = input<string>('');
  constructor(private readonly elementRef: ElementRef<HTMLElement>) {}

  protected selectedLabel(): string {
    const selected = this.options().find(option => String(option.value) === String(this.value()));
    return selected?.label ?? this.placeholder();
  }

  protected toggle(): void {
    if (this.disabled()) return;
    this.isOpen.update(open => !open);
    if (this.isOpen()) this.syncActiveIndex();
  }

  protected selectOption(option: SelectOption): void {
    this.valueChange.emit(String(option.value));
    this.isOpen.set(false);
  }

  protected onKeydown(event: KeyboardEvent): void {
    if (this.disabled()) return;
    const options = this.options();

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      if (!this.isOpen()) {
        this.isOpen.set(true);
        this.syncActiveIndex();
      } else if (options.length) {
        const delta = event.key === 'ArrowDown' ? 1 : -1;
        this.activeIndex.update(index => (index + delta + options.length) % options.length);
      }
      return;
    }

    if (event.key === 'Escape' && this.isOpen()) {
      event.preventDefault();
      this.isOpen.set(false);
      return;
    }

    if ((event.key === 'Enter' || event.key === ' ') && this.isOpen() && options[this.activeIndex()]) {
      event.preventDefault();
      this.selectOption(options[this.activeIndex()]);
    }
  }

  @HostListener('document:pointerdown', ['$event'])
  protected closeOnOutsideClick(event: MouseEvent): void {
    if (!this.elementRef.nativeElement.contains(event.target as Node)) {
      this.isOpen.set(false);
    }
  }

  private syncActiveIndex(): void {
    const selectedIndex = this.options().findIndex(option => String(option.value) === String(this.value()));
    this.activeIndex.set(Math.max(0, selectedIndex));
  }
}
