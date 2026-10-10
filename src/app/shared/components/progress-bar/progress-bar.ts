
import { Component, computed, input } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-progress-bar',
  styleUrl: './progress-bar.scss',
  templateUrl: './progress-bar.html',
})
export class ProgressBar {
   value = input<number>(0);

  showPercentage = input<boolean>(true);

  label = input<string>('');

  percentage = computed(() => {
    const value = this.value();

    return Math.min(Math.max(value, 0), 100);
  });
}
