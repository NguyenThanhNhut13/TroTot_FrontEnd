import { User, UserRespone } from '../types/user.type'
import http from '../utils/http'

export const URL_GET_PROFILE = 'api/v1/users/profile'

const userApi = {
  getProfile() {
    return http.get<UserRespone>(URL_GET_PROFILE)
  }
}

export default userApi
