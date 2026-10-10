import { ChangeDetectionStrategy, Component, inject, input, OnInit, output, signal } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Button } from '../../../../shared/components/button/button';
import { Input } from '../../../../shared/components/input/input';
import { Select, SelectOption } from '../../../../shared/components/select/select';
import { ToastService } from '../../../../core/services/toast';
import { BrokerMasterService } from '../broker-master';
import { BrokerMaster } from '../broker-master.model';

interface BrokerField {
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
  selector: 'app-broker-master-form',
  styleUrl: './broker-master-form.scss',
  templateUrl: './broker-master-form.html',
})
export class BrokerMasterForm implements OnInit {
  embedded = input(false);
  brokerId = input<number | null>(null); // set when opened in the dialog for editing
  saved = output<void>();
  cancelled = output<void>();
  removeRequested = output<void>();

  private service = inject(BrokerMasterService);
  private toast = inject(ToastService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private currentId: number | null = null;
  isEdit = signal(false);
  values = signal<Record<string, string>>({});
  private initialValues: Record<string, string> = {};

  readonly fields: BrokerField[] = [
    { key: 'brokerName', label: 'Broker Name', placeholder: 'Enter broker name', required: true },
    { key: 'brokerCode', label: 'Broker Code', placeholder: 'Enter broker code', required: true },
    { key: 'location', label: 'Location', placeholder: 'Enter location' },
    { key: 'priority', label: 'Priority', placeholder: 'Select priority', kind: 'select' },
    { key: 'contactPerson1', label: 'Contact Person 1', placeholder: 'Enter contact person' },
    { key: 'contactNumber1', label: 'Contact Number 1', placeholder: 'Enter contact number' },
    { key: 'contactPerson2', label: 'Contact Person 2', placeholder: 'Enter contact person' },
    { key: 'contactNumber2', label: 'Contact Number 2', placeholder: 'Enter contact number' },
    { key: 'email', label: 'Email', placeholder: 'Enter email', type: 'email' },
    { key: 'address', label: 'Address', placeholder: 'Enter address' },
    { key: 'isActive', label: 'Active Status', placeholder: 'Yes', kind: 'select' },
  ];

  ngOnInit(): void {
    const id = this.brokerId() ?? (Number(this.route.snapshot.paramMap.get('id')) || null);
    if (!id) {
      this.reset();
      return;
    }

    this.currentId = id;
    this.isEdit.set(true);
    this.service.getById(id).subscribe(broker => {
      if (!broker) {
        this.close();
        return;
      }
      const values = this.toFormValues(broker);
      this.values.set(values);
      this.initialValues = values;
    });
  }

  optionsFor(key: string): SelectOption[] {
    if (key === 'priority') {
      return [
        { label: 'High', value: 'High' },
        { label: 'Medium', value: 'Medium' },
        { label: 'Low', value: 'Low' },
      ];
    }
    return [
      { label: 'Yes', value: 'Yes' },
      { label: 'No', value: 'No' },
    ];
  }

  updateValue(key: string, value: string): void {
    this.values.update(current => ({ ...current, [key]: value }));
  }

  reset(): void {
    const values: Record<string, string> = {};
    for (const field of this.fields) values[field.key] = '';
    values['isActive'] = 'Yes';
    this.values.set(values);
    this.initialValues = values;
  }

  resetForm(): void {
    this.values.set({ ...this.initialValues });
  }

  save(form: HTMLFormElement): void {
    if (!form.reportValidity()) return; // required + email validation

    const v = this.values();
    const broker: BrokerMaster = {
      id: this.currentId ?? undefined,
      brokerName: v['brokerName'] ?? '',
      brokerCode: v['brokerCode'] ?? '',
      location: v['location'] ?? '',
      priority: v['priority'] ?? '',
      contactPerson1: v['contactPerson1'] ?? '',
      contactPerson2: v['contactPerson2'] ?? '',
      contactNumber1: v['contactNumber1'] ?? '',
      contactNumber2: v['contactNumber2'] ?? '',
      email: v['email'] ?? '',
      address: v['address'] ?? '',
      isActive: v['isActive'] !== 'No',
    };

    const request = this.currentId
      ? this.service.update(this.currentId, broker)
      : this.service.create(broker);

    request.subscribe(() => {
      this.toast.success(this.currentId ? 'Broker updated' : 'Broker created');
      this.saved.emit();
      if (!this.embedded()) this.router.navigate(['/masters/broker-master']);
    });
  }

  remove(): void {
    if (!this.currentId) return;
    if (this.embedded()) {
      this.removeRequested.emit(); // the list asks for confirmation and deletes
      return;
    }
    this.service.delete(this.currentId).subscribe(() => {
      this.toast.success('Broker deleted');
      this.router.navigate(['/masters/broker-master']);
    });
  }

  close(): void {
    if (this.embedded()) this.cancelled.emit();
    else this.router.navigate(['/masters/broker-master']);
  }

  private toFormValues(broker: BrokerMaster): Record<string, string> {
    return {
      brokerName: broker.brokerName ?? '',
      brokerCode: broker.brokerCode ?? '',
      location: broker.location ?? '',
      priority: broker.priority ?? '',
      contactPerson1: broker.contactPerson1 ?? '',
      contactPerson2: broker.contactPerson2 ?? '',
      contactNumber1: broker.contactNumber1 ?? '',
      contactNumber2: broker.contactNumber2 ?? '',
      email: broker.email ?? '',
      address: broker.address ?? '',
      isActive: broker.isActive ? 'Yes' : 'No',
    };
  }
}