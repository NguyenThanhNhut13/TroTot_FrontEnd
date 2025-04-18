import { GetRoomsResponse } from '../types/room.type'
import http from '../utils/http'

export const URL_GET_ROOMS = 'api/v1/rooms'

const roomApi = {
  getRooms(params: {
    page?: number
    size?: number
    sort?: string
  }) {
    return http.get<GetRoomsResponse>(URL_GET_ROOMS, { params }) // roomApi.getRooms({ page: 0, size: 10, sort: 'createdAt,desc' })

  }
}

export default roomApi
