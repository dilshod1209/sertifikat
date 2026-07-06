export type CertificateTemplate = 'blue' | 'gold' | 'green' | 'crimson' | 'purple' | 'classic_dark' | 'emerald';

export interface User {
  id: string;
  username: string;
  fullName: string;
}

export interface Certificate {
  id: string;
  userId: string;
  orgName: string;
  certId: string; // custom public ID e.g., '093-060250'
  recipientName: string;
  courseDescription: string;
  certTitle?: string;
  courseDescriptionShort?: string;
  date: string;
  signee: string;
  location: string;
  template: CertificateTemplate;
  recipientFont?: string;
  createdAt: string;
  updatedAt?: string;
}
