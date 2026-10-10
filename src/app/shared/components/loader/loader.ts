import { Component, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-loader',
  styleUrl: './loader.scss',
  templateUrl: './loader.html',
})
export class Loader {
    loading = input<boolean>(false);

  message = input<string>('Loading...');

  overlay = input<boolean>(true);
}
