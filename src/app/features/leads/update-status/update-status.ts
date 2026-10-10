import { Component, effect, input, output, signal } from '@angular/core';
import { Badge, BadgeType } from '../../../shared/components/badge/badge';
import { Button } from '../../../shared/components/button/button';
import { DatePicker } from '../../../shared/components/date-picker/date-picker';
import { Input } from '../../../shared/components/input/input';
import { Modal } from '../../../shared/components/modal/modal';
import { Select, SelectOption } from '../../../shared/components/select/select';
import { Textarea } from '../../../shared/components/textarea/textarea';

export interface LeadStatusDialogLead {
  leadId: string;
  customer: string;
  status: string;
}

export interface LeadStatusHistoryEntry {
  contactDate: string;
  followUpDate: string;
  feedback: string;
  updatedBy: string;
  status: string;
}

export interface LeadStatusUpdate {
  leadId: string;
  status: string;
  followUpDate: string;
  feedback: string;
}

@Component({
  selector: 'app-update-status',
  imports: [Modal, Input, Select, DatePicker, Textarea, Button, Badge],
  templateUrl: './update-status.html',
  styleUrl: './update-status.scss',
})
export class UpdateStatus {
  lead = input<LeadStatusDialogLead | null>(null);
  history = input<LeadStatusHistoryEntry[]>([]);
  closed = output<void>();
  saved = output<LeadStatusUpdate>();

  status = signal('');
  followUpDate = signal('');
  feedback = signal('');
  formError = signal('');

  readonly statusOptions: SelectOption[] = [
    { label: 'New', value: 'New' },
    { label: 'In progress', value: 'In progress' },
    { label: 'Follow-up', value: 'Follow-up' },
  ];

  constructor() {
    effect(() => {
      const lead = this.lead();
      if (!lead) {
        this.formError.set('');
        return;
      }

      this.status.set(lead.status);
      this.followUpDate.set('');
      this.feedback.set('');
      this.formError.set('');
    });
  }

  badgeType(status: string): BadgeType {
    switch (status) {
      case 'Enquiry':
        return 'success';
      case 'Follow-up':
        return 'warning';
      case 'In progress':
        return 'info';
      case 'Rejected':
        return 'error';
      default:
        return 'neutral';
    }
  }

  submit(event: Event): void {
    event.preventDefault();
    const lead = this.lead();
    const feedback = this.feedback().trim();

    if (!lead || !this.status() || !this.followUpDate() || !feedback) {
      this.formError.set('Complete all required fields before saving.');
      return;
    }

    this.saved.emit({
      leadId: lead.leadId,
      status: this.status(),
      followUpDate: this.followUpDate(),
      feedback,
    });
  }
}
