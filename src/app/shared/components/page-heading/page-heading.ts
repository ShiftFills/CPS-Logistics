import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

@Component({
  imports: [CommonModule],
  selector: 'app-page-heading',
  styleUrl: './page-heading.scss',
  templateUrl: './page-heading.html',
})
export class PageHeading {
  @Input() title = '';
  @Input() subtitle?: string;
}
