export type EnquiryStatus =
  | 'In progress'
  | 'Follow-up'
  | 'Enquiry'
  | 'Need to confirm'
  | 'Assigned'
  | 'Confirmed';

export type EnquiryPriority = 'High' | 'Medium' | 'Low';

export interface Enquiry {
  enquiryId: string;
  customer: string;
  contact: string;
  location: string;
  shipment: string;
  pickupDate: string;
  status: EnquiryStatus;
  priority: EnquiryPriority;
}