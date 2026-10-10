import {
  afterNextRender, ChangeDetectionStrategy, Component, DestroyRef, ElementRef, inject, Injector,
  input, OnInit, output, signal, viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ActivatedRoute, Router } from '@angular/router';
import { EMPTY } from 'rxjs';
import { finalize, switchMap } from 'rxjs/operators';
import { Button } from '../../../../shared/components/button/button';
import { Input } from '../../../../shared/components/input/input';
import { Select, SelectOption } from '../../../../shared/components/select/select';
import { DatePicker } from '../../../../shared/components/date-picker/date-picker';
import { FileUpload } from '../../../../shared/components/file-upload/file-upload';
import { ToastService } from '../../../../core/services/toast';
import { OriginBranchService } from '../../origin-branch/origin-branch';
import { DriverMasterService } from '../driver-master';
import { DriverMaster } from '../driver-master.model';
import { normalizeValues, validateDriver } from '../driver-master.validators';

interface DriverField {
  key: string;
  label: string;
  placeholder: string;
  kind: 'text' | 'select' | 'date' | 'file';
  required?: boolean;
  span?: 1 | 2; // columns taken on desktop (the grid has 4)
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Input, Select, DatePicker, FileUpload],
  selector: 'app-driver-master-form',
  styleUrl: './driver-master-form.scss',
  templateUrl: './driver-master-form.html',
})
export class DriverMasterForm implements OnInit {
  embedded = input(false);
  driverId = input<number | null>(null); // set when opened in the dialog for editing
  saved = output<void>();
  cancelled = output<void>();
  removeRequested = output<void>();

  private service = inject(DriverMasterService);
  private branchService = inject(OriginBranchService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);
  private destroyRef = inject(DestroyRef);
  private host = inject<ElementRef<HTMLElement>>(ElementRef);
  private injector = inject(Injector);
  private fileUpload = viewChild(FileUpload);
  private currentId: number | null = null;
  private initialValues: Record<string, string> = {};

  isEdit = signal(false);
  values = signal<Record<string, string>>({});
  errors = signal<Record<string, string>>({});
  saving = signal(false);
  branchOptions = signal<SelectOption[]>([]);
  licenceFile = signal<File | null>(null);
  existingFileName = signal('');

  readonly fields: DriverField[] = [
    { key: 'branchId', label: 'Branch', placeholder: 'Select branch', kind: 'select', required: true },
    { key: 'driverName', label: 'Driver Name', placeholder: 'Enter driver name', kind: 'text', required: true },
    { key: 'joinDate', label: 'Join Date', placeholder: '', kind: 'date', required: true },
    { key: 'contactNo', label: 'Contact No', placeholder: 'Enter contact no', kind: 'text', required: true },
    { key: 'residenceContactNo', label: 'Residence Contact No', placeholder: 'Enter residence contact no', kind: 'text' },
    { key: 'licenceNo', label: 'Driver Licence No', placeholder: 'Enter licence no', kind: 'text', required: true },
    { key: 'licenceType', label: 'Licence Type', placeholder: 'Select licence type', kind: 'select', required: true },
    { key: 'licenceValidity', label: 'Licence Validity', placeholder: '', kind: 'date', required: true },
    { key: 'address', label: 'Address', placeholder: 'Enter address', kind: 'text', required: true, span: 2 },
    { key: 'bankName', label: 'Bank Name', placeholder: 'Enter bank name', kind: 'text', required: true },
    { key: 'accountNo', label: 'Account No', placeholder: 'Enter account no', kind: 'text', required: true },
    { key: 'ifscCode', label: 'IFSC Code', placeholder: 'Enter IFSC code', kind: 'text' },
    { key: 'gpayNo', label: 'Gpay No', placeholder: 'Enter Gpay no', kind: 'text', required: true },
    { key: 'isActive', label: 'Active Status', placeholder: 'Select status', kind: 'select', required: true },
    { key: 'licenceFile', label: 'Licence Upload', placeholder: '', kind: 'file' },
  ];

  private readonly licenceTypeOptions: SelectOption[] = [
    { label: 'Heavy', value: 'Heavy' },
    { label: 'Light', value: 'Light' },
  ];
  private readonly statusOptions: SelectOption[] = [
    { label: 'Yes', value: 'Yes' },
    { label: 'No', value: 'No' },
  ];

  ngOnInit(): void {
    this.branchService
      .getAll()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(branches =>
        this.branchOptions.set(branches.map(b => ({ label: b.name, value: b.id ?? b.code }))),
      );

    const id = this.driverId() ?? (Number(this.route.snapshot.paramMap.get('id')) || null);
    if (!id) {
      this.reset();
      return;
    }

    this.currentId = id;
    this.isEdit.set(true);
    this.service
      .getById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(driver => {
        if (!driver) {
          this.close();
          return;
        }
        const values = this.toFormValues(driver);
        this.values.set(values);
        this.initialValues = values;
        this.existingFileName.set(driver.licenceFileName ?? '');
      });
  }

