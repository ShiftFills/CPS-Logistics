import { ChangeDetectionStrategy, Component, input, model } from '@angular/core';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  selector: 'app-accordion-section',
  styleUrl: './accordion-section.scss',
  templateUrl: './accordion-section.html',
})
export class AccordionSection {
  private static nextId = 0;

  /** Text shown in the header, e.g. "1. Primary Lead Details" */
  title = input.required<string>();

  /** Open/closed state. Use [expanded]="true" to start open, or [(expanded)] to track it. */
  expanded = model<boolean>(false);

  /** Unique id so the header button can point at its body (accessibility). */
  protected readonly bodyId = `accordion-body-${AccordionSection.nextId++}`;

  toggle(): void {
    this.expanded.update(open => !open);
  }

  




}