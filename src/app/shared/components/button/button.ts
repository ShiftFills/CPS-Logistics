import { Component, input, output } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-button',
  styleUrl: './button.scss',
  templateUrl: './button.html',
})
export class Button {
  label = input<string>('Button');

  type = input<'button' | 'submit' | 'reset'>('button');



  variant = input<
  | 'primary'
  | 'secondary'
  | 'success'
  | 'danger'
  | 'warning'
  | 'orange'
  | 'outline'
>('primary');

  size = input<'xs' | 'sm' | 'lg'>('sm');

  disabled = input<boolean>(false);

  clicked = output<void>();

  onClick(): void {
    if (!this.disabled()) {
      this.clicked.emit();
    }
  }

}