  optionsFor(key: string): SelectOption[] {
    if (key === 'branchId') return this.branchOptions();
    if (key === 'licenceType') return this.licenceTypeOptions;
    return this.statusOptions;
  }

  updateValue(key: string, value: string): void {
    this.values.update(current => ({ ...current, [key]: value }));
    if (this.errors()[key]) this.errors.update(current => ({ ...current, [key]: '' }));
  }

  onFilesChange(files: File[]): void {
    this.licenceFile.set(files[0] ?? null);
    this.errors.update(current => ({ ...current, licenceFile: '' }));
  }

  onFileRejected(message: string): void {
    this.errors.update(current => ({ ...current, licenceFile: message }));
  }

  viewLicence(): void {
    // The mock has no file URL; open the real URL here once your API returns one.
    this.toast.info('Licence preview will be available once the API provides the file URL.');
  }

  reset(): void {
    const values: Record<string, string> = {};
    for (const field of this.fields) values[field.key] = '';
    this.values.set(values);
    this.initialValues = values;
    this.errors.set({});
  }

  resetForm(): void {
    this.values.set({ ...this.initialValues });
    this.licenceFile.set(null);
    this.fileUpload()?.clear();
    this.errors.set({});
  }

  save(): void {
    if (this.saving()) return; // ignore double-clicks while a request is running

    const values = normalizeValues(this.values());
    this.values.set(values); // show the cleaned-up values (e.g. uppercase licence no)

    const errors = validateDriver(values, this.fields);
    this.errors.set(errors);
    if (Object.keys(errors).length) {
      this.focusFirstError();
      return;
    }

    this.saving.set(true);
    this.service
      .isLicenceTaken(values['licenceNo'], this.currentId)
      .pipe(
        switchMap(taken => {
          if (taken) {
            this.errors.set({ licenceNo: 'This licence number is already registered' });
            this.focusFirstError();
            return EMPTY;
          }
          const driver = this.toDriver(values);
          return this.currentId
            ? this.service.update(this.currentId, driver)
            : this.service.create(driver);
        }),
        finalize(() => this.saving.set(false)),
      )
      .subscribe({
        next: () => {
          this.toast.success(this.currentId ? 'Driver updated' : 'Driver created');
          this.saved.emit();
          if (!this.embedded()) this.router.navigate(['/masters/driver-master']);
        },
        error: () => this.toast.error('Could not save the driver. Please try again.'),
      });
  }

  remove(): void {
    if (!this.currentId) return;
    if (this.embedded()) {
      this.removeRequested.emit(); // the list asks for confirmation and deletes
      return;
    }
    this.service.delete(this.currentId).subscribe(() => {
      this.toast.success('Driver deleted');
      this.router.navigate(['/masters/driver-master']);
    });
  }

  close(): void {
    if (this.embedded()) this.cancelled.emit();
    else this.router.navigate(['/masters/driver-master']);
  }

  private focusFirstError(): void {
    afterNextRender(
      () => this.host.nativeElement.querySelector<HTMLElement>('[aria-invalid="true"]')?.focus(),
      { injector: this.injector },
    );
  }

  private toDriver(v: Record<string, string>): DriverMaster {
    return {
      id: this.currentId ?? undefined,
      branchId: Number(v['branchId']) || null,
      branchName: this.branchOptions().find(o => String(o.value) === v['branchId'])?.label ?? '',
      driverName: v['driverName'],
      joinDate: v['joinDate'],
      contactNo: v['contactNo'],
      residenceContactNo: v['residenceContactNo'],
      licenceNo: v['licenceNo'],
      licenceType: v['licenceType'],
      licenceValidity: v['licenceValidity'],
      address: v['address'],
      bankName: v['bankName'],
      accountNo: v['accountNo'],
      ifscCode: v['ifscCode'],
      gpayNo: v['gpayNo'],
      isActive: v['isActive'] === 'Yes',
      licenceFileName: this.licenceFile()?.name ?? (this.existingFileName() || undefined),
    };
  }

  private toFormValues(d: DriverMaster): Record<string, string> {
    return {
      branchId: d.branchId != null ? String(d.branchId) : '',
      driverName: d.driverName ?? '',
      joinDate: d.joinDate ?? '',
      contactNo: d.contactNo ?? '',
      residenceContactNo: d.residenceContactNo ?? '',
      licenceNo: d.licenceNo ?? '',
      licenceType: d.licenceType ?? '',
      licenceValidity: d.licenceValidity ?? '',
      address: d.address ?? '',
      bankName: d.bankName ?? '',
      accountNo: d.accountNo ?? '',
      ifscCode: d.ifscCode ?? '',
      gpayNo: d.gpayNo ?? '',
      isActive: d.isActive ? 'Yes' : 'No',
      licenceFile: '',
    };
  }
}