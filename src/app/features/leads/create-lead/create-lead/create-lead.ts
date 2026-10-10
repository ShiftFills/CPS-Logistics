import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject, signal, WritableSignal } from '@angular/core';
import { PageHeading } from '../../../../shared/components/page-heading/page-heading';
import { AccordionSection } from '../../../../shared/components/accordion-section/accordion-section/accordion-section';
import { Input } from '../../../../shared/components/input/input';
import { Select } from '../../../../shared/components/select/select';
import { DatePicker } from '../../../../shared/components/date-picker/date-picker';
import { Textarea } from '../../../../shared/components/textarea/textarea';
import { Button } from '../../../../shared/components/button/button';
import { Label } from '../../../../shared/components/label/label';
import { Radio } from '../../../../shared/components/radio/radio';
import {
  LeadPrimaryDetails,
  LeadProposedBusiness,
  LeadRequirementDetails,
  LeadTransporterDetails,
} from '../../lead.model';
import { LeadService } from '../../lead';

@Component({
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [
    CommonModule,
    PageHeading,
    AccordionSection,
    Input,
    Select,
    DatePicker,
    Textarea,
    Button,
    Label,
    Radio,
  ],
  selector: 'app-create-lead',
  styleUrl: './create-lead.scss',
  templateUrl: './create-lead.html',
})
export class CreateLead {
  private readonly leadService = inject(LeadService);

  /** Static lists, read once instead of being recomputed on every render. */
  protected readonly designationOptions = this.leadService.getDesignationOptions();
  protected readonly requirementOptions = this.leadService.getRequirementOptions();
  protected readonly leadSourceOptions = this.leadService.getLeadSourceOptions();

  /** Section 1. Validation and submit are added in the next steps. */
  protected readonly form = signal<LeadPrimaryDetails>({
    dateOfContact: '',
    customerName: '',
    contactPersonName: '',
    designation: '',
    contactNumber: '',
    emailId: '',
    additionalDetails: '',
  });

  /** Section 2. */
  protected readonly requirements = signal<LeadRequirementDetails>({
    route: '',
    frequency: '',
    approximateVolume: '',
    vehicleRequirement: '',
    localTransportation: '',
    dedicatedVehicle: '',
    otherRequirements: '',
  });

  /** Section 3. "Yes" is pre-selected, as in the design. */
  protected readonly transporter = signal<LeadTransporterDetails>({
    transporterName: '',
    existingRate: '',
    vehicleType: '',
    serviceRoute: '',
    customerComments: '',
    willingToShareRate: 'Yes',
  });

  /** Section 4. "Immediate" is pre-selected, as in the design. */
  protected readonly business = signal<LeadProposedBusiness>({
    expectedRate: '',
    monthlyBusinessValue: '',
    potentialRoutes: '',
    expectedStartDate: '',
    businessRequirement: 'Immediate',
    possibilityOfBusiness: '',
  });

  /** Section 5. */
  protected readonly remarks = signal('');

  /** Section 6. */
  protected readonly leadSource = signal('');

  /** One setter for every section's signal: patch(sectionSignal, 'field', value). */
  protected patch<T, K extends keyof T>(state: WritableSignal<T>, field: K, value: T[K]): void {
    state.update(current => ({ ...current, [field]: value }));
  }
}
