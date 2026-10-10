export interface DriverMaster {
  id?: number;
  branchId: number | null;
  branchName: string;
  driverName: string;
  joinDate: string;          // ISO yyyy-mm-dd (formatted to dd-mm-yyyy only for display)
  contactNo: string;
  residenceContactNo: string;
  licenceNo: string;
  licenceType: string;       // 'Heavy' | 'Light'
  licenceValidity: string;   // ISO yyyy-mm-dd
  address: string;
  bankName: string;
  accountNo: string;
  ifscCode: string;
  gpayNo: string;
  isActive: boolean;
  licenceFileName?: string;  // shown in the edit dialog with "View Licence"
}