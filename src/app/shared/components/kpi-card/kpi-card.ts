import { ChangeDetectionStrategy, Component, input } from '@angular/core';

@Component({
  selector: 'app-kpi-card',
  styleUrl: './kpi-card.scss',
  templateUrl: './kpi-card.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class KpiCard {
  label = input.required<string>();
  value = input.required<number | string>();
  iconSrc = input.required<string>();

  /** Icon circle tint: 'blue' | 'orange' | 'rose' | 'purple' | 'green' */
  tone = input<'blue' | 'orange' | 'rose' | 'purple' | 'green'>('blue');

  /** Trend line, e.g. 2 -> "↑ 2 vs last week". Omit to hide it. */
  trend = input<number | null>(null);
  trendDirection = input<'up' | 'down'>('up');
  trendNote = input<string>('vs last week');
}