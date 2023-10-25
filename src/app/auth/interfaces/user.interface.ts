export interface User {
  id: number;
  name: string;
  surnames: string;
  password?: string;
  email: string;
  country: string;
  city: string;
  address: string;
  iban?: string;
}