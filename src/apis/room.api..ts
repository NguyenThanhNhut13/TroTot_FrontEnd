import { GetRoomsResponse } from "../types/room.type";
import http from "../utils/http";

export const URL_GET_ROOMS = "api/v1/rooms";

const roomApi = {
  getRooms(
    params: {
      page?: number;
      size?: number;
      sort?: string;
      roomType?: 'APARTMENT' | 'WHOLE_HOUSE' | 'BOARDING_HOUSE';
    } = {}
  ) {
    const { page = 0, size = 2, sort = "createdAt,desc", roomType } = params;

    return http.get<GetRoomsResponse>(URL_GET_ROOMS, {
      params: { page, size, sort, roomType },
    });
  },
};

export default roomApi;
