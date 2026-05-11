export interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  contactInfo: string;
  role: string;
}

export interface TaxpayerProfile {
  taxpayerId: number;
  taxpayerIdNumber: string;
  type: string;
  user: User; // This links the nested object
}

export interface taxpayerDocument{
  docType: string,
  fileUri: string,
  id: number,
  uploadedDate: string,
  verificationStatus: string
}