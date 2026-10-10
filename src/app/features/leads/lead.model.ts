
export type LeadStatus = 'Draft' | 'New';

/** The fields captured in Section 1 "Primary Lead Details". */
export interface LeadPrimaryDetails {
  dateOfContact: string; // yyyy-mm-dd, the value the date picker emits
  customerName: string;
  contactPersonName: string;
  designation: string;
  contactNumber: string;
  emailId: string;
  additionalDetails: string;
}

export interface Lead extends LeadPrimaryDetails {
  id: number;
  leadId: string; // display id, e.g. LD-2421
  status: LeadStatus;
  createdAt: string; // ISO date-time
}

export interface LeadRequirementDetails {
  route: string;
  frequency: string;
  approximateVolume: string;
  vehicleRequirement: string;
  localTransportation: string;
  dedicatedVehicle: string;
  otherRequirements: string;
}

/** Section 3 "Existing Transporter Details". */
export interface LeadTransporterDetails {
  transporterName: string;
  existingRate: string;
  vehicleType: string;
  serviceRoute: string;
  customerComments: string;
  willingToShareRate: string; // 'Yes' | 'No'
}

/** Section 4 "Proposed / Expected Business". */
export interface LeadProposedBusiness {
  expectedRate: string;
  monthlyBusinessValue: string;
  potentialRoutes: string;
  expectedStartDate: string; // yyyy-mm-dd
  businessRequirement: string; // 'Immediate' | 'Future'
  possibilityOfBusiness: string;
}

