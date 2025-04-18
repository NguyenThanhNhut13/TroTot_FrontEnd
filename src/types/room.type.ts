import { SuccessResponse } from "./utils.type";

export type RoomImage = {
    id: number;
    publicId: string;
    imageUrl: string;
  };
  
  export type Amenity = {
    id: number;
    name: string;
  };
  
  export type SurroundingArea = {
    id: number;
    name: string;
  };
  
  export type TargetAudience = {
    id: number;
    name: string;
  };
  
  export type Room = {
    id: number;
    userId: number;
    address: string | null;
    title: string;
    description: string;
    price: number;
    area: number;
    selfManaged: boolean;
    totalRooms: number;
    maxPeople: number;
    forGender: 'ALL' | 'MALE' | 'FEMALE';
    deposit: number;
    posterName: string;
    posterPhone: string;
    images: RoomImage[];
    roomType: 'APARTMENT' | 'WHOLE_HOUSE' | 'BOARDING_HOUSE';
    amenities: Amenity[];
    surroundingAreas: SurroundingArea[];
    targetAudiences: TargetAudience[];
    numberOfLivingRooms: number;
    numberOfKitchens: number;
    numberOfBathrooms: number;
    numberOfBedrooms: number;
    createdAt: string;
    updatedAt: string;
  };
  
  export type PaginatedRoomResponse = {
    content: Room[];
    page: number;
    size: number;
    totalElements: number;
    totalPages: number;
    last: boolean;
  };
  
  export type GetRoomsResponse = SuccessResponse<PaginatedRoomResponse>;