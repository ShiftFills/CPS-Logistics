/** One row in the "Unassigned Leads" table. */
export interface UnassignedLead {
  leadId: string;   // display id, e.g. LD-2403 (also the unique key)
  customer: string;
  contact: string;
  route: string;    // e.g. CHN→BLR
  date: string;     // ISO yyyy-mm-dd, shown as "19 Sep" with the date pipe
}

/** One page of results, shaped like a typical paged API response. */
export interface PagedResult<T> {
  items: T[];
  total: number;
}

/** What the Assign Leads button sends. */
export interface AssignLeadsRequest {
  leadIds: string[];
  executiveId: string;
  remarks: string;
}