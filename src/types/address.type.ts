export interface Address {
    id: number;
    province: string;
    district: string;
    ward: string;
    street: string;
    houseNumber: string;
    latitude: number | null;
    longitude: number | null;
  }