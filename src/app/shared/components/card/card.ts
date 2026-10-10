import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-card',
  styleUrl: './card.scss',
  templateUrl: './card.html',
})
export class Card {
    title = input<string>('');

  subtitle = input<string>('');

  padding = input<string>('20px');

  shadow = input<boolean>(true);
}
