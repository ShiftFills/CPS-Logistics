import { Component, ElementRef, input, output, viewChild } from '@angular/core';

@Component({
  imports: [],
  selector: 'app-file-upload',
  styleUrl: './file-upload.scss',
  templateUrl: './file-upload.html',
})
export class FileUpload {
  label = input<string>('Upload File');

  accept = input<string>('');

  multiple = input<boolean>(false);

  maxSize = input<number>(10);

  disabled = input<boolean>(false);

  // Compact single-row layout used inside form dialogs
  compact = input<boolean>(false);

  // Name of an already-saved file (edit mode) and the label of its "view" link
  fileName = input<string>('');
  viewLabel = input<string>('');

  error = input<string>('');

  filesChange = output<File[]>();
  viewClick = output<void>();
  rejected = output<string>(); // a chosen file was too large or the wrong type

  selectedFiles: File[] = [];

  private fileInput = viewChild<ElementRef<HTMLInputElement>>('fileInput');

  get currentName(): string {
    return this.selectedFiles[0]?.name ?? this.fileName();
  }

  onFileChange(event: Event): void {

    const inputElement = event.target as HTMLInputElement;

    if (!inputElement.files) {
      return;
    }

    const files = Array.from(inputElement.files);

    const validFiles = files.filter(file =>
      this.isValidFile(file)
    );

    if (this.multiple()) {
      this.selectedFiles = validFiles;
    } else {
      this.selectedFiles = validFiles.slice(0, 1);
    }

    this.filesChange.emit(this.selectedFiles);

    if (validFiles.length < files.length) {
      this.rejected.emit(this.rejectionMessage());
    }
  }

  removeFile(index: number): void {

    this.selectedFiles.splice(index, 1);

    this.filesChange.emit(this.selectedFiles);
  }

  /** Lets a parent form clear the selection (e.g. on Reset). */
  clear(): void {
    this.selectedFiles = [];
    const element = this.fileInput()?.nativeElement;
    if (element) element.value = '';
  }

  private isValidFile(file: File): boolean {

    const maxSizeInBytes =
      this.maxSize() * 1024 * 1024;

    if (file.size > maxSizeInBytes) {
      return false;
    }

    const extensions = this.accept()
      .split(',')
      .map(item => item.trim().toLowerCase())
      .filter(item => item.startsWith('.'));

    return !extensions.length || extensions.some(ext => file.name.toLowerCase().endsWith(ext));
  }

  private rejectionMessage(): string {
    const types = this.accept()
      .split(',')
      .map(item => item.trim().replace(/^\./, '').toUpperCase())
      .filter(Boolean)
      .join(', ');

    return types
      ? `Only ${types} files up to ${this.maxSize()} MB are allowed`
      : `Files must be ${this.maxSize()} MB or smaller`;
  }
}