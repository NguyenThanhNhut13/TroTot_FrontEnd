import { GetRoomsResponse, RoomSearchParams } from "../types/room.type";
import http from "../utils/http";
import { SuccessResponse } from "../types/utils.type";
import {
  Amenity,
  CreateRoomDTO,
  SurroundingArea,
  TargetAudience,
} from "../types/room.type";

export const URL_GET_ROOMS = "api/v1/rooms";
export const URL_SEARCH_ROOMS = "api/v1/rooms/search";



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

  saveRoom(room: CreateRoomDTO) {
    return http.post<SuccessResponse<CreateRoomDTO>>(URL_GET_ROOMS, room);
  },

  async createRoom(
    data: FormData
  ): Promise<{ data: { success: boolean; message?: string } }> {
    // Gửi yêu cầu POST với FormData
    return http.post(URL_GET_ROOMS, data, {
      headers: { "Content-Type": "multipart/form-data" },
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

  searchRooms(params: RoomSearchParams = {}) {
    const {
      page = 0,
      size = 25,
      sort = "createdAt,desc",
    } = params;
    const formattedParams: Record<
      string,
      string | number | boolean | string[] | undefined
    > = {
      ...params,
      page,
      size,
      sort,
    };

    // Handle array parameters
    if (Array.isArray(params.amenities)) {
      formattedParams.amenities = params.amenities.join(",");
    }

    if (Array.isArray(params.environment)) {
      formattedParams.environment = params.environment.join(",");
    }

    if (Array.isArray(params.targetAudience)) {
      formattedParams.targetAudience = params.targetAudience.join(",");
    }

    return http.get<GetRoomsResponse>(URL_SEARCH_ROOMS, {
      params: formattedParams,
    });
  },
};

export default roomApi;
