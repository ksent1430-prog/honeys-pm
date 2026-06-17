export type UserRole = 'SUPER_ADMIN' | 'EMPLOYEE' | 'PROPERTY_OWNER' | 'TENANT' | 'SERVICE_CONTRACTOR';

export interface User {
  id: string;
  email: string;
  firstName?: string;
  lastName?: string;
  role: UserRole;
  phoneNumber?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Property {
  id: string;
  address: string;
  city: string;
  state: string;
  zipCode: string;
  propertyType?: string;
  bedroomCount?: number;
  bathroomCount?: string;
  rentAmount?: string;
  status: string;
  createdAt: Date;
  updatedAt: Date;
}

// Add more types as needed...
