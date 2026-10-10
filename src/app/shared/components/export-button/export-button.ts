import { Component, input, output } from '@angular/core';

export type ExportFormat = 'csv' | 'excel' | 'pdf';

@Component({
  imports: [],
  selector: 'app-export-button',
  styleUrl: './export-button.scss',
  templateUrl: './export-button.html',
})
export class ExportButton {
  label = input<string>('Export');

  format = input<ExportFormat>('csv');

  disabled = input<boolean>(false);

  exportClicked = output<ExportFormat>();

  onExport(): void {

    if (this.disabled()) {
      return;
    }

    this.exportClicked.emit(this.format());
  }
}
