import { GetRoomsResponse } from "../types/room.type";
import http from "../utils/http";
import { SuccessResponse } from "../types/utils.type";
import {
  Amenity,
  CreateRoomDTO,
  SurroundingArea,
  TargetAudience,
} from "../types/room.type";

export const URL_GET_ROOMS = "api/v1/rooms";

const roomApi = {
  getRooms(
    params: {
      page?: number;
      size?: number;
      sort?: string;
      roomType?: "APARTMENT" | "WHOLE_HOUSE" | "BOARDING_HOUSE";
    } = {}
  ) {
    const { page = 0, size = 25, sort = "createdAt,desc", roomType } = params;

    return http.get<GetRoomsResponse>(URL_GET_ROOMS, {
      params: { page, size, sort, roomType },
    });
  },

  createRoom(formData: FormData) {
    return http.post<SuccessResponse<CreateRoomDTO>>(URL_GET_ROOMS, formData, {
      headers: {
        "Content-Type": "multipart/form-data",
        // Authorization header is handled by the interceptor
      },
    });
  },

  getAmenities() {
    return http.get<SuccessResponse<Amenity[]>>(URL_GET_ROOMS + "/amenities");
  },

  getTargetAudiences() {
    return http.get<SuccessResponse<TargetAudience[]>>(
      URL_GET_ROOMS + "/target-audiences"
    );
  },

  getSurroundingAreas() {
    return http.get<SuccessResponse<SurroundingArea[]>>(
      URL_GET_ROOMS + "/surrounding-areas"
    );
  },
};

export default roomApi;
