import { Component, input } from '@angular/core';

export type BadgeType =
  | 'success'
  | 'error'
  | 'warning'
  | 'info'
  | 'neutral';

@Component({
  imports: [],
  selector: 'app-badge',
  styleUrl: './badge.scss',
  templateUrl: './badge.html',
})
export class Badge {
    label = input<string>('');

  type = input<BadgeType>('neutral');
}
