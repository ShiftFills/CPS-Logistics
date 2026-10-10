import { Component,input  } from '@angular/core';
export type LabelPosition = 'top' | 'left' | 'right';
@Component({
  imports: [],
  selector: 'app-label',
  styleUrl: './label.scss',
  templateUrl: './label.html',
})
export class Label {
  text = input<string>('');

  position = input<LabelPosition>('top');

  required = input<boolean>(false);
}
