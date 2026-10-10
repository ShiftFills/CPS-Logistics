import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  inject,
  input,
  OnDestroy,
  output,
  Renderer2,
} from '@angular/core';

@Component({
  imports: [],
  selector: 'app-modal',
  styleUrl: './modal.scss',
  templateUrl: './modal.html',
})
export class Modal implements AfterViewInit, OnDestroy {
  open = input<boolean>(false);

  title = input<string>('');

  width = input<string>('500px');

  closeOnBackdrop = input<boolean>(true);

  showCloseButton = input<boolean>(true);

  appendToBody = input<boolean>(false);

  closed = output<void>();

  private document = inject(DOCUMENT);
  private elementRef = inject(ElementRef<HTMLElement>);
  private renderer = inject(Renderer2);
  private originalParent: Node | null = null;
  private placeholder: Comment | null = null;

  ngAfterViewInit(): void {
    if (!this.appendToBody()) return;

    const host = this.elementRef.nativeElement;
    this.originalParent = host.parentNode;
    if (!this.originalParent || !this.document.body) return;

    this.placeholder = this.document.createComment('app-modal-portal');
    this.renderer.insertBefore(this.originalParent, this.placeholder, host);
    this.renderer.appendChild(this.document.body, host);
  }

  ngOnDestroy(): void {
    if (!this.originalParent || !this.placeholder) return;

    const host = this.elementRef.nativeElement;
    this.renderer.insertBefore(this.originalParent, host, this.placeholder);
    this.renderer.removeChild(this.originalParent, this.placeholder);
  }

  onBackdropClick(): void {
    if (this.closeOnBackdrop()) {
      this.closed.emit();
    }
  }

  onClose(): void {
    this.closed.emit();
  }
}
