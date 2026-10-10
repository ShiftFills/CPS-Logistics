export interface OriginBranch {
  id?: number;
  name: string;
  code: string;
  state: string;
  country: string;
  contactPerson: string;
  panNo: string;
  gstNo: string;
  creditLimit: number;
  creditDays: number;
  paymentMode: string;
  isActive?: boolean;
  cityName?: string;
  contactNo?: string;
  email?: string;
  address?: string;
  prefix?: string;
  openingBalance?: number;
  username?: string;
  password?: string;
}
