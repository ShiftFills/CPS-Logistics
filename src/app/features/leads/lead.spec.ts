import { TestBed } from '@angular/core/testing';
import { firstValueFrom } from 'rxjs';
import { LeadService } from './lead';

describe('LeadService', () => {
  let service: LeadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(LeadService);
  });

  it('creates a lead with an id and the New status', async () => {
    const lead = await firstValueFrom(
      service.create({
        dateOfContact: '2026-10-09',
        customerName: 'Balaji Logistics',
        contactPersonName: 'Ravi',
        designation: 'Manager',
        contactNumber: '9876543210',
        emailId: 'ravi@balaji.com',
        additionalDetails: '',
      }),
    );

    expect(lead.status).toBe('New');
    expect(lead.leadId).toMatch(/^LD-\d+$/);
    expect(lead.customerName).toBe('Balaji Logistics');
  });

  it('saves a partial draft with the Draft status and empty defaults', async () => {
    const draft = await firstValueFrom(service.saveDraft({ customerName: 'Meena Textiles' }));

    expect(draft.status).toBe('Draft');
    expect(draft.customerName).toBe('Meena Textiles');
    expect(draft.emailId).toBe('');
  });

  it('gives each lead a different id', async () => {
    const first = await firstValueFrom(service.saveDraft({}));
    const second = await firstValueFrom(service.saveDraft({}));

    expect(second.id).not.toBe(first.id);
  });

  it('provides designation options', () => {
    expect(service.getDesignationOptions().length).toBeGreaterThan(0);
  });
});