import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../../../shared/components/button/button';
import { Input } from '../../../../shared/components/input/input';
import { Select, SelectOption } from '../../../../shared/components/select/select';
import { OriginBranchService } from '../../origin-branch/origin-branch';
import { ClientMaster } from '../client-master';
import { ClientMaster as ClientMasterRecord } from '../client-master.model';

interface ClientField {
  key: string;
  label: string;
  placeholder: string;
  kind?: 'select';
  type?: 'text' | 'email' | 'password' | 'number';
  required?: boolean;
}

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [Button, Input, Select],
  selector: 'app-client-master-form',
  styleUrl: './client-master-form.scss',
  templateUrl: './client-master-form.html',
})
export class ClientMasterForm implements OnInit {
  embedded = input(false);
  saved = output<void>();
  cancelled = output<void>();

  private service = inject(ClientMaster);
  private branchService = inject(OriginBranchService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  clientId: number | null = null;
  isEdit = signal(false);
  values = signal<Record<string, string>>({});
  branchOptions = signal<SelectOption[]>([]);
  private initialValues: Record<string, string> = {};

  readonly fields: ClientField[] = [
    { key: 'branchId', label: 'Branch Name', placeholder: 'Select branch', kind: 'select', required: true },
    { key: 'clientName', label: 'Client Name', placeholder: 'Select client', kind: 'select', required: true },
    { key: 'country', label: 'Client Country', placeholder: 'Select country', kind: 'select', required: true },
    { key: 'code', label: 'Client Code', placeholder: 'Enter code', required: true },
    { key: 'city', label: 'Client City', placeholder: 'Enter city' },
    { key: 'address', label: 'Address', placeholder: 'Enter address' },
    { key: 'pincode', label: 'Client Pincode', placeholder: 'Enter pincode' },
    { key: 'isActive', label: 'Active Status', placeholder: 'Yes', kind: 'select' },
    { key: 'companyName', label: 'Company Name', placeholder: 'Select company', kind: 'select', required: true },
    { key: 'panNo', label: 'PAN No', placeholder: 'Enter PAN no' },
    { key: 'gstNo', label: 'GST No', placeholder: 'Enter GST no' },
    { key: 'referredBy', label: 'Referred By', placeholder: 'Enter reference' },
    { key: 'username', label: 'Username', placeholder: 'Enter username', required: true },
    { key: 'password', label: 'Password', placeholder: 'Enter password', type: 'password', required: true },
    { key: 'gstBillStatus', label: 'GST Bill Status', placeholder: 'Yes', kind: 'select' },
    { key: 'contactPerson1', label: 'Contact Person 1', placeholder: 'Enter contact person' },
    { key: 'contactPerson2', label: 'Contact Person 2', placeholder: 'Enter contact person' },
    { key: 'operationalEmail1', label: 'Operational Email 1', placeholder: 'Enter operational email', type: 'email' },
    { key: 'operationalEmail2', label: 'Operational Email 2', placeholder: 'Enter operational email', type: 'email' },
    { key: 'contactNumber1', label: 'Contact Number 1', placeholder: 'Enter contact number' },
    { key: 'contactNumber2', label: 'Contact Number 2', placeholder: 'Enter contact number' },
    { key: 'category', label: 'Category', placeholder: 'Select category', kind: 'select' },
    { key: 'cpsFollowUpPerson', label: 'CPS FollowUp Person', placeholder: 'Select person', kind: 'select' },
    { key: 'paymentMode', label: 'Payment Mode', placeholder: 'Select payment mode', kind: 'select', required: true },
    { key: 'remarks', label: 'Remarks', placeholder: 'Enter remarks' },
  ];

  ngOnInit(): void {
    this.branchService.getAll().subscribe(branches => {
      this.branchOptions.set(branches.map(branch => ({ label: branch.name, value: branch.id ?? branch.code })));
    });

    const id = Number(this.route.snapshot.paramMap.get('id'));
    if (!id) {
      this.reset();
      return;
    }

    this.clientId = id;
    this.isEdit.set(true);
    this.service.getById(id).subscribe(client => {
      if (!client) {
        this.router.navigate(['/masters/client-master']);
        return;
      }
      const values = this.toFormValues(client);
      this.values.set(values);
      this.initialValues = values;
    });
  }

  optionsFor(key: string): SelectOption[] {
    if (key === 'branchId') return this.branchOptions();
    if (key === 'clientName') {
      return [
        { label: 'Balaji Logistics', value: 'Balaji Logistics' },
        { label: 'CPS Logistics', value: 'CPS Logistics' },
      ];
    }
    if (key === 'country') {
      return [
        { label: 'India', value: 'India' },
        { label: 'United Arab Emirates', value: 'United Arab Emirates' },
        { label: 'United States', value: 'United States' },
      ];
    }
    if (key === 'companyName') {
      return [
        { label: 'Balaji Logistics', value: 'Balaji Logistics' },
        { label: 'CPS Logistics', value: 'CPS Logistics' },
      ];
    }
    if (key === 'isActive' || key === 'gstBillStatus') {
      return [
        { label: 'Yes', value: 'Yes' },
        { label: 'No', value: 'No' },
      ];
    }
    if (key === 'category') {
      return [
        { label: 'New Client', value: 'New Client' },
        { label: 'Existing Client', value: 'Existing Client' },
        { label: 'Potential Client', value: 'Potential Client' },
      ];
    }
    if (key === 'cpsFollowUpPerson') {
      return [
        { label: 'Admin', value: 'Admin' },
        { label: 'Operations Team', value: 'Operations Team' },
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
    const values: Record<string, string> = {};
    for (const field of this.fields) values[field.key] = '';
    values['isActive'] = 'Yes';
    values['gstBillStatus'] = 'Yes';
    this.values.set(values);
    this.initialValues = values;
  }

  resetForm(): void {
    this.values.set({ ...this.initialValues });
  }

  save(form: HTMLFormElement): void {
    if (!form.reportValidity()) return;

    const values = this.values();
    const client: ClientMasterRecord = {
      id: this.clientId ?? undefined,
      branchId: Number(values['branchId']) || null,
      branchName: this.branchOptions().find(option => String(option.value) === values['branchId'])?.label ?? '',
      clientName: values['clientName'] ?? '',
      country: values['country'] ?? '',
      code: values['code'] ?? '',
      city: values['city'] ?? '',
      address: values['address'] ?? '',
      pincode: values['pincode'] ?? '',
      isActive: values['isActive'] !== 'No',
      companyName: values['companyName'] ?? '',
      panNo: values['panNo'] ?? '',
      gstNo: values['gstNo'] ?? '',
      referredBy: values['referredBy'] ?? '',
      username: values['username'] ?? '',
      password: values['password'] ?? '',
      gstBillStatus: values['gstBillStatus'] !== 'No',
      contactPerson1: values['contactPerson1'] ?? '',
      contactPerson2: values['contactPerson2'] ?? '',
      operationalEmail1: values['operationalEmail1'] ?? '',
      operationalEmail2: values['operationalEmail2'] ?? '',
      contactNumber1: values['contactNumber1'] ?? '',
      contactNumber2: values['contactNumber2'] ?? '',
      category: values['category'] ?? '',
      cpsFollowUpPerson: values['cpsFollowUpPerson'] ?? '',
      paymentMode: values['paymentMode'] ?? '',
      remarks: values['remarks'] ?? '',
    };

    const request = this.clientId
      ? this.service.update(this.clientId, client)
      : this.service.create(client);

    request.subscribe(() => {
      this.saved.emit();
      if (!this.embedded()) this.router.navigate(['/masters/client-master']);
    });
  }

  remove(): void {
    if (!this.clientId) {
      this.close();
      return;
    }
    this.service.delete(this.clientId).subscribe(() => {
      this.saved.emit();
      this.router.navigate(['/masters/client-master']);
    });
  }

  close(): void {
    if (this.embedded()) this.cancelled.emit();
    else this.router.navigate(['/masters/client-master']);
  }

  private toFormValues(client: ClientMasterRecord): Record<string, string> {
    return {
      branchId: String(client.branchId ?? ''),
      clientName: client.clientName ?? '',
      country: client.country ?? '',
      code: client.code ?? '',
      city: client.city ?? '',
      address: client.address ?? '',
      pincode: client.pincode ?? '',
      isActive: client.isActive ? 'Yes' : 'No',
      companyName: client.companyName ?? '',
      panNo: client.panNo ?? '',
      gstNo: client.gstNo ?? '',
      referredBy: client.referredBy ?? '',
      username: client.username ?? '',
      password: client.password ?? '',
      gstBillStatus: client.gstBillStatus ? 'Yes' : 'No',
      contactPerson1: client.contactPerson1 ?? '',
      contactPerson2: client.contactPerson2 ?? '',
      operationalEmail1: client.operationalEmail1 ?? '',
      operationalEmail2: client.operationalEmail2 ?? '',
      contactNumber1: client.contactNumber1 ?? '',
      contactNumber2: client.contactNumber2 ?? '',
      category: client.category ?? '',
      cpsFollowUpPerson: client.cpsFollowUpPerson ?? '',
      paymentMode: client.paymentMode ?? '',
      remarks: client.remarks ?? '',
    };
  }
}
