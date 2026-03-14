export interface User {
  id: string;
  phoneNumber: string;
  email?: string;
  firstName: string;
  lastName: string;
  avatarUrl?: string;
  dateOfBirth?: string;
  gender?: 'male' | 'female';
  address?: string;
  profession?: string;
  kycStatus: 'pending' | 'verified' | 'rejected';
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}
