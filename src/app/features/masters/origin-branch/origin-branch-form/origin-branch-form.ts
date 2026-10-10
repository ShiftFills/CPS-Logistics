import { Component, inject, input, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../../../shared/components/button/button';
import { Input } from '../../../../shared/components/input/input';
import { Select, SelectOption } from '../../../../shared/components/select/select';
import { OriginBranchService } from '../origin-branch';
import { OriginBranch } from '../origin-branch.model';

interface BranchField {
  key: string;
  label: string;
  placeholder: string;
  kind?: 'select';
  type?: 'text' | 'email' | 'password' | 'number';
  required?: boolean;
}

@Component({
  imports: [Button, Input, Select],
  selector: 'app-origin-branch-form',
  styleUrl: './origin-branch-form.scss',
  templateUrl: './origin-branch-form.html',
})
export class OriginBranchForm implements OnInit {
  embedded = input(false);
  saved = output<void>();
  cancelled = output<void>();

  private service = inject(OriginBranchService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  branchId: number | null = null;
  isEdit = signal(false);
  values = signal<Record<string, string>>({});
  private initialValues: Record<string, string> = {};

  readonly fields: BranchField[] = [
    { key: 'country', label: 'Branch Country', placeholder: 'Select country', kind: 'select' },
    { key: 'name', label: 'Branch Name', placeholder: 'Enter branch name' },
    { key: 'code', label: 'Branch Code', placeholder: 'Enter branch code', required: true },
    { key: 'state', label: 'Branch State', placeholder: 'Select branch state', kind: 'select', required: true },
    { key: 'cityName', label: 'City Name', placeholder: 'Enter city name', required: true },
    { key: 'contactNo', label: 'Contact No', placeholder: 'Enter contact no' },
    { key: 'email', label: 'Branch Email', placeholder: 'Enter branch email', type: 'email' },
    { key: 'address', label: 'Branch Address', placeholder: 'Enter branch address' },
    { key: 'prefix', label: 'Prefix', placeholder: 'Enter prefix' },
    { key: 'paymentMode', label: 'Payment Mode', placeholder: 'Select payment mode', kind: 'select', required: true },
    { key: 'contactPerson', label: 'Contact Person', placeholder: 'Enter contact person' },
    { key: 'panNo', label: 'PAN No', placeholder: 'Enter PAN no' },
    { key: 'gstNo', label: 'GST No', placeholder: 'Enter GST no' },
    { key: 'creditLimit', label: 'Credit Limit', placeholder: 'Enter credit limit', type: 'number' },
    { key: 'creditDays', label: 'Credit Days', placeholder: 'Enter credit days', type: 'number' },
    { key: 'openingBalance', label: 'Opening Balance', placeholder: 'Enter opening balance', type: 'number' },
    { key: 'username', label: 'Username', placeholder: 'Enter username' },
    { key: 'password', label: 'Password', placeholder: 'Enter password', type: 'password' },
  ];

  ngOnInit(): void {
    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.reset();
      return;
    }

    this.branchId = id;
    this.isEdit.set(true);
    this.service.getById(id).subscribe(branch => {
      const values = this.toFormValues(branch);
      this.values.set(values);
      this.initialValues = values;
    });
  }

  optionsFor(key: string): SelectOption[] {
    if (key === 'country') {
      return [
        { label: 'India', value: 'India' },
        { label: 'United Arab Emirates', value: 'United Arab Emirates' },
        { label: 'United States', value: 'United States' },
      ];
    }

    if (key === 'state') {
      return [
        { label: 'Tamil Nadu', value: 'Tamil Nadu' },
        { label: 'Karnataka', value: 'Karnataka' },
        { label: 'Telangana', value: 'Telangana' },
        { label: 'Maharashtra', value: 'Maharashtra' },
        { label: 'Delhi', value: 'Delhi' },
      ];
    }

    return [
      { label: 'Credit', value: 'Credit' },
      { label: 'Cash', value: 'Cash' },
      { label: 'Bank Transfer', value: 'Bank Transfer' },
    ];
  }

  updateValue(key: string, value: string): void {
    this.values.update(current => ({ ...current, [key]: value }));
  }

  reset(): void {
    this.values.set({
      country: '', name: '', code: '', state: '', cityName: '', contactNo: '',
      email: '', address: '', prefix: '', paymentMode: '', contactPerson: '',
      panNo: '', gstNo: '', creditLimit: '', creditDays: '', openingBalance: '',
      username: '', password: '',
    });
    this.initialValues = this.values();
  }

  resetForm(): void {
    this.values.set({ ...this.initialValues });
  }

  save(form: HTMLFormElement): void {
    if (!form.reportValidity()) return;

    const values = this.values();
    const branch: OriginBranch = {
      id: this.branchId ?? undefined,
      name: values['name'] ?? '',
      code: values['code'] ?? '',
      state: values['state'] ?? '',
      country: values['country'] ?? '',
      cityName: values['cityName'] ?? '',
      contactNo: values['contactNo'] ?? '',
      email: values['email'] ?? '',
      address: values['address'] ?? '',
      prefix: values['prefix'] ?? '',
      contactPerson: values['contactPerson'] ?? '',
      panNo: values['panNo'] ?? '',
      gstNo: values['gstNo'] ?? '',
      creditLimit: Number(values['creditLimit']) || 0,
      creditDays: Number(values['creditDays']) || 0,
      openingBalance: Number(values['openingBalance']) || 0,
      paymentMode: values['paymentMode'] ?? '',
      username: values['username'] ?? '',
      password: values['password'] ?? '',
    };

    const request = this.branchId
      ? this.service.update(this.branchId, branch)
      : this.service.create(branch);

    request.subscribe(() => {
      this.saved.emit();
      if (!this.embedded()) this.router.navigate(['/masters/origin-branch']);
    });
  }

  remove(): void {
    if (this.branchId) {
      this.service.delete(this.branchId).subscribe(() => {
        this.saved.emit();
        this.router.navigate(['/masters/origin-branch']);
      });
      return;
    }

    this.close();
  }

  close(): void {
    if (this.embedded()) {
      this.cancelled.emit();
    } else {
      this.router.navigate(['/masters/origin-branch']);
    }
  }

  private toFormValues(branch: OriginBranch): Record<string, string> {
    return {
      country: branch.country ?? '',
      name: branch.name ?? '',
      code: branch.code ?? '',
      state: branch.state ?? '',
      cityName: branch.cityName ?? '',
      contactNo: branch.contactNo ?? '',
      email: branch.email ?? '',
      address: branch.address ?? '',
      prefix: branch.prefix ?? '',
      paymentMode: branch.paymentMode ?? '',
      contactPerson: branch.contactPerson ?? '',
      panNo: branch.panNo ?? '',
      gstNo: branch.gstNo ?? '',
      creditLimit: String(branch.creditLimit ?? ''),
      creditDays: String(branch.creditDays ?? ''),
      openingBalance: String(branch.openingBalance ?? ''),
      username: branch.username ?? '',
      password: branch.password ?? '',
    };
  }
}
